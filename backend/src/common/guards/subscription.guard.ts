import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PLAN_KEY } from '../decorators/requires-plan.decorator';
import { Observable } from 'rxjs';
import { SubscriptionService } from 'src/subscription/subscription.service';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private subscriptionService: SubscriptionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPlan = this.reflector.getAllAndOverride<string>(PLAN_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPlan) return true;

    const request = context.switchToHttp().getRequest();
    const userId: string = request.user?.userId;
    if (!userId) return false;

    const { plan } = await this.subscriptionService.getOrProvisionFree(userId);

    if (plan !== requiredPlan) {
      throw new HttpException(
        `This feature requires a Pro subscription.`,
        HttpStatus.PAYMENT_REQUIRED,
      );
    }

    return true;
  }
}
