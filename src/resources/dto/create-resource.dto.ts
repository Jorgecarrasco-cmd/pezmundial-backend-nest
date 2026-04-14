import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsArray, IsBoolean, IsDateString, IsOptional, IsString, IsUUID, MaxLength, MinLength } from "class-validator";

export class CreateResourceDto {

    @IsString()
    @MinLength(5)
    title!: string;

    @IsString()
    @IsOptional()
    @MinLength(10)
    description!: string;

    @IsString()
    @IsOptional()
    @MaxLength(250)
    resume!: string;

    @IsDateString()
    date!: Date;

    @IsString()
    @IsUUID()
    authorId!: string;

    @IsString()
    @IsUUID()
    bibleBookId!: string;

    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true)
    private!: boolean

    @IsString()
    @IsUUID()
    serieId!: string;
    //OPCIONALES

    @IsString()
    @IsOptional()
    @MinLength(10)
    youtubeUrl?: string;

    @IsString()
    @IsOptional()
    @MinLength(10)
    spotifyUrl?: string;

    @IsString()
    @IsArray()
    @IsOptional()
    @IsUUID()
    tagIds?: string[];
}
