import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';
import { Content } from './entities/content.entity';
import { ContentHistory } from './entities/content-history.entity';
import { Category } from '../categories/entities/category.entity';
import { Subcategory } from '../subcategories/entities/subcategory.entity';
import { ContentHistoryService } from './services/content-history.service';

@Module({
  imports: [TypeOrmModule.forFeature([Content, ContentHistory, Category, Subcategory])],
  controllers: [ContentController],
  providers: [ContentService, ContentHistoryService],
  exports: [ContentService, ContentHistoryService],
})
export class ContentModule {} 