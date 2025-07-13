import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

export enum FileExtension {
  XLSX = 'xlsx',
  PDF = 'pdf',
  MP4 = 'mp4',
  DOCX = 'docx',
  PPTX = 'pptx',
}

@Entity('files')
export class File {
  @ApiProperty({ description: 'Unique identifier for the file' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Original filename' })
  @Column()
  originalName: string;

  @ApiProperty({ description: 'Generated filename for storage' })
  @Column({ unique: true })
  filename: string;

  @ApiProperty({ description: 'File extension' })
  @Column({
    type: 'text',
    enum: FileExtension,
  })
  extension: FileExtension;

  @ApiProperty({ description: 'File size in bytes' })
  @Column('bigint')
  size: number;

  @ApiProperty({ description: 'MIME type of the file' })
  @Column()
  mimeType: string;

  @ApiProperty({ description: 'File path in storage' })
  @Column()
  path: string;

  @ApiProperty({ description: 'File description (optional)' })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({ description: 'Upload user ID' })
  @Column()
  uploadedById: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'uploadedById' })
  uploadedBy: User;

  @ApiProperty({ description: 'Upload timestamp' })
  @CreateDateColumn()
  uploadedAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ description: 'Whether the file is active' })
  @Column({ default: true })
  isActive: boolean;

  constructor(partial: Partial<File>) {
    Object.assign(this, partial);
  }
} 