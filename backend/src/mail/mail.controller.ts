import { Controller } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail-service')
export class MailController {
  constructor(private readonly mailService: MailService) {}
}
