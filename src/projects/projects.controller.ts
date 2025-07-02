import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ProjectsService, ProjectQueryOptions } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.CREATOR, UserRole.ADMIN)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Body() createProjectDto: CreateProjectDto, @Request() req) {
    return this.projectsService.create(createProjectDto, req.user);
  }

  @Get()
  findAll(
    @Request() req,
    @Query('orderBy') orderBy?: 'priority' | 'createdAt' | 'updatedAt' | 'title',
    @Query('orderDirection') orderDirection?: 'ASC' | 'DESC',
    @Query('statusId') statusId?: string,
    @Query('areaId') areaId?: string,
  ) {
    const options: ProjectQueryOptions = {
      orderBy: orderBy || 'priority',
      orderDirection: orderDirection || 'DESC',
      statusId: statusId ? +statusId : undefined,
      areaId: areaId ? +areaId : undefined,
    };
    return this.projectsService.findAll(req.user, options);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.projectsService.findOne(+id, req.user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto, @Request() req) {
    return this.projectsService.update(+id, updateProjectDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.projectsService.remove(+id, req.user);
  }

  @Get(':id/history')
  getProjectHistory(@Param('id') id: string, @Request() req) {
    return this.projectsService.getProjectHistory(+id, req.user);
  }

  @Get('history/user/:userId')
  @Roles(UserRole.ADMIN)
  getUserProjectHistory(@Param('userId') userId: string, @Request() req) {
    return this.projectsService.getUserProjectHistory(+userId, req.user);
  }

  @Get('history/my')
  getMyProjectHistory(@Request() req) {
    return this.projectsService.getUserProjectHistory(req.user.id, req.user);
  }
} 