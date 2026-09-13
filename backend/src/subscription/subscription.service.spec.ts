import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { SubscriptionService } from './subscription.service';

describe('SubscriptionService', () => {
  let service: SubscriptionService;
  let prisma: any;

  const activePro = (overrides: Record<string, unknown> = {}) => ({
    id: 'sub-id',
    userId: 'user-id',
    plan: 'pro',
    status: 'active',
    billingInterval: 'month',
    amount: 449,
    currency: 'PHP',
    currentPeriodEnd: new Date(Date.now() + 86_400_000),
    cancelAtPeriodEnd: false,
    aiReplyUsedToday: 0,
    feedbackUsedToday: 0,
    usageResetAt: new Date(),
    ...overrides,
  });

  beforeEach(async () => {
    prisma = {
      subscription: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        upsert: jest.fn(),
        updateMany: jest.fn(),
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    service = module.get<SubscriptionService>(SubscriptionService);
  });

  it('should be defined', () => expect(service).toBeDefined());

  it('schedules cancellation while preserving active Pro access', async () => {
    const subscription = activePro();
    prisma.subscription.findUnique.mockResolvedValue(subscription);
    prisma.subscription.update.mockResolvedValue({
      ...subscription,
      cancelAtPeriodEnd: true,
    });
    const result = await service.scheduleCancellation('user-id');
    expect(prisma.subscription.update).toHaveBeenCalledWith({
      where: { userId: 'user-id' },
      data: { cancelAtPeriodEnd: true },
    });
    expect(result).toEqual(
      expect.objectContaining({
        plan: 'pro',
        status: 'active',
        cancelAtPeriodEnd: true,
      }),
    );
  });

  it('treats repeated cancellation as idempotent', async () => {
    prisma.subscription.findUnique.mockResolvedValue(
      activePro({ cancelAtPeriodEnd: true }),
    );
    const result = await service.scheduleCancellation('user-id');
    expect(prisma.subscription.update).not.toHaveBeenCalled();
    expect(result.cancelAtPeriodEnd).toBe(true);
  });

  it('rejects cancellation when no subscription exists', async () => {
    prisma.subscription.findUnique.mockResolvedValue(null);
    await expect(
      service.scheduleCancellation('user-id'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('rejects cancellation for a Free subscription', async () => {
    prisma.subscription.findUnique.mockResolvedValue(
      activePro({ plan: 'free' }),
    );
    await expect(
      service.scheduleCancellation('user-id'),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('lazily downgrades an expired scheduled cancellation', async () => {
    const expired = activePro({
      cancelAtPeriodEnd: true,
      currentPeriodEnd: new Date(Date.now() - 1_000),
    });
    const downgraded = {
      ...expired,
      plan: 'free',
      status: 'canceled',
      amount: 0,
      cancelAtPeriodEnd: false,
      currentPeriodEnd: null,
    };
    prisma.subscription.findUnique.mockResolvedValue(expired);
    prisma.subscription.update.mockResolvedValue(downgraded);
    await expect(service.getSubscription('user-id')).resolves.toEqual(
      downgraded,
    );
    expect(prisma.subscription.update).toHaveBeenCalledWith({
      where: { userId: 'user-id' },
      data: expect.objectContaining({
        plan: 'free',
        status: 'canceled',
        cancelAtPeriodEnd: false,
      }),
    });
  });

  it('resets scheduled cancellation when Pro is activated again', async () => {
    prisma.subscription.upsert.mockResolvedValue(activePro());
    await service.activateProSubscription('user-id', {
      billingInterval: 'month',
      amount: 449,
      currency: 'PHP',
    });
    expect(prisma.subscription.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        update: expect.objectContaining({ cancelAtPeriodEnd: false }),
      }),
    );
  });
});
