import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectCategoriesService } from './project-categories.service';
import { ProjectCategoriesController } from './project-categories.controller';
import { ProjectCategory } from './entities/project-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectCategory])],
  controllers: [ProjectCategoriesController],
  providers: [ProjectCategoriesService],
  exports: [ProjectCategoriesService],
})
export class ProjectCategoriesModule {} 