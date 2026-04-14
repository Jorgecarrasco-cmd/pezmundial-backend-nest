import { IsString } from "class-validator";

export class UpdateTagDto {
    @IsString()
    title!: string
}