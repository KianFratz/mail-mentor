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
import type { XenditWebhook } from './payment.types';
import { Throttle } from '@nestjs/throttler';
import crypto, { timingSafeEqual } from 'crypto';

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
    const expectedToken = process.env.XENDIT_WEBHOOK_TOKEN;

    if (!expectedToken) {
      this.logger.error(
        'XENDIT_WEBHOOK_TOKEN environment variable is not configured',
      );

      throw new UnauthorizedException('Webhook verification misconfigured');
    }

    if (!callbackToken) {
      this.logger.warn('Webhook rejected: missing callback token');

      throw new UnauthorizedException('Invalid webhook callback token');
    }

    const receivedToken = Buffer.from(callbackToken, 'utf8');
    const expectedTokenBuffer = Buffer.from(expectedToken, 'utf8');

    if (
      receivedToken.length !== expectedTokenBuffer.length ||
      !timingSafeEqual(receivedToken, expectedTokenBuffer)
    ) {
      this.logger.warn('Webhook rejected: invalid callback token');

      throw new UnauthorizedException('Invalid webhook callback token');
    }

    return this.paymentService.handleXenditWebhook(payload);
  }
}
