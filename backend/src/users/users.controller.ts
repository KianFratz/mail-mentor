import {
  BadRequestException,
  Body,
  Controller,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { UsersService } from './users.service';
import { UpdateUsernameDto } from './dto/changeUserName.dto';
import { UpdatePasswordDto } from './dto/changePassword.dto';
import { UpdateEmailDto } from './dto/changeEmail.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Patch('me/name')
  async updateUserName(
    @CurrentUser('userId') userId: string,
    @Body() dto: UpdateUsernameDto,
  ) {
    return this.usersService.updateUserName(userId, dto.newUserName);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/password')
  async updatePassword(
    @CurrentUser('userId') userId: string,
    @Body() dto: UpdatePasswordDto,
  ) {
    return this.usersService.updatePassword(
      userId,
      dto.currentPassword,
      dto.newPassword,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/email')
  @Throttle({ 'auth-sensitive': { ttl: 900000, limit: 3 } })
  async requestEmailChange(
    @CurrentUser('userId') userId: string,
    @Body() dto: UpdateEmailDto,
  ) {
    return this.usersService.requestEmailChange(
      userId,
      dto.newEmail,
      dto.currentPassword,
    );
  }

  @Post('me/email/verify')
  @Throttle({ 'auth-sensitive': { ttl: 900000, limit: 10 } })
  async confirmEmailChange(@Query('token') token: string) {
    if (!token) throw new BadRequestException('Token is required');
    return this.usersService.confirmEmailChange(token);
  }
}
