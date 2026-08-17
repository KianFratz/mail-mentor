import { Equals, IsString } from 'class-validator';

export class DeleteAccountDto {
  @IsString()
  @Equals('DELETE', {
    message: 'You must type DELETE to confirm account deletion',
  })
  confirmation: string;
}
