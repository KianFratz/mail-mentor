import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { XenditPaymentProvider } from './xendit-provider.service';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { SubscriptionController } from 'src/subscription/subscription.controller';

@Module({
  imports: [SubscriptionModule],
  controllers: [PaymentController, SubscriptionController],
  providers: [
    PaymentService,
    XenditPaymentProvider,
    {
      provide: 'PAYMENT_PROVIDER',
      useExisting: XenditPaymentProvider,
    },
  ],
  exports: ['PAYMENT_PROVIDER', PaymentService],
})
export class PaymentModule {}
