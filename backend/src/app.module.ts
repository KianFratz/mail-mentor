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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    AuthModule,
    WritingSessionModule,
    ScenariosModule,
    AiModule,
  ],
  controllers: [AppController, AiController],
  providers: [AppService],
})
export class AppModule {}
