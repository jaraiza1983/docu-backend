import { ApiProperty } from '@nestjs/swagger';
import { FileExtension } from '../entities/file.entity';

export class FileResponseDto {
  @ApiProperty({ description: 'Unique identifier for the file' })
  id: number;

  @ApiProperty({ description: 'Original filename' })
  originalName: string;

  @ApiProperty({ description: 'Generated filename for storage' })
  filename: string;

  @ApiProperty({ description: 'File extension', enum: FileExtension })
  extension: FileExtension;

  @ApiProperty({ description: 'File size in bytes' })
  size: number;

  @ApiProperty({ description: 'MIME type of the file' })
  mimeType: string;

  @ApiProperty({ description: 'File description (optional)' })
  description?: string;

  @ApiProperty({ description: 'Upload user ID' })
  uploadedById: number;

  @ApiProperty({ description: 'Upload user username' })
  uploadedByUsername: string;

  @ApiProperty({ description: 'Upload timestamp' })
  uploadedAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;

  @ApiProperty({ description: 'Whether the file is active' })
  isActive: boolean;
} 