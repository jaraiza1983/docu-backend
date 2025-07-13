import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, MinLength, MaxLength } from 'class-validator';

export class CreateProjectCategoryDto {
  @ApiProperty({ description: 'Project category name', example: 'Web Development' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({ description: 'Project category description', example: 'Web development projects', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ description: 'Parent project category ID (for subcategories)', required: false })
  @IsNumber()
  @IsOptional()
  parentId?: number;
} 