import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, MinLength, MaxLength } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ description: 'Project title', example: 'E-commerce Platform' })
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  title: string;

  @ApiProperty({ description: 'Project body/content', example: 'A comprehensive e-commerce platform built with modern technologies...' })
  @IsString()
  @MinLength(10)
  body: string;

  @ApiProperty({ description: 'Project category ID', example: 1 })
  @IsNumber()
  categoryId: number;
} 