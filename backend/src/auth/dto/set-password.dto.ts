import { IsNotEmpty, MinLength } from "class-validator";

export class SetPasswordDto {
    @IsNotEmpty()
    @MinLength(6, { message: "Password must be at least 6 characters long."})
    password: string
}