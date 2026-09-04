import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from 'prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { WritingSessionModule } from './writing-session/writing-session.module';
import { ScenariosModule } from './scenarios/scenarios.module';
import { AiModule } from './ai/ai.module';
import { AiController } from './ai/ai.controller';
import { SkillProficiencyModule } from './skill-proficiency/skill-proficiency.module';
import { RecentScoresModule } from './recent-scores/recent-scores.module';
import { StreakModule } from './streak/streak.module';
import { ScheduleModule } from '@nestjs/schedule';
import { BadgeModule } from './badge/badge.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MailModule } from './mail/mail.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { UserThrottlerGuard } from './common/guards/user-throttle.guard';
import { PaymentModule } from './payment/payment.module';
import { SubscriptionModule } from './subscription/subscription.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    AuthModule,
    WritingSessionModule,
    ScenariosModule,
    AiModule,
    SkillProficiencyModule,
    RecentScoresModule,
    StreakModule,
    ScheduleModule.forRoot(),
    BadgeModule,
    EventEmitterModule.forRoot(),
    MailModule,
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60000,
        limit: 100,
      },
      {
        name: 'auth-sensitive',
        ttl: 900000,
        limit: 3,
      },
    ]),
    PaymentModule,
    SubscriptionModule,
  ],
  controllers: [AppController, AiController],
  providers: [AppService, { provide: APP_GUARD, useClass: UserThrottlerGuard }],
})
export class AppModule {}
