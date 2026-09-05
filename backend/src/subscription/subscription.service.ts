import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { PLAN_LIMITS } from './subscription.constant';

@Injectable()
export class SubscriptionService {
  constructor(private readonly prisma: PrismaService) {}

  async getSubscription(userId: string) {
    return this.prisma.subscription.findUnique({ where: { id: userId } });
  }

  async checkUsage(userId: string, type: 'aiReply' | 'feedback') {
    const sub = await this.getOrProvisionFree(userId);
    const limits = PLAN_LIMITS[sub.plan];

    // Reset counters if a new day has started
    const now = new Date();
    const resetAt = sub.usageResetAt ?? new Date(0);
    const isNewDay = now.toDateString() !== resetAt.toDateString();

    if (isNewDay) {
      await this.prisma.subscription.update({
        where: { userId },
        data: { aiReplyUsedToday: 0, feedbackUsedToday: 0, usageResetAt: now },
      });

      sub.aiReplyUsedToday = 0;
      sub.feedbackUsedToday = 0;
    }

    const field = type === 'aiReply' ? 'aiReplyUsedToday' : 'feedbackUsedToday';
    const limitKey = type === 'aiReply' ? 'aiRepliesPerDay' : 'feedbacksPerDay';
    const used = sub[field] as number;
    const limit = limits[limitKey] as number;

    if (used >= limit) {
      throw new HttpException(
        `Daily ${type} limit reached. Upgrade to Pro for unlimited access.`,
        HttpStatus.PAYMENT_REQUIRED,
      );
    }

    await this.prisma.subscription.update({
      where: { userId },
      data: { [field]: { increment: 1 } },
    });
  }

  async getOrProvisionFree(userId: string) {
    const existing = await this.prisma.subscription.findUnique({
      where: { id: userId },
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
