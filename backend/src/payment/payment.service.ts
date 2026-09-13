import { Injectable, NotFoundException, Logger, Inject } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PLAN_PRICES } from './payment.constant';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { XenditWebhook, XenditWebhookPayload } from './payment.types';
import type { PaymentProvider } from './payment-provider.interface';
import { SubscriptionService } from 'src/subscription/subscription.service';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private readonly frontendUrl: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly subscriptionService: SubscriptionService,

    @Inject('PAYMENT_PROVIDER')
    private readonly paymentProvider: PaymentProvider,
  ) {
    this.frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
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

    const session = await this.paymentProvider.createSubscription({
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

  async cancelSubscription(userId: string) {
    return this.subscriptionService.scheduleCancellation(userId);
  }

  async handleXenditWebhook(payload: XenditWebhook) {
    this.logger.log({ event: 'payment_webhook_received' });

    const data = payload.data || payload;
    const eventName = (
      payload.event ||
      payload.type ||
      data.status ||
      ''
    ).toLowerCase();
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

  private async activateAndSavePayment(data: XenditWebhookPayload) {
    const externalId =
      data.external_id ||
      data.externalId ||
      data.reference_id ||
      data.referenceId ||
      '';
    const parts = externalId.split('_');

    const rawUserId =
      data.metadata?.userId ||
      data.metadata?.user_id ||
      (parts.length >= 2 && parts[0] === 'sub' ? parts[1] : null);

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const userId = rawUserId && uuidRegex.test(rawUserId) ? rawUserId : null;

    if (!userId) {
      this.logger.warn({ event: 'payment_webhook_invalid_user' });
      return;
    }

    const userExists = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!userExists) {
      this.logger.warn({ event: 'payment_webhook_user_not_found' });
      return;
    }

    let interval: 'month' | 'year' = 'month';
    if (
      data.metadata?.billingInterval === 'year' ||
      parts.includes('year') ||
      parts.includes('annual')
    ) {
      interval = 'year';
    }

    const amount = Number(
      data.amount ||
        data.paid_amount ||
        (interval === 'year'
          ? PLAN_PRICES.pro.annual
          : PLAN_PRICES.pro.monthly),
    );
    const currency = data.currency || 'PHP';

    const now = new Date();
    const currentPeriodEnd = new Date(now);
    if (interval === 'year') {
      currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1);
    } else {
      currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);
    }

    const subscription = await this.subscriptionService.activateProSubscription(
      userId,
      {
        billingInterval: interval,
        amount,
        currency,
        startDate: now,
        endDate: currentPeriodEnd,
      },
    );

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

    this.logger.log({ event: 'payment_subscription_activated' });
  }

  private async markPaymentFailed(data: XenditWebhookPayload) {
    const externalId =
      data.external_id || data.externalId || data.reference_id || '';
    const parts = externalId.split('_');
    const rawUserId =
      data.metadata?.userId ||
      (parts.length >= 2 && parts[0] === 'sub' ? parts[1] : null);

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const userId = rawUserId && uuidRegex.test(rawUserId) ? rawUserId : null;

    if (userId) {
      await this.subscriptionService.markSubscriptionPastDue(userId);
      this.logger.log({ event: 'payment_subscription_past_due' });
    } else {
      this.logger.warn(
        `Could not extract a valid UUID userId for failed payment webhook`,
      );
    }
  }
}
