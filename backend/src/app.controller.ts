import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { SkipThrottle } from '@nestjs/throttler';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @SkipThrottle({ default: true, 'auth-sensitive': true })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
