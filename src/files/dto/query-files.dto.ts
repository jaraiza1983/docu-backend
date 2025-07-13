import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';
import { FileExtension } from '../entities/file.entity';

export class QueryFilesDto {
  @ApiProperty({ 
    description: 'Filter files by name (partial match)',
    required: false
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ 
    description: 'Filter files by extension',
    enum: FileExtension,
    required: false
  })
  @IsOptional()
  @IsEnum(FileExtension)
  extension?: FileExtension;

  @ApiProperty({ 
    description: 'Filter files uploaded from this date (ISO string)',
    required: false,
    example: '2024-01-01T00:00:00.000Z'
  })
  @IsOptional()
  @IsDateString()
  uploadedFrom?: string;

  @ApiProperty({ 
    description: 'Filter files uploaded until this date (ISO string)',
    required: false,
    example: '2024-12-31T23:59:59.999Z'
  })
  @IsOptional()
  @IsDateString()
  uploadedTo?: string;

  @ApiProperty({ 
    description: 'Page number for pagination',
    required: false,
    default: 1
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @ApiProperty({ 
    description: 'Number of items per page',
    required: false,
    default: 10
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit?: number = 10;
} 