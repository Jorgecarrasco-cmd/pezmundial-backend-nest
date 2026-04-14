import { IsOptional, IsString, IsBoolean, IsArray, IsDateString, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class FilterResourceDto {

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  limit?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  offset?: number;

  @IsOptional()
  @IsString()
  authorId?: string;

  @IsOptional()
  @IsString()
  serieId?: string;

  @IsOptional()
  @IsString()
  bibleBookId?: string;

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => Array.isArray(value) ? value : [value])
  tagIds?: string[];

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isPrivate?: boolean;

  @IsOptional()
  @IsDateString()
  dateFrom?: Date;

  @IsOptional()
  @IsDateString()
  dateTo?: Date;
}