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
import { CategoriesService, CategoryQueryOptions } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('public')
  findActive(
    @Query('orderBy') orderBy?: 'priority' | 'name' | 'createdAt' | 'updatedAt',
    @Query('orderDirection') orderDirection?: 'ASC' | 'DESC',
  ) {
    const options: CategoryQueryOptions = {
      orderBy: orderBy || 'priority',
      orderDirection: orderDirection || 'DESC',
    };
    return this.categoriesService.findActive(options);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll(
    @Query('active') active?: string,
    @Query('orderBy') orderBy?: 'priority' | 'name' | 'createdAt' | 'updatedAt',
    @Query('orderDirection') orderDirection?: 'ASC' | 'DESC',
  ) {
    const options: CategoryQueryOptions = {
      orderBy: orderBy || 'priority',
      orderDirection: orderDirection || 'DESC',
    };
    
    if (active === 'true') {
      return this.categoriesService.findActive(options);
    }
    return this.categoriesService.findAll(options);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Patch(':id/toggle')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  toggleActive(@Param('id') id: string) {
    return this.categoriesService.toggleActive(+id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
} 