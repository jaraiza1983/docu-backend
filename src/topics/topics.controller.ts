import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TopicsService } from './topics.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User, UserRole } from '../users/entities/user.entity';

@ApiTags('Topics')
@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new topic (Admin/Editor only)' })
  @ApiResponse({ status: 201, description: 'Topic created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin/Editor role required' })
  create(@Body() createTopicDto: CreateTopicDto, @CurrentUser() user: User) {
    return this.topicsService.create(createTopicDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all topics' })
  @ApiResponse({ status: 200, description: 'Topics retrieved successfully' })
  findAll() {
    return this.topicsService.findAll();
  }

  @Get('category/:categoryId')
  @ApiOperation({ summary: 'Get topics by category' })
  @ApiResponse({ status: 200, description: 'Topics retrieved successfully' })
  findByCategory(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.topicsService.findByCategory(categoryId);
  }

  @Get('subcategory/:subcategoryId')
  @ApiOperation({ summary: 'Get topics by subcategory' })
  @ApiResponse({ status: 200, description: 'Topics retrieved successfully' })
  findBySubcategory(@Param('subcategoryId', ParseIntPipe) subcategoryId: number) {
    return this.topicsService.findBySubcategory(subcategoryId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get topics by user' })
  @ApiResponse({ status: 200, description: 'Topics retrieved successfully' })
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.topicsService.findByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get topic by ID' })
  @ApiResponse({ status: 200, description: 'Topic retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Topic not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.topicsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update topic (Admin/Editor only)' })
  @ApiResponse({ status: 200, description: 'Topic updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin/Editor role required' })
  @ApiResponse({ status: 404, description: 'Topic not found' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateTopicDto: UpdateTopicDto, @CurrentUser() user: User) {
    return this.topicsService.update(id, updateTopicDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete topic (Admin/Editor only)' })
  @ApiResponse({ status: 200, description: 'Topic deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin/Editor role required' })
  @ApiResponse({ status: 404, description: 'Topic not found' })
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User) {
    return this.topicsService.remove(id, user);
  }
} 