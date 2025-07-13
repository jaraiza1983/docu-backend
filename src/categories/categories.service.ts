import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { name, parentId } = createCategoryDto;

    // Check if category with same name exists at the same level
    const existingCategory = await this.categoriesRepository.findOne({
      where: { name, parentId },
    });

    if (existingCategory) {
      throw new ConflictException('Category with this name already exists at this level');
    }

    // If parentId is provided, verify parent exists
    if (parentId) {
      const parent = await this.categoriesRepository.findOne({
        where: { id: parentId },
      });
      if (!parent) {
        throw new NotFoundException('Parent category not found');
      }
    }

    const category = this.categoriesRepository.create(createCategoryDto);
    return this.categoriesRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return this.categoriesRepository.find({
      relations: ['parent', 'subcategories'],
      order: { name: 'ASC' },
    });
  }

  async findRootCategories(): Promise<Category[]> {
    return this.categoriesRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.subcategories', 'subcategories')
      .where('category.parentId IS NULL')
      .orderBy('category.name', 'ASC')
      .getMany();
  }

  async findSubcategories(parentId: number): Promise<Category[]> {
    return this.categoriesRepository.find({
      where: { parentId },
      relations: ['parent'],
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['parent', 'subcategories'],
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);
    const { name, parentId } = updateCategoryDto;

    // Check if category with same name exists at the same level (excluding current category)
    if (name) {
      const existingCategory = await this.categoriesRepository.findOne({
        where: { name, parentId: parentId || category.parentId },
      });

      if (existingCategory && existingCategory.id !== id) {
        throw new ConflictException('Category with this name already exists at this level');
      }
    }

    // If parentId is provided, verify parent exists and prevent circular references
    if (parentId) {
      if (parentId === id) {
        throw new ConflictException('Category cannot be its own parent');
      }

      const parent = await this.categoriesRepository.findOne({
        where: { id: parentId },
      });
      if (!parent) {
        throw new NotFoundException('Parent category not found');
      }

      // Check for circular references
      const isCircular = await this.checkCircularReference(id, parentId);
      if (isCircular) {
        throw new ConflictException('Circular reference detected');
      }
    }

    await this.categoriesRepository.update(id, updateCategoryDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);

    // Check if category has subcategories
    const subcategories = await this.categoriesRepository.find({
      where: { parentId: id },
    });

    if (subcategories.length > 0) {
      throw new ConflictException('Cannot delete category with subcategories');
    }

    // Check if category has topics
    const topics = await this.categoriesRepository
      .createQueryBuilder('category')
      .leftJoin('category.topics', 'topic')
      .where('category.id = :id', { id })
      .getCount();

    if (topics > 0) {
      throw new ConflictException('Cannot delete category with associated topics');
    }

    await this.categoriesRepository.remove(category);
  }

  private async checkCircularReference(categoryId: number, newParentId: number): Promise<boolean> {
    let currentParentId = newParentId;
    const visited = new Set<number>();

    while (currentParentId) {
      if (visited.has(currentParentId)) {
        return true; // Circular reference detected
      }

      visited.add(currentParentId);

      const parent = await this.categoriesRepository.findOne({
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