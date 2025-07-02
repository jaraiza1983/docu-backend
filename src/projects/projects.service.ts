import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { ProjectStatus } from './entities/project-status.entity';
import { ProjectArea } from './entities/project-area.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { User, UserRole } from '../users/entities/user.entity';
import { ProjectHistoryService } from './services/project-history.service';

export interface ProjectQueryOptions {
  orderBy?: 'priority' | 'createdAt' | 'updatedAt' | 'title';
  orderDirection?: 'ASC' | 'DESC';
  statusId?: number;
  areaId?: number;
}

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(ProjectStatus)
    private projectStatusRepository: Repository<ProjectStatus>,
    @InjectRepository(ProjectArea)
    private projectAreaRepository: Repository<ProjectArea>,
    private projectHistoryService: ProjectHistoryService,
  ) {}

  async create(createProjectDto: CreateProjectDto, user: User): Promise<Project> {
    // Validate that the status exists
    const status = await this.projectStatusRepository.findOne({
      where: { id: createProjectDto.statusId }
    });
    if (!status) {
      throw new NotFoundException('Project status not found');
    }

    // Validate that the area exists
    const area = await this.projectAreaRepository.findOne({
      where: { id: createProjectDto.areaId }
    });
    if (!area) {
      throw new NotFoundException('Project area not found');
    }

    const project = this.projectRepository.create({
      ...createProjectDto,
      authorId: user.id,
      lastUpdatedById: user.id,
      priority: createProjectDto.priority || 0,
    });

    const savedProject = await this.projectRepository.save(project);
    
    // Log to history
    await this.projectHistoryService.logProjectCreated(savedProject, user);

    return savedProject;
  }

  async findAll(user: User, options: ProjectQueryOptions = {}): Promise<Project[]> {
    const { orderBy = 'priority', orderDirection = 'DESC', statusId, areaId } = options;

    const queryBuilder = this.projectRepository.createQueryBuilder('project')
      .leftJoinAndSelect('project.author', 'author')
      .leftJoinAndSelect('project.lastUpdatedBy', 'lastUpdatedBy')
      .leftJoinAndSelect('project.status', 'status')
      .leftJoinAndSelect('project.area', 'area')
      .select([
        'project',
        'author.id',
        'author.name',
        'author.email',
        'author.role',
        'lastUpdatedBy.id',
        'lastUpdatedBy.name',
        'lastUpdatedBy.email',
        'status.id',
        'status.name',
        'area.id',
        'area.name'
      ]);

    // Both admins and creators can see all projects
    // No filtering by authorId for creators anymore

    // Apply filters
    if (statusId) {
      queryBuilder.andWhere('project.statusId = :statusId', { statusId });
    }

    if (areaId) {
      queryBuilder.andWhere('project.areaId = :areaId', { areaId });
    }

    // Apply ordering
    queryBuilder.orderBy(`project.${orderBy}`, orderDirection);

    return queryBuilder.getMany();
  }

  async findOne(id: number, user: User): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['author', 'lastUpdatedBy', 'status', 'area'],
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
        status: {
          id: true,
          name: true,
        },
        area: {
          id: true,
          name: true,
        },
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    // Both admins and creators can access any project
    // No authorId restriction for creators anymore

    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto, user: User): Promise<Project> {
    const previousProject = await this.findOne(id, user);
    
    // Creators can only update their own projects, admins can update any project
    if (user.role !== UserRole.ADMIN && previousProject.authorId !== user.id) {
      throw new ForbiddenException('You can only update your own projects');
    }

    // Validate that the status exists if being updated
    if (updateProjectDto.statusId) {
      const status = await this.projectStatusRepository.findOne({
        where: { id: updateProjectDto.statusId }
      });
      if (!status) {
        throw new NotFoundException('Project status not found');
      }
    }

    // Validate that the area exists if being updated
    if (updateProjectDto.areaId) {
      const area = await this.projectAreaRepository.findOne({
        where: { id: updateProjectDto.areaId }
      });
      if (!area) {
        throw new NotFoundException('Project area not found');
      }
    }

    // Create a copy of the previous project for history
    const projectBeforeUpdate = { ...previousProject };

    // Update the project
    Object.assign(previousProject, updateProjectDto);
    previousProject.lastUpdatedById = user.id;

    const updatedProject = await this.projectRepository.save(previousProject);

    // Detect changes for history
    const changes = this.projectHistoryService.getChanges(projectBeforeUpdate, updatedProject);
    
    // Log to history if there are changes
    if (changes.length > 0) {
      await this.projectHistoryService.logProjectUpdated(
        updatedProject,
        user,
        projectBeforeUpdate,
        changes,
      );
    }

    // Log specific changes
    if (updateProjectDto.statusId && updateProjectDto.statusId !== projectBeforeUpdate.statusId) {
      await this.projectHistoryService.logStatusChanged(
        updatedProject,
        user,
        projectBeforeUpdate.statusId,
        updateProjectDto.statusId,
      );
    }

    if (updateProjectDto.areaId && updateProjectDto.areaId !== projectBeforeUpdate.areaId) {
      await this.projectHistoryService.logAreaChanged(
        updatedProject,
        user,
        projectBeforeUpdate.areaId,
        updateProjectDto.areaId,
      );
    }

    if (updateProjectDto.conclusion && !projectBeforeUpdate.conclusion) {
      await this.projectHistoryService.logConclusionAdded(
        updatedProject,
        user,
        updateProjectDto.conclusion,
      );
    }

    return updatedProject;
  }

  async remove(id: number, user: User): Promise<void> {
    const project = await this.findOne(id, user);
    
    // Creators can only delete their own projects, admins can delete any project
    if (user.role !== UserRole.ADMIN && project.authorId !== user.id) {
      throw new ForbiddenException('You can only delete your own projects');
    }

    // Log to history before deletion
    await this.projectHistoryService.logProjectDeleted(project, user);

    await this.projectRepository.remove(project);
  }

  async getProjectHistory(projectId: number, user: User): Promise<any[]> {
    const project = await this.findOne(projectId, user);
    
    if (user.role !== UserRole.ADMIN && project.authorId !== user.id) {
      throw new ForbiddenException('Solo puedes ver el historial de tus propios proyectos');
    }

    const history = await this.projectHistoryService.getProjectHistory(projectId);
    
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

  async getUserProjectHistory(userId: number, requestingUser: User): Promise<any[]> {
    // Solo admins pueden ver historial de otros usuarios
    if (requestingUser.role !== UserRole.ADMIN && requestingUser.id !== userId) {
      throw new ForbiddenException('Solo puedes ver tu propio historial de proyectos');
    }

    const history = await this.projectHistoryService.getProjectHistoryByUser(userId);
    
    return history.map(entry => ({
      id: entry.id,
      action: entry.action,
      changes: entry.changes ? JSON.parse(entry.changes) : null,
      notes: entry.notes,
      createdAt: entry.createdAt,
      project: {
        id: entry.project.id,
        title: entry.project.title,
      },
      previousData: entry.previousData ? JSON.parse(entry.previousData) : null,
      newData: entry.newData ? JSON.parse(entry.newData) : null,
    }));
  }
} 