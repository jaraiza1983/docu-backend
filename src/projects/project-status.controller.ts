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
import { ProjectStatusService, ProjectStatusQueryOptions } from './project-status.service';
import { CreateProjectStatusDto } from './dto/create-project-status.dto';
import { UpdateProjectStatusDto } from './dto/update-project-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('project-statuses')
export class ProjectStatusController {
  constructor(private readonly projectStatusService: ProjectStatusService) {}

  @Get('public')
  findActive(
    @Query('orderBy') orderBy?: 'priority' | 'name' | 'createdAt' | 'updatedAt',
    @Query('orderDirection') orderDirection?: 'ASC' | 'DESC',
  ) {
    const options: ProjectStatusQueryOptions = {
      orderBy: orderBy || 'priority',
      orderDirection: orderDirection || 'DESC',
    };
    return this.projectStatusService.findActive(options);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createProjectStatusDto: CreateProjectStatusDto) {
    return this.projectStatusService.create(createProjectStatusDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll(
    @Query('active') active?: string,
    @Query('orderBy') orderBy?: 'priority' | 'name' | 'createdAt' | 'updatedAt',
    @Query('orderDirection') orderDirection?: 'ASC' | 'DESC',
  ) {
    const options: ProjectStatusQueryOptions = {
      orderBy: orderBy || 'priority',
      orderDirection: orderDirection || 'DESC',
    };
    
    if (active === 'true') {
      return this.projectStatusService.findActive(options);
    }
    return this.projectStatusService.findAll(options);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.projectStatusService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateProjectStatusDto: UpdateProjectStatusDto) {
    return this.projectStatusService.update(+id, updateProjectStatusDto);
  }

  @Patch(':id/toggle')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  toggleActive(@Param('id') id: string) {
    return this.projectStatusService.toggleActive(+id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.projectStatusService.remove(+id);
  }
} 