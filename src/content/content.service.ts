import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Content } from './entities/content.entity';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { User, UserRole } from '../users/entities/user.entity';
import { Category } from '../categories/entities/category.entity';
import { Subcategory } from '../subcategories/entities/subcategory.entity';
import { ContentHistoryService } from './services/content-history.service';

export interface ContentQueryOptions {
  orderBy?: 'priority' | 'createdAt' | 'updatedAt' | 'title';
  orderDirection?: 'ASC' | 'DESC';
}

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content)
    private contentRepository: Repository<Content>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Subcategory)
    private subcategoryRepository: Repository<Subcategory>,
    private contentHistoryService: ContentHistoryService,
  ) {}

  async create(createContentDto: CreateContentDto, user: User): Promise<Content> {
    // Validate that the category exists if provided
    if (createContentDto.categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: createContentDto.categoryId }
      });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }

    // Validate that the subcategory exists if provided
    if (createContentDto.subcategoryId) {
      const subcategory = await this.subcategoryRepository.findOne({
        where: { id: createContentDto.subcategoryId }
      });
      if (!subcategory) {
        throw new NotFoundException('Subcategory not found');
      }
    }

    const content = this.contentRepository.create({
      ...createContentDto,
      authorId: user.id,
      lastUpdatedById: user.id, // The author is also the initial updater
      priority: createContentDto.priority || 0, // Default value
    });

    const savedContent = await this.contentRepository.save(content);
    
    // Log to history
    await this.contentHistoryService.logContentCreated(savedContent, user);

    return savedContent;
  }

  async findAll(user: User, options: ContentQueryOptions = {}): Promise<Content[]> {
    const { orderBy = 'priority', orderDirection = 'DESC' } = options;

    const queryBuilder = this.contentRepository.createQueryBuilder('content')
      .leftJoinAndSelect('content.author', 'author')
      .leftJoinAndSelect('content.lastUpdatedBy', 'lastUpdatedBy')
      .leftJoinAndSelect('content.category', 'category')
      .leftJoinAndSelect('content.subcategory', 'subcategory')
      .select([
        'content',
        'author.id',
        'author.name',
        'author.email',
        'author.role',
        'lastUpdatedBy.id',
        'lastUpdatedBy.name',
        'lastUpdatedBy.email',
        'category.id',
        'category.name',
        'subcategory.id',
        'subcategory.name'
      ]);

    // Both admins and creators can see all content
    // No filtering by authorId for creators anymore

    // Apply ordering
    queryBuilder.orderBy(`content.${orderBy}`, orderDirection);

    return queryBuilder.getMany();
  }

  async findOne(id: number, user: User): Promise<Content> {
    const content = await this.contentRepository.findOne({
      where: { id },
      relations: ['author', 'lastUpdatedBy', 'category', 'subcategory'],
      select: {
        author: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
        lastUpdatedBy: {
          id: true,
          name: true,
          email: true,
        },
        category: {
          id: true,
          name: true,
        },
        subcategory: {
          id: true,
          name: true,
        },
      },
    });

    if (!content) {
      throw new NotFoundException(`Content with ID ${id} not found`);
    }

    // Both admins and creators can access any content
    // No authorId restriction for creators anymore

    return content;
  }

  async update(id: number, updateContentDto: UpdateContentDto, user: User): Promise<Content> {
    const previousContent = await this.findOne(id, user);
    
    // Both admins and creators can update any content
    // No authorId restriction for creators anymore

    // Validate that the category exists if being updated
    if (updateContentDto.categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: updateContentDto.categoryId }
      });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }

    // Validate that the subcategory exists if being updated
    if (updateContentDto.subcategoryId) {
      const subcategory = await this.subcategoryRepository.findOne({
        where: { id: updateContentDto.subcategoryId }
      });
      if (!subcategory) {
        throw new NotFoundException('Subcategory not found');
      }
    }

    // Create a copy of the previous content for history
    const contentBeforeUpdate = { ...previousContent };

    // Update the content
    Object.assign(previousContent, updateContentDto);
    previousContent.lastUpdatedById = user.id; // Log who updated

    const updatedContent = await this.contentRepository.save(previousContent);

    // Detect changes for history
    const changes = this.contentHistoryService.getChanges(contentBeforeUpdate, updatedContent);
    
    // Log to history if there are changes
    if (changes.length > 0) {
      await this.contentHistoryService.logContentUpdated(
        updatedContent,
        user,
        contentBeforeUpdate,
        changes,
      );
    }

    // If only status changed, log as status change
    if (changes.length === 1 && changes[0].field === 'status') {
      await this.contentHistoryService.logStatusChanged(
        updatedContent,
        user,
        contentBeforeUpdate.status,
        updatedContent.status,
      );
    }

    return updatedContent;
  }

  async remove(id: number, user: User): Promise<void> {
    const content = await this.findOne(id, user);
    
    // Both admins and creators can delete any content
    // No authorId restriction for creators anymore

    // Log to history before deletion
    await this.contentHistoryService.logContentDeleted(content, user);

    await this.contentRepository.remove(content);
  }

  async getContentHistory(contentId: number, user: User): Promise<any[]> {
    const content = await this.findOne(contentId, user);
    
    if (user.role !== UserRole.ADMIN && content.authorId !== user.id) {
      throw new ForbiddenException('You can only view history of your own content');
    }

    const history = await this.contentHistoryService.getContentHistory(contentId);
    
    return history.map(entry => ({
      id: entry.id,
      action: entry.action,
      changes: entry.changes ? JSON.parse(entry.changes) : null,
      notes: entry.notes,
      createdAt: entry.createdAt,
      user: {
        id: entry.user.id,
        name: entry.user.name,
        email: entry.user.email,
      },
      previousData: entry.previousData ? JSON.parse(entry.previousData) : null,
      newData: entry.newData ? JSON.parse(entry.newData) : null,
    }));
  }

  async getUserContentHistory(userId: number, requestingUser: User): Promise<any[]> {
    // Solo admins pueden ver historial de otros usuarios
    if (requestingUser.role !== UserRole.ADMIN && requestingUser.id !== userId) {
      throw new ForbiddenException('You can only view your own content history');
    }

    const history = await this.contentHistoryService.getContentHistoryByUser(userId);
    
    return history.map(entry => ({
      id: entry.id,
      action: entry.action,
      changes: entry.changes ? JSON.parse(entry.changes) : null,
      notes: entry.notes,
      createdAt: entry.createdAt,
      content: {
        id: entry.content.id,
        title: entry.content.title,
      },
      previousData: entry.previousData ? JSON.parse(entry.previousData) : null,
      newData: entry.newData ? JSON.parse(entry.newData) : null,
    }));
  }
} 