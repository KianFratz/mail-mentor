import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { PrismaService } from '../../prisma/prisma.service';
import { SubscriptionService } from '../subscription/subscription.service';

describe('PaymentService', () => {
  let service: PaymentService;
  let prismaService: any;
  let xenditProvider: any;
  let subscriptionService: any;

  beforeEach(async () => {
    prismaService = {
      user: {
        findUnique: jest.fn(),
      },
      payment: {
        upsert: jest.fn(),
      },
    };

    xenditProvider = {
      createSubscription: jest.fn(),
    };

    subscriptionService = {
      activateProSubscription: jest.fn().mockResolvedValue({ id: 'sub-uuid' }),
      markSubscriptionPastDue: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        { provide: PrismaService, useValue: prismaService },
        { provide: SubscriptionService, useValue: subscriptionService },
        { provide: 'PAYMENT_PROVIDER', useValue: xenditProvider },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createSubscription', () => {
    it('should create subscription payment link for monthly plan (449 PHP)', async () => {
      prismaService.user.findUnique.mockResolvedValue({
        id: 'user-123',
        email: 'test@example.com',
      });
      xenditProvider.createSubscription.mockResolvedValue({
        id: 'inv_123',
        externalId: 'sub_user-123_month_123456789',
        status: 'PENDING',
        invoiceUrl: 'https://checkout.xendit.co/v2/inv_123',
        amount: 449,
        currency: 'PHP',
      });

      const result = await service.createSubscription('user-123', {
        plan: 'pro',
        interval: 'month',
      });

      expect(xenditProvider.createSubscription).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user-123',
          amount: 449,
          currency: 'PHP',
          payerEmail: 'test@example.com',
        }),
      );
      expect(result.checkoutUrl).toBe('https://checkout.xendit.co/v2/inv_123');
    });

    it('should create subscription payment link for annual plan (4308 PHP total for 359/mo)', async () => {
      prismaService.user.findUnique.mockResolvedValue({
        id: 'user-123',
        email: 'test@example.com',
      });
      xenditProvider.createSubscription.mockResolvedValue({
        id: 'inv_456',
        externalId: 'sub_user-123_year_123456789',
        status: 'PENDING',
        invoiceUrl: 'https://checkout.xendit.co/v2/inv_456',
        amount: 4308,
        currency: 'PHP',
      });

      const result = await service.createSubscription('user-123', {
        plan: 'pro',
        interval: 'year',
      });

      expect(xenditProvider.createSubscription).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user-123',
          amount: 4308,
          currency: 'PHP',
        }),
      );
      expect(result.checkoutUrl).toBe('https://checkout.xendit.co/v2/inv_456');
    });
  });

  describe('handleXenditWebhook', () => {
    it('should activate subscription and record payment when invoice is PAID in Xendit testing environment', async () => {
      const validUserId = '123e4567-e89b-12d3-a456-426614174000';
      prismaService.user.findUnique.mockResolvedValue({ id: validUserId });
      prismaService.payment.upsert.mockResolvedValue({
        id: 'pay-uuid',
        referenceId: `sub_${validUserId}_month_12345`,
        status: 'SUCCEEDED',
      });

      const webhookPayload = {
        id: 'inv_123',
        external_id: `sub_${validUserId}_month_12345`,
        status: 'PAID',
        amount: 449,
        paid_amount: 449,
        currency: 'PHP',
        paid_at: '2026-09-07T12:00:00.000Z',
      };

      const res = await service.handleXenditWebhook(webhookPayload as any);

      expect(res).toEqual({ status: 'success' });
      expect(subscriptionService.activateProSubscription).toHaveBeenCalledWith(
        validUserId,
        expect.objectContaining({
          billingInterval: 'month',
          amount: 449,
          currency: 'PHP',
        }),
      );
      expect(prismaService.payment.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { referenceId: `sub_${validUserId}_month_12345` },
          create: expect.objectContaining({
            userId: validUserId,
            subscriptionId: 'sub-uuid',
            amount: 449,
            status: 'SUCCEEDED',
          }),
        }),
      );
    });
  });
});


