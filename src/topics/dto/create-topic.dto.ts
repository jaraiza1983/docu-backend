import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, MinLength, MaxLength } from 'class-validator';

export class CreateTopicDto {
  @ApiProperty({ description: 'Topic title', example: 'Introduction to NestJS' })
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  title: string;

  @ApiProperty({ description: 'Topic body/content', example: 'NestJS is a progressive Node.js framework...' })
  @IsString()
  @MinLength(10)
  body: string;

  @ApiProperty({ description: 'Category ID', example: 1 })
  @IsNumber()
  categoryId: number;

  @ApiProperty({ description: 'Subcategory ID (optional)', example: 2, required: false })
  @IsNumber()
  @IsOptional()
  subcategoryId?: number;
} 