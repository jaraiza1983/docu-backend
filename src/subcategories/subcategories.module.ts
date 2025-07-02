import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubcategoriesService } from './subcategories.service';
import { SubcategoriesController } from './subcategories.controller';
import { Subcategory } from './entities/subcategory.entity';
import { Category } from '../categories/entities/category.entity';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subcategory, Category]),
    CategoriesModule
  ],
  controllers: [SubcategoriesController],
  providers: [SubcategoriesService],
  exports: [SubcategoriesService],
})
export class SubcategoriesModule {} 