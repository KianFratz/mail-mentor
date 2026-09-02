import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { XenditPaymentProvider } from './xendit-provider.service';
import { PLAN_PRICES } from './payment.constant';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

@Injectable()
export class PaymentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly xendit: XenditPaymentProvider,
  ) {}

  async createSubscription(userId: string, dto: CreateSubscriptionDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const price = PLAN_PRICES.pro.monthly;
    const referenceId = `sub_${userId}_${Date.now()}`;

    const session = await this.xendit.createSubscription({
      customerId: user.id,
      priceId: dto.plan || 'pro',
      currency: 'PHP',
      metadata: { referenceId, amount: price },
    });

    return session;
  }
}
