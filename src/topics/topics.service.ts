import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Topic } from './entities/topic.entity';
import { User, UserRole } from '../users/entities/user.entity';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';

@Injectable()
export class TopicsService {
  constructor(
    @InjectRepository(Topic)
    private topicsRepository: Repository<Topic>,
  ) {}

  async create(createTopicDto: CreateTopicDto, user: User): Promise<Topic> {
    const topic = this.topicsRepository.create({
      ...createTopicDto,
      createdById: user.id,
    });

    return this.topicsRepository.save(topic);
  }

  async findAll(): Promise<Topic[]> {
    return this.topicsRepository.find({
      relations: ['createdBy', 'updatedBy', 'category', 'subcategory'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Topic> {
    const topic = await this.topicsRepository.findOne({
      where: { id },
      relations: ['createdBy', 'updatedBy', 'category', 'subcategory'],
    });

    if (!topic) {
      throw new NotFoundException(`Topic with ID ${id} not found`);
    }

    return topic;
  }

  async update(id: number, updateTopicDto: UpdateTopicDto, user: User): Promise<Topic> {
    const topic = await this.findOne(id);

    // Check permissions: only admin, editor, or the creator can update
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.EDITOR) {
      throw new ForbiddenException('Insufficient permissions to update topics');
    }

    await this.topicsRepository.update(id, {
      ...updateTopicDto,
      updatedById: user.id,
    });

    return this.findOne(id);
  }

  async remove(id: number, user: User): Promise<void> {
    const topic = await this.findOne(id);

    // Check permissions: only admin or the creator can delete
    if (user.role !== UserRole.ADMIN && topic.createdById !== user.id) {
      throw new ForbiddenException('Insufficient permissions to delete this topic');
    }

    await this.topicsRepository.remove(topic);
  }

  async findByCategory(categoryId: number): Promise<Topic[]> {
    return this.topicsRepository.find({
      where: { categoryId },
      relations: ['createdBy', 'updatedBy', 'category', 'subcategory'],
      order: { createdAt: 'DESC' },
    });
  }

  async findBySubcategory(subcategoryId: number): Promise<Topic[]> {
    return this.topicsRepository.find({
      where: { subcategoryId },
      relations: ['createdBy', 'updatedBy', 'category', 'subcategory'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: number): Promise<Topic[]> {
    return this.topicsRepository.find({
      where: { createdById: userId },
      relations: ['createdBy', 'updatedBy', 'category', 'subcategory'],
      order: { createdAt: 'DESC' },
    });
  }
} 