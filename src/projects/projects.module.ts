import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { ProjectStatusService } from './project-status.service';
import { ProjectStatusController } from './project-status.controller';
import { ProjectAreaService } from './project-area.service';
import { ProjectAreaController } from './project-area.controller';
import { ProjectHistoryService } from './services/project-history.service';
import { Project } from './entities/project.entity';
import { ProjectStatus } from './entities/project-status.entity';
import { ProjectArea } from './entities/project-area.entity';
import { ProjectHistory } from './entities/project-history.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Project,
      ProjectStatus,
      ProjectArea,
      ProjectHistory,
      User,
    ]),
  ],
  controllers: [
    ProjectsController,
    ProjectStatusController,
    ProjectAreaController,
  ],
  providers: [
    ProjectsService,
    ProjectStatusService,
    ProjectAreaService,
    ProjectHistoryService,
  ],
  exports: [
    ProjectsService,
    ProjectStatusService,
    ProjectAreaService,
    ProjectHistoryService,
  ],
})
export class ProjectsModule {} 