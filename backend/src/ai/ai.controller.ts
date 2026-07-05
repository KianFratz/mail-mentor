import { Controller, Post, Body, UseGuards, Param } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SendMessageDto } from './dto/send-message.dto';

@UseGuards(JwtAuthGuard)
@Controller('writing-sessions/:sessionId/reply')
export class AiController {
  constructor(private aiService: AiService) {}

  @Post()
  async reply(
    @Param('sessionId') sessionId: string,
    @Body() dto: SendMessageDto,
  ) {
    const reply = await this.aiService.reply(sessionId, dto.message);

    return { reply };
  }
}
