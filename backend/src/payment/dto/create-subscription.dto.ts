import { IsOptional, IsString } from 'class-validator';

export class CreateSubscriptionDto {
  @IsOptional()
  @IsString()
  plan?: string;

  @IsOptional()
  @IsString()
  interval?: string;
}
