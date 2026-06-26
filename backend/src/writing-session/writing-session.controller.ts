import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { WritingSessionService } from './writing-session.service';
import { CreateWritingSessionDto } from './dto/create-writing-session.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('writing-session')
export class WritingSessionController {
  constructor(
    private readonly writingSessionService: WritingSessionService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() dto: CreateWritingSessionDto, @Req() req: any) {
    const userId = req.user.userId;
    return this.writingSessionService.createWritingSession(dto, userId);
  }
}
