import { IsString, MinLength, minLength } from "class-validator";

export class CreateAuthorDto {

    @IsString()
    @MinLength(5)
    name!: string

}
