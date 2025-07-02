import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContentHistory, ContentAction } from '../entities/content-history.entity';
import { Content } from '../entities/content.entity';
import { User } from '../../users/entities/user.entity';

export interface ContentChange {
  field: string;
  oldValue: any;
  newValue: any;
}

@Injectable()
export class ContentHistoryService {
  constructor(
    @InjectRepository(ContentHistory)
    private contentHistoryRepository: Repository<ContentHistory>,
  ) {}

  async logContentCreated(content: Content, user: User, notes?: string): Promise<void> {
    const historyEntry = this.contentHistoryRepository.create({
      action: ContentAction.CREATED,
      contentId: content.id,
      userId: user.id,
      newData: JSON.stringify(this.serializeContent(content)),
      notes,
    });

    await this.contentHistoryRepository.save(historyEntry);
  }

  async logContentUpdated(
    content: Content,
    user: User,
    previousContent: Content,
    changes: ContentChange[],
    notes?: string,
  ): Promise<void> {
    const historyEntry = this.contentHistoryRepository.create({
      action: ContentAction.UPDATED,
      contentId: content.id,
      userId: user.id,
      previousData: JSON.stringify(this.serializeContent(previousContent)),
      newData: JSON.stringify(this.serializeContent(content)),
      changes: JSON.stringify(changes),
      notes,
    });

    await this.contentHistoryRepository.save(historyEntry);
  }

  async logStatusChanged(
    content: Content,
    user: User,
    oldStatus: string,
    newStatus: string,
    notes?: string,
  ): Promise<void> {
    const historyEntry = this.contentHistoryRepository.create({
      action: ContentAction.STATUS_CHANGED,
      contentId: content.id,
      userId: user.id,
      previousData: JSON.stringify({ status: oldStatus }),
      newData: JSON.stringify({ status: newStatus }),
      changes: JSON.stringify([
        {
          field: 'status',
          oldValue: oldStatus,
          newValue: newStatus,
        },
      ]),
      notes,
    });

    await this.contentHistoryRepository.save(historyEntry);
  }

  async logContentDeleted(content: Content, user: User, notes?: string): Promise<void> {
    const historyEntry = this.contentHistoryRepository.create({
      action: ContentAction.DELETED,
      contentId: content.id,
      userId: user.id,
      previousData: JSON.stringify(this.serializeContent(content)),
      notes,
    });

    await this.contentHistoryRepository.save(historyEntry);
  }

  async getContentHistory(contentId: number): Promise<ContentHistory[]> {
    return this.contentHistoryRepository.find({
      where: { contentId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async getContentHistoryByUser(userId: number): Promise<ContentHistory[]> {
    return this.contentHistoryRepository.find({
      where: { userId },
      relations: ['content'],
      order: { createdAt: 'DESC' },
    });
  }

  private serializeContent(content: Content): any {
    return {
      id: content.id,
      title: content.title,
      description: content.description,
      tags: content.tags,
      status: content.status,
      categoryId: content.categoryId,
      subcategoryId: content.subcategoryId,
      authorId: content.authorId,
      lastUpdatedById: content.lastUpdatedById,
      createdAt: content.createdAt,
      updatedAt: content.updatedAt,
    };
  }

  getChanges(oldContent: Content, newContent: Content): ContentChange[] {
    const changes: ContentChange[] = [];
    const fields = ['title', 'description', 'tags', 'status', 'categoryId', 'subcategoryId'];

    for (const field of fields) {
      const oldValue = oldContent[field];
      const newValue = newContent[field];

      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        changes.push({
          field,
          oldValue,
          newValue,
        });
      }
    }

    return changes;
  }
} 