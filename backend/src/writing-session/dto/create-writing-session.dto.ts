import { IsInt, IsNotEmpty, IsString, IsUUID, Min } from "class-validator";

export class CreateWritingSessionDto {
    @IsString()
    @IsNotEmpty()
    subjectLine: string;

    @IsNotEmpty()
    @IsString()
    textBody: string

    @IsInt()
    @Min(0)
    wordCount: number

    @IsUUID()
    scenarioId: string
}
