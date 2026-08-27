import { Controller, Get, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ScenariosService } from './scenarios.service';
import { SkipThrottle } from '@nestjs/throttler';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';

@Controller('scenarios')
export class ScenariosController {
  constructor(private readonly scenariosService: ScenariosService) {}

  @Get('')
  @SkipThrottle({ default: true, 'auth-sensitive': true })
  findAll() {
    return this.scenariosService.findAll();
  }

  @Get('progress')
  @UseGuards(JwtAuthGuard)
  @SkipThrottle({ default: true, 'auth-sensitive': true })
  getProgress(@CurrentUser('userId') userId: string) {
    return this.scenariosService.getUnlockedLevels(userId);
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.scenariosService.findById(id);
  }
}
