import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { User, UserRole } from '../users/entities/user.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto, user: User): Promise<Project> {
    const project = this.projectsRepository.create({
      ...createProjectDto,
      createdById: user.id,
    });

    return this.projectsRepository.save(project);
  }

  async findAll(): Promise<Project[]> {
    return this.projectsRepository.find({
      relations: ['createdBy', 'updatedBy', 'category'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: ['createdBy', 'updatedBy', 'category'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto, user: User): Promise<Project> {
    const project = await this.findOne(id);

    // Check permissions: only admin or the creator can update
    if (user.role !== UserRole.ADMIN && project.createdById !== user.id) {
      throw new ForbiddenException('Insufficient permissions to update this project');
    }

    await this.projectsRepository.update(id, {
      ...updateProjectDto,
      updatedById: user.id,
    });

    return this.findOne(id);
  }

  async remove(id: number, user: User): Promise<void> {
    const project = await this.findOne(id);

    // Check permissions: only admin or the creator can delete
    if (user.role !== UserRole.ADMIN && project.createdById !== user.id) {
      throw new ForbiddenException('Insufficient permissions to delete this project');
    }

    await this.projectsRepository.remove(project);
  }

  async findByCategory(categoryId: number): Promise<Project[]> {
    return this.projectsRepository.find({
      where: { categoryId },
      relations: ['createdBy', 'updatedBy', 'category'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: number): Promise<Project[]> {
    return this.projectsRepository.find({
      where: { createdById: userId },
      relations: ['createdBy', 'updatedBy', 'category'],
      order: { createdAt: 'DESC' },
    });
  }
} 