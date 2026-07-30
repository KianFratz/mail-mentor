import { IsDateString } from 'class-validator';

export class LogPracticeDto {
  @IsDateString()
  localDate: string;
}
