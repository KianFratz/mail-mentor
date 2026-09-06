import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MailModule } from 'src/mail/mail.module';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { SubscriptionGuard } from 'src/common/guards/subscription.guard';

@Module({
  imports: [MailModule, SubscriptionModule],
  controllers: [UsersController],
  providers: [UsersService, SubscriptionGuard],
  exports: [UsersService],
})
export class UsersModule {}
