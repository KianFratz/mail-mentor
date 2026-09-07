import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { PrismaService } from '../../prisma/prisma.service';
import { XenditPaymentProvider } from './xendit-provider.service';

describe('PaymentService', () => {
  let service: PaymentService;
  let prismaService: any;
  let xenditProvider: any;

  beforeEach(async () => {
    prismaService = {
      user: {
        findUnique: jest.fn(),
      },
      subscription: {
        findUnique: jest.fn(),
        upsert: jest.fn(),
        updateMany: jest.fn(),
      },
      payment: {
        upsert: jest.fn(),
      },
    };

    xenditProvider = {
      createSubscription: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        { provide: PrismaService, useValue: prismaService },
        { provide: XenditPaymentProvider, useValue: xenditProvider },
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
      prismaService.subscription.upsert.mockResolvedValue({
        id: 'sub-uuid',
        userId: 'user-123',
        plan: 'pro',
        status: 'active',
      });
      prismaService.payment.upsert.mockResolvedValue({
        id: 'pay-uuid',
        referenceId: 'sub_user-123_month_12345',
        status: 'SUCCEEDED',
      });

      const webhookPayload = {
        id: 'inv_123',
        external_id: 'sub_user-123_month_12345',
        status: 'PAID',
        amount: 449,
        paid_amount: 449,
        currency: 'PHP',
        paid_at: '2026-09-07T12:00:00.000Z',
      };

      const res = await service.handleXenditWebhook(webhookPayload as any);

      expect(res).toEqual({ status: 'success' });
      expect(prismaService.subscription.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 'user-123' },
          create: expect.objectContaining({
            plan: 'pro',
            status: 'active',
            billingInterval: 'month',
            amount: 449,
          }),
        }),
      );
      expect(prismaService.payment.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { referenceId: 'sub_user-123_month_12345' },
          create: expect.objectContaining({
            userId: 'user-123',
            amount: 449,
            status: 'SUCCEEDED',
          }),
        }),
      );
    });
  });
});

