import { IsString, IsNotEmpty, IsArray, IsOptional, IsEnum, IsNumber, Min, Max } from 'class-validator';
import { ContentStatus } from '../entities/content.entity';

export class CreateContentDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @IsOptional()
  @IsNumber()
  subcategoryId?: number;

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  priority?: number;
} 