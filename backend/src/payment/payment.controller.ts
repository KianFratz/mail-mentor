import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { XenditWebhook } from './payment.types';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(JwtAuthGuard)
  @Post('subscription')
  async createSubscription(
    @CurrentUser('userId') userId: string,
    @Body() dto: CreateSubscriptionDto,
  ) {
    return this.paymentService.createSubscription(userId, dto);
  }

  @Post('webhook')
  async handleWebhook(@Body() payload: XenditWebhook) {
    return this.paymentService.handleXenditWebhook(payload);
  }
}
