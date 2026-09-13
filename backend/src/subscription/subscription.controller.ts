import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { SubscriptionService } from './subscription.service';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { PaymentService } from 'src/payment/payment.service';
import { CreateSubscriptionDto } from 'src/payment/dto/create-subscription.dto';

@Controller('subscription')
export class SubscriptionController {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly paymentService: PaymentService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Throttle({ 'auth-sensitive': { ttl: 900000, limit: 10 } })
  @Post()
  async createSubscription(
    @CurrentUser('userId') userId: string,
    @Body() dto: CreateSubscriptionDto,
  ) {
    return this.paymentService.createSubscription(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Throttle({ 'auth-sensitive': { ttl: 900000, limit: 10 } })
  @Delete()
  async cancelSubscription(@CurrentUser('userId') userId: string) {
    return this.paymentService.cancelSubscription(userId);
  }

  @UseGuards(JwtAuthGuard)
  @SkipThrottle({ default: true, 'auth-sensitive': true })
  @Get('me')
  async getMySubscription(@CurrentUser('userId') userId: string) {
    return this.subscriptionService.getPlanLimits(userId);
  }
}
