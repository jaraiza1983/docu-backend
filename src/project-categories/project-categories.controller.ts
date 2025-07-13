import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProjectCategoriesService } from './project-categories.service';
import { CreateProjectCategoryDto } from './dto/create-project-category.dto';
import { UpdateProjectCategoryDto } from './dto/update-project-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Project Categories')
@Controller('project-categories')
export class ProjectCategoriesController {
  constructor(private readonly projectCategoriesService: ProjectCategoriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new project category (Admin only)' })
  @ApiResponse({ status: 201, description: 'Project category created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'Parent project category not found' })
  @ApiResponse({ status: 409, description: 'Project category with this name already exists' })
  create(@Body() createProjectCategoryDto: CreateProjectCategoryDto) {
    return this.projectCategoriesService.create(createProjectCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all project categories' })
  @ApiResponse({ status: 200, description: 'Project categories retrieved successfully' })
  findAll() {
    return this.projectCategoriesService.findAll();
  }

  @Get('root')
  @ApiOperation({ summary: 'Get root project categories only' })
  @ApiResponse({ status: 200, description: 'Root project categories retrieved successfully' })
  findRootCategories() {
    return this.projectCategoriesService.findRootCategories();
  }

  @Get(':parentId/subcategories')
  @ApiOperation({ summary: 'Get subcategories of a specific project category' })
  @ApiResponse({ status: 200, description: 'Subcategories retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Parent project category not found' })
  findSubcategories(@Param('parentId', ParseIntPipe) parentId: number) {
    return this.projectCategoriesService.findSubcategories(parentId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project category by ID' })
  @ApiResponse({ status: 200, description: 'Project category retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Project category not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.projectCategoriesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update project category (Admin only)' })
  @ApiResponse({ status: 200, description: 'Project category updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'Project category not found' })
  @ApiResponse({ status: 409, description: 'Project category with this name already exists or circular reference' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProjectCategoryDto: UpdateProjectCategoryDto) {
    return this.projectCategoriesService.update(id, updateProjectCategoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete project category (Admin only)' })
  @ApiResponse({ status: 200, description: 'Project category deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'Project category not found' })
  @ApiResponse({ status: 409, description: 'Cannot delete project category with subcategories or projects' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.projectCategoriesService.remove(id);
  }
} 