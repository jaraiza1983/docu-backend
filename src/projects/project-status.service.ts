import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectStatus } from './entities/project-status.entity';
import { CreateProjectStatusDto } from './dto/create-project-status.dto';
import { UpdateProjectStatusDto } from './dto/update-project-status.dto';

export interface ProjectStatusQueryOptions {
  orderBy?: 'priority' | 'name' | 'createdAt' | 'updatedAt';
  orderDirection?: 'ASC' | 'DESC';
}

@Injectable()
export class ProjectStatusService {
  constructor(
    @InjectRepository(ProjectStatus)
    private projectStatusRepository: Repository<ProjectStatus>,
  ) {}

  async create(createProjectStatusDto: CreateProjectStatusDto): Promise<ProjectStatus> {
    // Verificar si ya existe un status con el mismo nombre
    const existingStatus = await this.projectStatusRepository.findOne({
      where: { name: createProjectStatusDto.name }
    });

    if (existingStatus) {
      throw new ConflictException('Ya existe un estado de proyecto con este nombre');
    }

    const projectStatus = this.projectStatusRepository.create({
      ...createProjectStatusDto,
      priority: createProjectStatusDto.priority || 0,
    });
    return this.projectStatusRepository.save(projectStatus);
  }

  async findAll(options: ProjectStatusQueryOptions = {}): Promise<ProjectStatus[]> {
    const { orderBy = 'priority', orderDirection = 'DESC' } = options;
    
    return this.projectStatusRepository.find({
      order: { [orderBy]: orderDirection }
    });
  }

  async findActive(options: ProjectStatusQueryOptions = {}): Promise<ProjectStatus[]> {
    const { orderBy = 'priority', orderDirection = 'DESC' } = options;
    
    return this.projectStatusRepository.find({
      where: { isActive: true },
      order: { [orderBy]: orderDirection }
    });
  }

  async findOne(id: number): Promise<ProjectStatus> {
    const projectStatus = await this.projectStatusRepository.findOne({
      where: { id }
    });

    if (!projectStatus) {
      throw new NotFoundException('Estado de proyecto no encontrado');
    }

    return projectStatus;
  }

  async update(id: number, updateProjectStatusDto: UpdateProjectStatusDto): Promise<ProjectStatus> {
    const projectStatus = await this.findOne(id);

    // Si se está actualizando el nombre, verificar que no exista otro con el mismo nombre
    if (updateProjectStatusDto.name && updateProjectStatusDto.name !== projectStatus.name) {
      const existingStatus = await this.projectStatusRepository.findOne({
        where: { name: updateProjectStatusDto.name }
      });

      if (existingStatus) {
        throw new ConflictException('Ya existe un estado de proyecto con este nombre');
      }
    }

    Object.assign(projectStatus, updateProjectStatusDto);
    return this.projectStatusRepository.save(projectStatus);
  }

  async remove(id: number): Promise<void> {
    const projectStatus = await this.findOne(id);
    
    // Verificar si tiene proyectos asociados
    if (projectStatus.projects && projectStatus.projects.length > 0) {
      throw new ConflictException('No se puede eliminar un estado que tiene proyectos asociados');
    }

    await this.projectStatusRepository.remove(projectStatus);
  }

  async toggleActive(id: number): Promise<ProjectStatus> {
    const projectStatus = await this.findOne(id);
    projectStatus.isActive = !projectStatus.isActive;
    return this.projectStatusRepository.save(projectStatus);
  }
} 