import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { UsersService } from './users.service';
import { UpdateUsernameDto } from './dto/changeUserName.dto';
import { UpdatePasswordDto } from './dto/changePassword.dto';
import { UpdateEmailDto } from './dto/changeEmail.dto';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { DeleteAccountDto } from './dto/deleteAccount.dto';
import type { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Patch('me/name')
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  async updateUserName(
    @CurrentUser('userId') userId: string,
    @Body() dto: UpdateUsernameDto,
  ) {
    return this.usersService.updateUserName(userId, dto.newUserName);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/password')
  @Throttle({ 'auth-sensitive': { ttl: 900000, limit: 3 } })
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
  @Throttle({ 'auth-sensitive': { ttl: 900000, limit: 5 } })
  async confirmEmailChange(@Query('token') token: string) {
    if (!token) throw new BadRequestException('Token is required');
    return this.usersService.confirmEmailChange(token);
  }

  @UseGuards(JwtAuthGuard)
  @SkipThrottle({ default: true, 'auth-sensitive': true })
  @Get('me')
  async getUserProfile(@CurrentUser('userId') userId: string) {
    return this.usersService.getUserProfile(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Throttle({ 'auth-sensitive': { ttl: 900000, limit: 5 } })
  @Delete('me')
  async deleteAccount(
    @CurrentUser('userId') userId: string,
    @Body() dto: DeleteAccountDto,
  ) {
    return this.usersService.deleteAccount(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { ttl: 60000, limit: 1 } })
  @Get('me/export')
  async exportUserData(
    @CurrentUser('userId') userId: string,
    @Query('format') format: 'json' | 'pdf' | 'csv' = 'json',
    @Res() res: Response,
  ) {
    const { data, filename, contentType } =
      await this.usersService.exportUserData(userId, format);

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.send(data);
  }
}
