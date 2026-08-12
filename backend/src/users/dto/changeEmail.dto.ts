import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateEmailDto {
  @IsEmail()
  newEmail: string;

  @IsString()
  @IsNotEmpty()
  currentPassword: string;
}
