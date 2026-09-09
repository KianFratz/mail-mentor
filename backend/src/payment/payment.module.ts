import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { XenditPaymentProvider } from './xendit-provider.service';
import { SubscriptionModule } from 'src/subscription/subscription.module';

@Module({
  imports: [SubscriptionModule],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    XenditPaymentProvider,
    {
      provide: 'PAYMENT_PROVIDER',
      useExisting: XenditPaymentProvider,
    },
  ],
  exports: ['PAYMENT_PROVIDER'],
})
export class PaymentModule {}
