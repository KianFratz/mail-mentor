import { Controller, Post, Body, Req, UseGuards, Get, Param } from '@nestjs/common';
import { WritingSessionService } from './writing-session.service';
import { CreateWritingSessionDto } from './dto/create-writing-session.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';

@Controller('writing-session')
export class WritingSessionController {
  constructor(private readonly writingSessionService: WritingSessionService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() dto: CreateWritingSessionDto, @CurrentUser("userId") userId: string) {
    return this.writingSessionService.createWritingSession(dto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getWritingSessionByUser(@CurrentUser("userId") userId: string) {
    return this.writingSessionService.findManyByUserId(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getSessionWithHistory(@Param('id') id: string) {
    return this.writingSessionService.getSessionWithHistory(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/feedback')
  async getSessionFeedback(@Param('id') sessionId: string) {
    return this.writingSessionService.getFeedback(sessionId);
  }
}