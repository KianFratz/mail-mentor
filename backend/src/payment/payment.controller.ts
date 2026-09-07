import {
  Body,
  Controller,
  Post,
  Headers,
  UseGuards,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { XenditWebhook } from './payment.types';
import { Throttle } from '@nestjs/throttler';

@Controller('payment')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(JwtAuthGuard)
  @Throttle({ 'auth-sensitive': { ttl: 900000, limit: 10 } })
  @Post('subscription')
  async createSubscription(
    @CurrentUser('userId') userId: string,
    @Body() dto: CreateSubscriptionDto,
  ) {
    return this.paymentService.createSubscription(userId, dto);
  }

  @Post('webhook')
  async handleWebhook(
    @Headers('x-callback-token') callbackToken: string,
    @Body() payload: XenditWebhook,
  ) {
    // Verify webhook token from Xendit
    const expectedToken = process.env.XENDIT_WEBHOOK_TOKEN;
    if (expectedToken && callbackToken !== expectedToken) {
      this.logger.warn(
        `Webhook rejected: invalid callback token. Received: ${callbackToken?.substring(0, 8)}...`,
      );
      throw new UnauthorizedException('Invalid webhook callback token');
    }

    return this.paymentService.handleXenditWebhook(payload);
  }
}
