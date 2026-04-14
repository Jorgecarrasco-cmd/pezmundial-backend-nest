import { IsString, Min } from "class-validator";

export class CreateSeriesDto {
    @IsString()
    title!: string
}
