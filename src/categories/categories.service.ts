import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

export interface CategoryQueryOptions {
  orderBy?: 'priority' | 'name' | 'createdAt' | 'updatedAt';
  orderDirection?: 'ASC' | 'DESC';
}

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    // Verificar si ya existe una categoría con el mismo nombre
    const existingCategory = await this.categoryRepository.findOne({
      where: { name: createCategoryDto.name }
    });

    if (existingCategory) {
      throw new ConflictException('Ya existe una categoría con este nombre');
    }

    const category = this.categoryRepository.create({
      ...createCategoryDto,
      priority: createCategoryDto.priority || 0, // Valor por defecto
    });
    return this.categoryRepository.save(category);
  }

  async findAll(options: CategoryQueryOptions = {}): Promise<Category[]> {
    const { orderBy = 'priority', orderDirection = 'DESC' } = options;
    
    return this.categoryRepository.find({
      relations: ['subcategories'],
      order: { [orderBy]: orderDirection }
    });
  }

  async findActive(options: CategoryQueryOptions = {}): Promise<Category[]> {
    const { orderBy = 'priority', orderDirection = 'DESC' } = options;
    
    return this.categoryRepository.find({
      where: { isActive: true },
      relations: ['subcategories'],
      order: { [orderBy]: orderDirection }
    });
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['subcategories']
    });

    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);

    // Si se está actualizando el nombre, verificar que no exista otro con el mismo nombre
    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      const existingCategory = await this.categoryRepository.findOne({
        where: { name: updateCategoryDto.name }
      });

      if (existingCategory) {
        throw new ConflictException('Ya existe una categoría con este nombre');
      }
    }

    Object.assign(category, updateCategoryDto);
    return this.categoryRepository.save(category);
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    
    // Verificar si tiene subcategorías
    if (category.subcategories && category.subcategories.length > 0) {
      throw new ConflictException('No se puede eliminar una categoría que tiene subcategorías');
    }

    await this.categoryRepository.remove(category);
  }

  async toggleActive(id: number): Promise<Category> {
    const category = await this.findOne(id);
    category.isActive = !category.isActive;
    return this.categoryRepository.save(category);
  }
} 