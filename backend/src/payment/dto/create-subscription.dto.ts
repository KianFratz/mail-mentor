import { IsIn, IsOptional, IsString } from 'class-validator';

export class CreateSubscriptionDto {
  @IsOptional()
  @IsIn(['free', 'pro'])
  plan?: string;

  @IsOptional()
  @IsIn(['month', 'year', 'annual'])
  interval?: string;
}
