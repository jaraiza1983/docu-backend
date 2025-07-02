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
import { ProjectAreaService, ProjectAreaQueryOptions } from './project-area.service';
import { CreateProjectAreaDto } from './dto/create-project-area.dto';
import { UpdateProjectAreaDto } from './dto/update-project-area.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('project-areas')
export class ProjectAreaController {
  constructor(private readonly projectAreaService: ProjectAreaService) {}

  @Get('public')
  findActive(
    @Query('orderBy') orderBy?: 'priority' | 'name' | 'createdAt' | 'updatedAt',
    @Query('orderDirection') orderDirection?: 'ASC' | 'DESC',
  ) {
    const options: ProjectAreaQueryOptions = {
      orderBy: orderBy || 'priority',
      orderDirection: orderDirection || 'DESC',
    };
    return this.projectAreaService.findActive(options);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createProjectAreaDto: CreateProjectAreaDto) {
    return this.projectAreaService.create(createProjectAreaDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll(
    @Query('active') active?: string,
    @Query('orderBy') orderBy?: 'priority' | 'name' | 'createdAt' | 'updatedAt',
    @Query('orderDirection') orderDirection?: 'ASC' | 'DESC',
  ) {
    const options: ProjectAreaQueryOptions = {
      orderBy: orderBy || 'priority',
      orderDirection: orderDirection || 'DESC',
    };
    
    if (active === 'true') {
      return this.projectAreaService.findActive(options);
    }
    return this.projectAreaService.findAll(options);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.projectAreaService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateProjectAreaDto: UpdateProjectAreaDto) {
    return this.projectAreaService.update(+id, updateProjectAreaDto);
  }

  @Patch(':id/toggle')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  toggleActive(@Param('id') id: string) {
    return this.projectAreaService.toggleActive(+id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.projectAreaService.remove(+id);
  }
} 