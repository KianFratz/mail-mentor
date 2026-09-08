import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { PLAN_LIMITS } from './subscription.constant';
import { isThisHour } from 'date-fns';

@Injectable()
export class SubscriptionService {
  constructor(private readonly prisma: PrismaService) {}

  async getSubscription(userId: string) {
    return this.prisma.subscription.findUnique({ where: { userId } });
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
            incremenet: 1,
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
    const existing = await this.prisma.subscription.findUnique({
      where: { userId },
    });

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
      limits,
      usage: {
        aiReplyUsedToday: sub?.aiReplyUsedToday,
        feedbackUsedToday: sub?.feedbackUsedToday,
        usageResetAt: sub?.usageResetAt,
      },
    };
  }
}
