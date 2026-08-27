import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Get,
  Param,
} from '@nestjs/common';
import { WritingSessionService } from './writing-session.service';
import { CreateWritingSessionDto } from './dto/create-writing-session.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

@Controller('writing-session')
export class WritingSessionController {
  constructor(private readonly writingSessionService: WritingSessionService) {}

  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { ttl: 60000, limit: 100} })
  @Post('create')
  async create(
    @Body() dto: CreateWritingSessionDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.writingSessionService.createWritingSession(dto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @SkipThrottle({ default: true, 'auth-sensitive': true })
  @Get('me')
  async getWritingSessionByUser(@CurrentUser('userId') userId: string) {
    return this.writingSessionService.findManyByUserId(userId);
  }

  @UseGuards(JwtAuthGuard)
  @SkipThrottle({ default: true, 'auth-sensitive': true })
  @Get(':id')
  async getSessionWithHistory(@Param('id') id: string) {
    return this.writingSessionService.getSessionWithHistory(id);
  }

  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { ttl: 60000, limit: 5} })
  @Get(':id/feedback')
  async getSessionFeedback(@Param('id') sessionId: string) {
    return this.writingSessionService.getFeedback(sessionId);
  }
}
