import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { XenditPaymentProvider } from './xendit-provider.service';
import { PLAN_PRICES } from './payment.constant';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { XenditWebhook } from './payment.types';

@Injectable()
export class PaymentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly xendit: XenditPaymentProvider,
  ) {}

  async createSubscription(userId: string, dto: CreateSubscriptionDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const price = PLAN_PRICES.pro.monthly;
    const referenceId = `sub_${userId}_${Date.now()}`;

    const session = await this.xendit.createSubscription({
      customerId: user.id,
      priceId: dto.plan || 'pro',
      currency: 'PHP',
      metadata: { referenceId, amount: price },
    });

    return session;
  }

  async handleXenditWebhook(event: XenditWebhook) {
    const eventType = event.type || event.event;
    switch (eventType) {
      case 'recurring_plan.activated':
        await this.activateSubscription(event);
        break;

      case 'recurring.cycle.succeeded':
        await this.recordSuccessfulPayment(event);
        break;

      case 'recurring.cycle.failed':
        await this.markPastDue(event);
        break;

      case 'recurring_plan.deactivated':
        await this.cancelSubscription(event);
        break;

      case 'recurring.cycle.created':
        break;
    }

    return { status: 'success' };
  }

  private async activateSubscription(event: XenditWebhook) {
    const data = event.data;
    const userId =
      data.metadata?.userId ||
      data.user_id ||
      (data.reference_id ? data.reference_id.split('_')[1] : null);

    if (!userId) return;

    await this.prisma.subscription.upsert({
      where: { userId },
      update: {
        plan: 'pro',
        status: 'active',
        providerSubId: data.id || data.recurring_plan_id,
        providerCustomerId: data.customer_id || data.user_id,
      },
      create: {
        userId,
        plan: 'pro',
        status: 'active',
        billingInterval: 'month',
        amount: data.amount || PLAN_PRICES.pro.monthly,
        currency: data.currency || 'PHP',
        providerSubId: data.id || data.recurring_plan_id,
        providerCustomerId: data.customer_id || data.user_id,
      },
    });
  }

  private async recordSuccessfulPayment(event: XenditWebhook) {
    const data = event.data;
    const userId =
      data.metadata?.userId ||
      data.user_id ||
      (data.reference_id ? data.reference_id.split('_')[1] : null);

    if (!userId) return;

    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    if (subscription) {
      const nextPeriod = new Date();
      nextPeriod.setMonth(nextPeriod.getMonth() + 1);

      await this.prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          status: 'active',
          currentPeriodStart: new Date(),
          currentPeriodEnd: nextPeriod,
        },
      });

      await this.prisma.payment.create({
        data: {
          userId,
          subscriptionId: subscription.id,
          referenceId: data.reference_id || `pay_${Date.now()}`,
          provider: 'xendit',
          providerPaymentId: data.id || data.recurring_cycle_id,
          amount: data.amount || PLAN_PRICES.pro.monthly,
          currency: data.currency || 'PHP',
          status: 'SUCCEEDED',
          paidAt: new Date(),
        },
      });
    }
  }

  private async markPastDue(event: XenditWebhook) {
    const data = event.data;
    const userId =
      data.metadata?.userId ||
      data.user_id ||
      (data.reference_id ? data.reference_id.split('_')[1] : null);

    if (!userId) return;

    await this.prisma.subscription.updateMany({
      where: { userId },
      data: { status: 'past_due' },
    });
  }

  private async cancelSubscription(event: XenditWebhook) {
    const data = event.data;
    const userId =
      data.metadata?.userId ||
      data.user_id ||
      (data.reference_id ? data.reference_id.split('_')[1] : null);

    if (!userId) return;

    await this.prisma.subscription.updateMany({
      where: { userId },
      data: { status: 'canceled', plan: 'free' },
    });
  }
}
