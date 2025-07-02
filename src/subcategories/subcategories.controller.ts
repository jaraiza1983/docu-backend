import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { SubcategoriesService, SubcategoryQueryOptions } from './subcategories.service';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('subcategories')
export class SubcategoriesController {
  constructor(private readonly subcategoriesService: SubcategoriesService) {}

  @Get('public')
  findActive(
    @Query('categoryId') categoryId?: string,
    @Query('orderBy') orderBy?: 'priority' | 'name' | 'createdAt' | 'updatedAt',
    @Query('orderDirection') orderDirection?: 'ASC' | 'DESC',
  ) {
    const options: SubcategoryQueryOptions = {
      orderBy: orderBy || 'priority',
      orderDirection: orderDirection || 'DESC',
    };
    
    if (categoryId) {
      return this.subcategoriesService.findByCategory(+categoryId, options);
    }
    return this.subcategoriesService.findActive(options);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createSubcategoryDto: CreateSubcategoryDto) {
    return this.subcategoriesService.create(createSubcategoryDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll(
    @Query('active') active?: string,
    @Query('categoryId') categoryId?: string,
    @Query('orderBy') orderBy?: 'priority' | 'name' | 'createdAt' | 'updatedAt',
    @Query('orderDirection') orderDirection?: 'ASC' | 'DESC',
  ) {
    const options: SubcategoryQueryOptions = {
      orderBy: orderBy || 'priority',
      orderDirection: orderDirection || 'DESC',
    };
    
    if (categoryId) {
      return this.subcategoriesService.findByCategory(+categoryId, options);
    }
    if (active === 'true') {
      return this.subcategoriesService.findActive(options);
    }
    return this.subcategoriesService.findAll(options);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.subcategoriesService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateSubcategoryDto: UpdateSubcategoryDto) {
    return this.subcategoriesService.update(+id, updateSubcategoryDto);
  }

  @Patch(':id/toggle')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  toggleActive(@Param('id') id: string) {
    return this.subcategoriesService.toggleActive(+id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.subcategoriesService.remove(+id);
  }
} 