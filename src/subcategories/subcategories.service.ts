import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subcategory } from './entities/subcategory.entity';
import { Category } from '../categories/entities/category.entity';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';

export interface SubcategoryQueryOptions {
  orderBy?: 'priority' | 'name' | 'createdAt' | 'updatedAt';
  orderDirection?: 'ASC' | 'DESC';
}

@Injectable()
export class SubcategoriesService {
  constructor(
    @InjectRepository(Subcategory)
    private subcategoryRepository: Repository<Subcategory>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createSubcategoryDto: CreateSubcategoryDto): Promise<Subcategory> {
    // Verificar que la categoría existe
    const category = await this.categoryRepository.findOne({
      where: { id: createSubcategoryDto.categoryId }
    });

    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }

    // Verificar si ya existe una subcategoría con el mismo nombre en la misma categoría
    const existingSubcategory = await this.subcategoryRepository.findOne({
      where: { 
        name: createSubcategoryDto.name,
        categoryId: createSubcategoryDto.categoryId
      }
    });

    if (existingSubcategory) {
      throw new ConflictException('Ya existe una subcategoría con este nombre en esta categoría');
    }

    const subcategory = this.subcategoryRepository.create({
      ...createSubcategoryDto,
      priority: createSubcategoryDto.priority || 0, // Valor por defecto
    });
    return this.subcategoryRepository.save(subcategory);
  }

  async findAll(options: SubcategoryQueryOptions = {}): Promise<Subcategory[]> {
    const { orderBy = 'priority', orderDirection = 'DESC' } = options;
    
    return this.subcategoryRepository.find({
      relations: ['category'],
      order: { [orderBy]: orderDirection }
    });
  }

  async findActive(options: SubcategoryQueryOptions = {}): Promise<Subcategory[]> {
    const { orderBy = 'priority', orderDirection = 'DESC' } = options;
    
    return this.subcategoryRepository.find({
      where: { isActive: true },
      relations: ['category'],
      order: { [orderBy]: orderDirection }
    });
  }

  async findByCategory(categoryId: number, options: SubcategoryQueryOptions = {}): Promise<Subcategory[]> {
    const { orderBy = 'priority', orderDirection = 'DESC' } = options;
    
    // Verificar que la categoría existe
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId }
    });

    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }

    return this.subcategoryRepository.find({
      where: { categoryId },
      relations: ['category'],
      order: { [orderBy]: orderDirection }
    });
  }

  async findOne(id: number): Promise<Subcategory> {
    const subcategory = await this.subcategoryRepository.findOne({
      where: { id },
      relations: ['category']
    });

    if (!subcategory) {
      throw new NotFoundException('Subcategoría no encontrada');
    }

    return subcategory;
  }

  async update(id: number, updateSubcategoryDto: UpdateSubcategoryDto): Promise<Subcategory> {
    const subcategory = await this.findOne(id);

    // Si se está cambiando la categoría, verificar que existe
    if (updateSubcategoryDto.categoryId && updateSubcategoryDto.categoryId !== subcategory.categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: updateSubcategoryDto.categoryId }
      });

      if (!category) {
        throw new NotFoundException('Categoría no encontrada');
      }
    }

    // Si se está actualizando el nombre, verificar que no exista otro con el mismo nombre en la misma categoría
    if (updateSubcategoryDto.name && updateSubcategoryDto.name !== subcategory.name) {
      const categoryId = updateSubcategoryDto.categoryId || subcategory.categoryId;
      const existingSubcategory = await this.subcategoryRepository.findOne({
        where: { 
          name: updateSubcategoryDto.name,
          categoryId
        }
      });

      if (existingSubcategory) {
        throw new ConflictException('Ya existe una subcategoría con este nombre en esta categoría');
      }
    }

    Object.assign(subcategory, updateSubcategoryDto);
    return this.subcategoryRepository.save(subcategory);
  }

  async remove(id: number): Promise<void> {
    const subcategory = await this.findOne(id);
    
    // Verificar si tiene contenido asociado
    if (subcategory.contents && subcategory.contents.length > 0) {
      throw new ConflictException('No se puede eliminar una subcategoría que tiene contenido asociado');
    }

    await this.subcategoryRepository.remove(subcategory);
  }

  async toggleActive(id: number): Promise<Subcategory> {
    const subcategory = await this.findOne(id);
    subcategory.isActive = !subcategory.isActive;
    return this.subcategoryRepository.save(subcategory);
  }
} 