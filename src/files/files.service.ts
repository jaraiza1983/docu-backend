import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import { createReadStream, createWriteStream, existsSync, mkdirSync, unlinkSync } from 'fs';
import { join } from 'path';
import { File, FileExtension } from './entities/file.entity';
import { User, UserRole } from '../users/entities/user.entity';
import { UploadFileDto } from './dto/upload-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { QueryFilesDto } from './dto/query-files.dto';
import { FileResponseDto } from './dto/file-response.dto';

@Injectable()
export class FilesService {
  private readonly uploadDir = 'uploads';
  private readonly allowedExtensions = Object.values(FileExtension);
  private readonly maxFileSize = 100 * 1024 * 1024; // 100MB

  constructor(
    @InjectRepository(File)
    private filesRepository: Repository<File>,
  ) {
    // Ensure upload directory exists
    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    uploadFileDto: UploadFileDto,
    user: User,
  ): Promise<FileResponseDto> {
    // Check if user is admin
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admin users can upload files');
    }

    // Validate file extension
    const extension = this.getFileExtension(file.originalname);
    if (!this.allowedExtensions.includes(extension as FileExtension)) {
      throw new BadRequestException(
        `Invalid file extension. Allowed extensions: ${this.allowedExtensions.join(', ')}`,
      );
    }

    // Validate file size
    if (file.size > this.maxFileSize) {
      throw new BadRequestException(
        `File size exceeds maximum limit of ${this.maxFileSize / (1024 * 1024)}MB`,
      );
    }

    // Generate unique filename
    const filename = this.generateUniqueFilename(file.originalname);
    const filePath = join(this.uploadDir, filename);

    // Save file to disk
    const writeStream = createWriteStream(filePath);
    writeStream.write(file.buffer);
    writeStream.end();

    // Create file record in database
    const fileEntity = this.filesRepository.create({
      originalName: file.originalname,
      filename,
      extension: extension as FileExtension,
      size: file.size,
      mimeType: file.mimetype,
      path: filePath,
      description: uploadFileDto.description,
      uploadedById: user.id,
    });

    const savedFile = await this.filesRepository.save(fileEntity);
    return this.transformToResponseDto(savedFile);
  }

  async findAll(queryDto: QueryFilesDto): Promise<{ files: FileResponseDto[]; total: number; page: number; limit: number }> {
    const { name, extension, uploadedFrom, uploadedTo, page = 1, limit = 10 } = queryDto;
    
    const queryBuilder = this.filesRepository
      .createQueryBuilder('file')
      .leftJoinAndSelect('file.uploadedBy', 'uploadedBy')
      .where('file.isActive = :isActive', { isActive: true });

    // Apply filters
    if (name) {
      queryBuilder.andWhere('file.originalName LIKE :name', { name: `%${name}%` });
    }

    if (extension) {
      queryBuilder.andWhere('file.extension = :extension', { extension });
    }

    if (uploadedFrom || uploadedTo) {
      const whereCondition: any = {};
      if (uploadedFrom) {
        whereCondition.uploadedAt = Between(new Date(uploadedFrom), uploadedTo ? new Date(uploadedTo) : new Date());
      } else if (uploadedTo) {
        whereCondition.uploadedAt = Between(new Date(0), new Date(uploadedTo));
      }
      queryBuilder.andWhere('file.uploadedAt BETWEEN :from AND :to', {
        from: uploadedFrom ? new Date(uploadedFrom) : new Date(0),
        to: uploadedTo ? new Date(uploadedTo) : new Date(),
      });
    }

    // Apply pagination
    const skip = (page - 1) * limit;
    queryBuilder
      .orderBy('file.uploadedAt', 'DESC')
      .skip(skip)
      .take(limit);

    const [files, total] = await queryBuilder.getManyAndCount();

    return {
      files: files.map(file => this.transformToResponseDto(file)),
      total,
      page,
      limit,
    };
  }

  async findOne(id: number): Promise<File> {
    const file = await this.filesRepository.findOne({
      where: { id, isActive: true },
      relations: ['uploadedBy'],
    });

    if (!file) {
      throw new NotFoundException(`File with ID ${id} not found`);
    }

    return file;
  }

  async findOneForResponse(id: number): Promise<FileResponseDto> {
    const file = await this.findOne(id);
    return this.transformToResponseDto(file);
  }

  async downloadFile(id: number): Promise<{ stream: any; file: File }> {
    const file = await this.findOne(id);

    if (!existsSync(file.path)) {
      throw new NotFoundException('File not found on disk');
    }

    const stream = createReadStream(file.path);
    return { stream, file };
  }

  async update(id: number, updateFileDto: UpdateFileDto, user: User): Promise<FileResponseDto> {
    // Check if user is admin
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admin users can update files');
    }

    const file = await this.findOne(id);
    
    Object.assign(file, updateFileDto);
    const updatedFile = await this.filesRepository.save(file);
    return this.transformToResponseDto(updatedFile);
  }

  async remove(id: number, user: User): Promise<void> {
    // Check if user is admin
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admin users can delete files');
    }

    const file = await this.findOne(id);

    // Delete file from disk
    if (existsSync(file.path)) {
      unlinkSync(file.path);
    }

    // Soft delete from database
    file.isActive = false;
    await this.filesRepository.save(file);
  }

  private getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || '';
  }

  private generateUniqueFilename(originalName: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = this.getFileExtension(originalName);
    return `${timestamp}-${randomString}.${extension}`;
  }

  getFileStats(): { allowedExtensions: string[]; maxFileSize: number } {
    return {
      allowedExtensions: this.allowedExtensions,
      maxFileSize: this.maxFileSize,
    };
  }

  private transformToResponseDto(file: File): FileResponseDto {
    return {
      id: file.id,
      originalName: file.originalName,
      filename: file.filename,
      extension: file.extension,
      size: file.size,
      mimeType: file.mimeType,
      description: file.description,
      uploadedById: file.uploadedById,
      uploadedByUsername: file.uploadedBy?.username || '',
      uploadedAt: file.uploadedAt,
      updatedAt: file.updatedAt,
      isActive: file.isActive,
    };
  }
} 