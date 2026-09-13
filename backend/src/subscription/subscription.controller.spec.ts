import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { PaymentService } from '../payment/payment.service';

describe('SubscriptionController', () => {
  let controller: SubscriptionController;
  const subscriptionService = { getPlanLimits: jest.fn() };
  const paymentService = {
    createSubscription: jest.fn(),
    cancelSubscription: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionController],
      providers: [
        { provide: SubscriptionService, useValue: subscriptionService },
        { provide: PaymentService, useValue: paymentService },
      ],
    }).compile();

    controller = module.get<SubscriptionController>(SubscriptionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('delegates checkout creation to PaymentService', async () => {
    const dto = { plan: 'pro', interval: 'month' };
    paymentService.createSubscription.mockResolvedValue({ id: 'invoice-id' });

    await expect(
      controller.createSubscription('user-id', dto),
    ).resolves.toEqual({
      id: 'invoice-id',
    });
    expect(paymentService.createSubscription).toHaveBeenCalledWith(
      'user-id',
      dto,
    );
  });

  it('delegates cancellation to PaymentService', async () => {
    paymentService.cancelSubscription.mockResolvedValue({
      cancelAtPeriodEnd: true,
    });

    await expect(controller.cancelSubscription('user-id')).resolves.toEqual({
      cancelAtPeriodEnd: true,
    });
    expect(paymentService.cancelSubscription).toHaveBeenCalledWith('user-id');
  });

  it('returns the current subscription details', async () => {
    subscriptionService.getPlanLimits.mockResolvedValue({ plan: 'pro' });

    await expect(controller.getMySubscription('user-id')).resolves.toEqual({
      plan: 'pro',
    });
    expect(subscriptionService.getPlanLimits).toHaveBeenCalledWith('user-id');
  });
});
