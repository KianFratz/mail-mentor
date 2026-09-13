import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { PLAN_LIMITS } from './subscription.constant';

@Injectable()
export class SubscriptionService {
  constructor(private readonly prisma: PrismaService) {}

  async getSubscription(userId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    return this.normalizeExpiredCancellation(subscription);
  }

  async checkUsage(userId: string, type: 'aiReply' | 'feedback') {
    const sub = await this.getOrProvisionFree(userId);
    const limits = PLAN_LIMITS[sub.plan];
    const field = type === 'aiReply' ? 'aiReplyUsedToday' : 'feedbackUsedToday';
    const limitKey = type === 'aiReply' ? 'aiRepliesPerDay' : 'feedbacksPerDay';
    const limit = limits[limitKey] as number;

    if (limit === Infinity) {
      return;
    }

    const now = new Date();

    const todayUtc = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
    );

    await this.prisma.$transaction(async (tx) => {
      // Lock this subscription row so concurrent requests
      // cannot perform the reset simultaneously.
      const current = await tx.subscription.findUnique({
        where: { userId },
      });

      if (!current) {
        throw new Error('Subscription not found');
      }

      const resetAt = current.usageResetAt ?? new Date(0);

      const resetDateUtc = new Date(
        Date.UTC(
          resetAt.getUTCFullYear(),
          resetAt.getUTCMonth(),
          resetAt.getUTCDate(),
        ),
      );

      const isNewDay = todayUtc.getTime() !== resetDateUtc.getTime();

      if (isNewDay) {
        await tx.subscription.update({
          where: { userId },
          data: {
            aiReplyUsedToday: 0,
            feedbackUsedToday: 0,
            usageResetAt: todayUtc,
          },
        });
      }

      // Atomic quota check + increment
      const result = await tx.subscription.updateMany({
        where: { userId, [field]: { lt: limit } },
        data: {
          [field]: {
            increment: 1,
          },
        },
      });

      if (result.count === 0) {
        throw new HttpException(
          `Daily ${type} limit reached. Upgrade to Pro for unlimited access.`,
          HttpStatus.PAYMENT_REQUIRED,
        );
      }
    });
  }

  async getOrProvisionFree(userId: string) {
    const existing = await this.getSubscription(userId);

    if (existing) return existing;

    return this.prisma.subscription.create({
      data: {
        userId,
        plan: 'free',
        status: 'active',
        billingInterval: 'month',
        amount: 0,
        currency: 'PHP',
      },
    });
  }

  async getPlanLimits(userId: string) {
    const sub = await this.getOrProvisionFree(userId);
    const limits = PLAN_LIMITS[sub?.plan];

    return {
      plan: sub?.plan,
      status: sub?.status,
      billingInterval: sub?.billingInterval,
      currentPeriodEnd: sub?.currentPeriodEnd,
      cancelAtPeriodEnd: sub?.cancelAtPeriodEnd,
      limits,
      usage: {
        aiReplyUsedToday: sub?.aiReplyUsedToday,
        feedbackUsedToday: sub?.feedbackUsedToday,
        usageResetAt: sub?.usageResetAt,
      },
    };
  }

  async activateProSubscription(
    userId: string,
    details: {
      billingInterval: 'month' | 'year';
      amount: number;
      currency: string;
      startDate?: Date;
      endDate?: Date;
    },
  ) {
    const startDate = details.startDate ?? new Date();

    const endDate =
      details.endDate ??
      new Date(
        startDate.getTime() +
          (details.billingInterval === 'month'
            ? 30 * 24 * 60 * 60 * 1000
            : 365 * 24 * 60 * 60 * 1000),
      );

    return this.prisma.subscription.upsert({
      where: { userId },
      create: {
        userId,
        plan: 'pro',
        status: 'active',
        billingInterval: details.billingInterval,
        amount: details.amount,
        currency: details.currency,
        currentPeriodStart: startDate,
        currentPeriodEnd: endDate,
      },
      update: {
        plan: 'pro',
        status: 'active',
        billingInterval: details.billingInterval,
        amount: details.amount,
        currency: details.currency,
        currentPeriodStart: startDate,
        currentPeriodEnd: endDate,
        cancelAtPeriodEnd: false,
      },
    });
  }

  async scheduleCancellation(userId: string) {
    const subscription = await this.getSubscription(userId);

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    if (subscription.plan !== 'pro' || subscription.status !== 'active') {
      throw new BadRequestException(
        'Only an active Pro subscription can be canceled',
      );
    }

    if (!subscription.currentPeriodEnd) {
      throw new BadRequestException(
        'Subscription billing period is unavailable',
      );
    }

    const updated = subscription.cancelAtPeriodEnd
      ? subscription
      : await this.prisma.subscription.update({
          where: { userId },
          data: { cancelAtPeriodEnd: true },
        });

    return this.toPlanDetails(updated);
  }

  async markSubscriptionPastDue(userId: string) {
    return this.prisma.subscription.updateMany({
      where: { userId },
      data: { status: 'past_due' },
    });
  }

  private async normalizeExpiredCancellation(subscription: any) {
    if (
      !subscription?.cancelAtPeriodEnd ||
      !subscription.currentPeriodEnd ||
      subscription.currentPeriodEnd > new Date()
    ) {
      return subscription;
    }

    return this.prisma.subscription.update({
      where: { userId: subscription.userId },
      data: {
        plan: 'free',
        status: 'canceled',
        amount: 0,
        cancelAtPeriodEnd: false,
        currentPeriodStart: null,
        currentPeriodEnd: null,
      },
    });
  }

  private toPlanDetails(subscription: any) {
    return {
      plan: subscription.plan,
      status: subscription.status,
      billingInterval: subscription.billingInterval,
      currentPeriodEnd: subscription.currentPeriodEnd,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      limits: PLAN_LIMITS[subscription.plan],
      usage: {
        aiReplyUsedToday: subscription.aiReplyUsedToday,
        feedbackUsedToday: subscription.feedbackUsedToday,
        usageResetAt: subscription.usageResetAt,
      },
    };
  }
}
