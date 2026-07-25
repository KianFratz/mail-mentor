import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class SendMessageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  message: string;

  @IsNumber()
  wordCount: number;
}
