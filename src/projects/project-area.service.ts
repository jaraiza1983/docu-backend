import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectArea } from './entities/project-area.entity';
import { CreateProjectAreaDto } from './dto/create-project-area.dto';
import { UpdateProjectAreaDto } from './dto/update-project-area.dto';

export interface ProjectAreaQueryOptions {
  orderBy?: 'priority' | 'name' | 'createdAt' | 'updatedAt';
  orderDirection?: 'ASC' | 'DESC';
}

@Injectable()
export class ProjectAreaService {
  constructor(
    @InjectRepository(ProjectArea)
    private projectAreaRepository: Repository<ProjectArea>,
  ) {}

  async create(createProjectAreaDto: CreateProjectAreaDto): Promise<ProjectArea> {
    // Verificar si ya existe un área con el mismo nombre
    const existingArea = await this.projectAreaRepository.findOne({
      where: { name: createProjectAreaDto.name }
    });

    if (existingArea) {
      throw new ConflictException('Ya existe un área de proyecto con este nombre');
    }

    const projectArea = this.projectAreaRepository.create({
      ...createProjectAreaDto,
      priority: createProjectAreaDto.priority || 0,
    });
    return this.projectAreaRepository.save(projectArea);
  }

  async findAll(options: ProjectAreaQueryOptions = {}): Promise<ProjectArea[]> {
    const { orderBy = 'priority', orderDirection = 'DESC' } = options;
    
    return this.projectAreaRepository.find({
      order: { [orderBy]: orderDirection }
    });
  }

  async findActive(options: ProjectAreaQueryOptions = {}): Promise<ProjectArea[]> {
    const { orderBy = 'priority', orderDirection = 'DESC' } = options;
    
    return this.projectAreaRepository.find({
      where: { isActive: true },
      order: { [orderBy]: orderDirection }
    });
  }

  async findOne(id: number): Promise<ProjectArea> {
    const projectArea = await this.projectAreaRepository.findOne({
      where: { id }
    });

    if (!projectArea) {
      throw new NotFoundException('Área de proyecto no encontrada');
    }

    return projectArea;
  }

  async update(id: number, updateProjectAreaDto: UpdateProjectAreaDto): Promise<ProjectArea> {
    const projectArea = await this.findOne(id);

    // Si se está actualizando el nombre, verificar que no exista otro con el mismo nombre
    if (updateProjectAreaDto.name && updateProjectAreaDto.name !== projectArea.name) {
      const existingArea = await this.projectAreaRepository.findOne({
        where: { name: updateProjectAreaDto.name }
      });

      if (existingArea) {
        throw new ConflictException('Ya existe un área de proyecto con este nombre');
      }
    }

    Object.assign(projectArea, updateProjectAreaDto);
    return this.projectAreaRepository.save(projectArea);
  }

  async remove(id: number): Promise<void> {
    const projectArea = await this.findOne(id);
    
    // Verificar si tiene proyectos asociados
    if (projectArea.projects && projectArea.projects.length > 0) {
      throw new ConflictException('No se puede eliminar un área que tiene proyectos asociados');
    }

    await this.projectAreaRepository.remove(projectArea);
  }

  async toggleActive(id: number): Promise<ProjectArea> {
    const projectArea = await this.findOne(id);
    projectArea.isActive = !projectArea.isActive;
    return this.projectAreaRepository.save(projectArea);
  }
} 