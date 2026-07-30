import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SendMessageDto } from './dto/send-message.dto';
import { CurrentUser } from 'src/common/decorators/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('writing-sessions/:sessionId')
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('/reply')
  async reply(
    @Param('sessionId') sessionId: string,
    @Body() dto: SendMessageDto,
  ) {
    const reply = await this.aiService.reply(
      sessionId,
      dto.message,
      dto.wordCount,
    );

    return { reply };
  }

  @Post('feedback')
  async generateFeedback(
    @Param('sessionId') sessionId: string,
    @CurrentUser('userId') userId: string,
    @Query('localDate') localDate: string,
  ) {
    if (!localDate) {
      throw new BadRequestException('Query parameter localDate is required');
    }

    return this.aiService.generateFeedback(sessionId, userId, localDate);
  }
}
