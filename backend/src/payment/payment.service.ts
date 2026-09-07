import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { XenditPaymentProvider } from './xendit-provider.service';
import { PLAN_PRICES } from './payment.constant';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { XenditWebhook } from './payment.types';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private readonly frontendUrl: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly xendit: XenditPaymentProvider,
  ) {
    this.frontendUrl =
      process.env.FRONTEND_URL || 'http://localhost:5173';
  }

  async createSubscription(userId: string, dto: CreateSubscriptionDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isAnnual = dto.interval === 'year' || dto.interval === 'annual';
    const interval = isAnnual ? 'year' : 'month';
    const price = isAnnual ? PLAN_PRICES.pro.annual : PLAN_PRICES.pro.monthly;
    const externalId = `sub_${userId}_${interval}_${Date.now()}`;

    const session = await this.xendit.createSubscription({
      userId: user.id,
      externalId,
      amount: price,
      currency: 'PHP',
      payerEmail: user.email,
      description: `Mail Mentor Pro Subscription (${isAnnual ? 'Annual - ₱359/mo' : 'Monthly - ₱449/mo'})`,
      successRedirectUrl: `${this.frontendUrl}/settings?payment=success`,
      failureRedirectUrl: `${this.frontendUrl}/pricing?payment=failed`,
      metadata: {
        userId: user.id,
        billingInterval: interval,
        plan: 'pro',
        amount: price,
      },
    });

    return {
      ...session,
      checkoutUrl: session.invoiceUrl || session.checkoutUrl,
      url: session.invoiceUrl || session.checkoutUrl,
    };
  }

  async handleXenditWebhook(payload: XenditWebhook) {
    this.logger.log(`Received Xendit webhook: ${JSON.stringify(payload)}`);

    const data = payload.data || payload;
    const eventName = (payload.event || payload.type || data.status || '').toLowerCase();
    const rawStatus = (data.status || '').toUpperCase();

    const isSuccess =
      eventName.includes('paid') ||
      eventName.includes('settled') ||
      eventName.includes('succeeded') ||
      eventName.includes('activated') ||
      rawStatus === 'PAID' ||
      rawStatus === 'SETTLED' ||
      rawStatus === 'SUCCEEDED' ||
      rawStatus === 'ACTIVE' ||
      rawStatus === 'COMPLETED';

    const isFailure =
      eventName.includes('failed') ||
      eventName.includes('expired') ||
      eventName.includes('deactivated') ||
      rawStatus === 'EXPIRED' ||
      rawStatus === 'FAILED' ||
      rawStatus === 'INACTIVE';

    if (isSuccess) {
      await this.activateAndSavePayment(data);
    } else if (isFailure) {
      await this.markPaymentFailed(data);
    }

    return { status: 'success' };
  }

  private async activateAndSavePayment(data: any) {
    const externalId = data.external_id || data.externalId || data.reference_id || data.referenceId || '';
    const parts = externalId.split('_');

    const rawUserId =
      data.metadata?.userId ||
      data.metadata?.user_id ||
      (parts.length >= 2 && parts[0] === 'sub' ? parts[1] : null);

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const userId = rawUserId && uuidRegex.test(rawUserId) ? rawUserId : null;

    if (!userId) {
      this.logger.warn(`Could not extract a valid UUID userId from webhook data (rawUserId: "${rawUserId}"): ${JSON.stringify(data)}`);
      return;
    }

    const userExists = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) {
      this.logger.warn(`User ${userId} from webhook does not exist in database`);
      return;
    }

    let interval: 'month' | 'year' = 'month';
    if (data.metadata?.billingInterval === 'year' || parts.includes('year') || parts.includes('annual')) {
      interval = 'year';
    }

    const amount = Number(data.amount || data.paid_amount || (interval === 'year' ? PLAN_PRICES.pro.annual : PLAN_PRICES.pro.monthly));
    const currency = data.currency || 'PHP';

    const now = new Date();
    const currentPeriodEnd = new Date(now);
    if (interval === 'year') {
      currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1);
    } else {
      currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);
    }

    const subscription = await this.prisma.subscription.upsert({
      where: { userId },
      update: {
        plan: 'pro',
        status: 'active',
        billingInterval: interval,
        amount,
        currency,
        providerSubId: data.id || data.recurring_plan_id || externalId,
        providerCustomerId: data.customer_id || data.payer_email || data.user_id,
        currentPeriodStart: now,
        currentPeriodEnd,
      },
      create: {
        userId,
        plan: 'pro',
        status: 'active',
        billingInterval: interval,
        amount,
        currency,
        providerSubId: data.id || data.recurring_plan_id || externalId,
        providerCustomerId: data.customer_id || data.payer_email || data.user_id,
        currentPeriodStart: now,
        currentPeriodEnd,
      },
    });

    const referenceId = externalId || `pay_${data.id || Date.now()}`;
    const paidAt = data.paid_at ? new Date(data.paid_at) : now;

    await this.prisma.payment.upsert({
      where: { referenceId },
      update: {
        status: 'SUCCEEDED',
        paidAt,
        amount,
        currency,
      },
      create: {
        userId,
        subscriptionId: subscription.id,
        referenceId,
        provider: 'xendit',
        providerPaymentId: data.id || data.payment_id || null,
        amount,
        currency,
        status: 'SUCCEEDED',
        paidAt,
      },
    });

    this.logger.log(`Subscription activated and payment saved for user ${userId}`);
  }

  private async markPaymentFailed(data: any) {
    const externalId = data.external_id || data.externalId || data.reference_id || '';
    const parts = externalId.split('_');
    const rawUserId = data.metadata?.userId || (parts.length >= 2 && parts[0] === 'sub' ? parts[1] : null);

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const userId = rawUserId && uuidRegex.test(rawUserId) ? rawUserId : null;

    if (userId) {
      await this.prisma.subscription.updateMany({
        where: { userId },
        data: { status: 'past_due' },
      });
      this.logger.log(`Subscription marked past_due for user ${userId}`);
    } else {
      this.logger.warn(`Could not extract a valid UUID userId for failed payment webhook`);
    }
  }
}
