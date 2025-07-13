import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectCategory } from './entities/project-category.entity';
import { CreateProjectCategoryDto } from './dto/create-project-category.dto';
import { UpdateProjectCategoryDto } from './dto/update-project-category.dto';

@Injectable()
export class ProjectCategoriesService {
  constructor(
    @InjectRepository(ProjectCategory)
    private projectCategoriesRepository: Repository<ProjectCategory>,
  ) {}

  async create(createProjectCategoryDto: CreateProjectCategoryDto): Promise<ProjectCategory> {
    const { name, parentId } = createProjectCategoryDto;

    // Check if category with same name exists at the same level
    const existingCategory = await this.projectCategoriesRepository.findOne({
      where: { name, parentId },
    });

    if (existingCategory) {
      throw new ConflictException('Project category with this name already exists at this level');
    }

    // If parentId is provided, verify parent exists
    if (parentId) {
      const parent = await this.projectCategoriesRepository.findOne({
        where: { id: parentId },
      });
      if (!parent) {
        throw new NotFoundException('Parent project category not found');
      }
    }

    const category = this.projectCategoriesRepository.create(createProjectCategoryDto);
    return this.projectCategoriesRepository.save(category);
  }

  async findAll(): Promise<ProjectCategory[]> {
    return this.projectCategoriesRepository.find({
      relations: ['parent', 'subcategories'],
      order: { name: 'ASC' },
    });
  }

  async findRootCategories(): Promise<ProjectCategory[]> {
    return this.projectCategoriesRepository.find({
      where: { parentId: null },
      relations: ['subcategories'],
      order: { name: 'ASC' },
    });
  }

  async findSubcategories(parentId: number): Promise<ProjectCategory[]> {
    return this.projectCategoriesRepository.find({
      where: { parentId },
      relations: ['parent'],
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<ProjectCategory> {
    const category = await this.projectCategoriesRepository.findOne({
      where: { id },
      relations: ['parent', 'subcategories'],
    });

    if (!category) {
      throw new NotFoundException(`Project category with ID ${id} not found`);
    }

    return category;
  }

  async update(id: number, updateProjectCategoryDto: UpdateProjectCategoryDto): Promise<ProjectCategory> {
    const category = await this.findOne(id);
    const { name, parentId } = updateProjectCategoryDto;

    // Check if category with same name exists at the same level (excluding current category)
    if (name) {
      const existingCategory = await this.projectCategoriesRepository.findOne({
        where: { name, parentId: parentId || category.parentId },
      });

      if (existingCategory && existingCategory.id !== id) {
        throw new ConflictException('Project category with this name already exists at this level');
      }
    }

    // If parentId is provided, verify parent exists and prevent circular references
    if (parentId) {
      if (parentId === id) {
        throw new ConflictException('Project category cannot be its own parent');
      }

      const parent = await this.projectCategoriesRepository.findOne({
        where: { id: parentId },
      });
      if (!parent) {
        throw new NotFoundException('Parent project category not found');
      }

      // Check for circular references
      const isCircular = await this.checkCircularReference(id, parentId);
      if (isCircular) {
        throw new ConflictException('Circular reference detected');
      }
    }

    await this.projectCategoriesRepository.update(id, updateProjectCategoryDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);

    // Check if category has subcategories
    const subcategories = await this.projectCategoriesRepository.find({
      where: { parentId: id },
    });

    if (subcategories.length > 0) {
      throw new ConflictException('Cannot delete project category with subcategories');
    }

    // Check if category has projects
    const projects = await this.projectCategoriesRepository
      .createQueryBuilder('category')
      .leftJoin('category.projects', 'project')
      .where('category.id = :id', { id })
      .getCount();

    if (projects > 0) {
      throw new ConflictException('Cannot delete project category with associated projects');
    }

    await this.projectCategoriesRepository.remove(category);
  }

  private async checkCircularReference(categoryId: number, newParentId: number): Promise<boolean> {
    let currentParentId = newParentId;
    const visited = new Set<number>();

    while (currentParentId) {
      if (visited.has(currentParentId)) {
        return true; // Circular reference detected
      }

      visited.add(currentParentId);

      const parent = await this.projectCategoriesRepository.findOne({
        where: { id: currentParentId },
      });

      if (!parent) {
        break;
      }

      currentParentId = parent.parentId;
    }

    return false;
  }
} 