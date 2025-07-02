import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectHistory, ProjectHistoryAction } from '../entities/project-history.entity';
import { Project } from '../entities/project.entity';
import { User } from '../../users/entities/user.entity';

export interface ProjectChange {
  field: string;
  oldValue: any;
  newValue: any;
}

@Injectable()
export class ProjectHistoryService {
  constructor(
    @InjectRepository(ProjectHistory)
    private projectHistoryRepository: Repository<ProjectHistory>,
  ) {}

  async logProjectCreated(project: Project, user: User): Promise<void> {
    const history = this.projectHistoryRepository.create({
      action: ProjectHistoryAction.CREATED,
      projectId: project.id,
      userId: user.id,
      notes: 'Project created',
      newData: JSON.stringify({
        title: project.title,
        description: project.description,
        target: project.target,
        statusId: project.statusId,
        areaId: project.areaId,
        priority: project.priority,
      }),
    });

    await this.projectHistoryRepository.save(history);
  }

  async logProjectUpdated(
    project: Project,
    user: User,
    previousProject: Project,
    changes: ProjectChange[],
  ): Promise<void> {
    const history = this.projectHistoryRepository.create({
      action: ProjectHistoryAction.UPDATED,
      projectId: project.id,
      userId: user.id,
      notes: 'Project updated',
      changes: JSON.stringify(changes),
      previousData: JSON.stringify({
        title: previousProject.title,
        description: previousProject.description,
        target: previousProject.target,
        conclusion: previousProject.conclusion,
        statusId: previousProject.statusId,
        areaId: previousProject.areaId,
        priority: previousProject.priority,
      }),
      newData: JSON.stringify({
        title: project.title,
        description: project.description,
        target: project.target,
        conclusion: project.conclusion,
        statusId: project.statusId,
        areaId: project.areaId,
        priority: project.priority,
      }),
    });

    await this.projectHistoryRepository.save(history);
  }

  async logStatusChanged(
    project: Project,
    user: User,
    previousStatusId: number,
    newStatusId: number,
  ): Promise<void> {
    const history = this.projectHistoryRepository.create({
      action: ProjectHistoryAction.STATUS_CHANGED,
      projectId: project.id,
      userId: user.id,
      notes: `Status changed from ID ${previousStatusId} to ID ${newStatusId}`,
      previousData: JSON.stringify({ statusId: previousStatusId }),
      newData: JSON.stringify({ statusId: newStatusId }),
    });

    await this.projectHistoryRepository.save(history);
  }

  async logAreaChanged(
    project: Project,
    user: User,
    previousAreaId: number,
    newAreaId: number,
  ): Promise<void> {
    const history = this.projectHistoryRepository.create({
      action: ProjectHistoryAction.AREA_CHANGED,
      projectId: project.id,
      userId: user.id,
      notes: `Area changed from ID ${previousAreaId} to ID ${newAreaId}`,
      previousData: JSON.stringify({ areaId: previousAreaId }),
      newData: JSON.stringify({ areaId: newAreaId }),
    });

    await this.projectHistoryRepository.save(history);
  }

  async logConclusionAdded(
    project: Project,
    user: User,
    conclusion: string,
  ): Promise<void> {
    const history = this.projectHistoryRepository.create({
      action: ProjectHistoryAction.CONCLUSION_ADDED,
      projectId: project.id,
      userId: user.id,
      notes: 'Conclusion added to project',
      newData: JSON.stringify({ conclusion }),
    });

    await this.projectHistoryRepository.save(history);
  }

  async logProjectDeleted(project: Project, user: User): Promise<void> {
    const history = this.projectHistoryRepository.create({
      action: ProjectHistoryAction.DELETED,
      projectId: project.id,
      userId: user.id,
      notes: 'Project deleted',
      previousData: JSON.stringify({
        title: project.title,
        description: project.description,
        target: project.target,
        conclusion: project.conclusion,
        statusId: project.statusId,
        areaId: project.areaId,
        priority: project.priority,
      }),
    });

    await this.projectHistoryRepository.save(history);
  }

  getChanges(previousProject: Project, updatedProject: Project): ProjectChange[] {
    const changes: ProjectChange[] = [];

    if (previousProject.title !== updatedProject.title) {
      changes.push({
        field: 'title',
        oldValue: previousProject.title,
        newValue: updatedProject.title,
      });
    }

    if (previousProject.description !== updatedProject.description) {
      changes.push({
        field: 'description',
        oldValue: previousProject.description,
        newValue: updatedProject.description,
      });
    }

    if (previousProject.target !== updatedProject.target) {
      changes.push({
        field: 'target',
        oldValue: previousProject.target,
        newValue: updatedProject.target,
      });
    }

    if (previousProject.conclusion !== updatedProject.conclusion) {
      changes.push({
        field: 'conclusion',
        oldValue: previousProject.conclusion,
        newValue: updatedProject.conclusion,
      });
    }

    if (previousProject.statusId !== updatedProject.statusId) {
      changes.push({
        field: 'statusId',
        oldValue: previousProject.statusId,
        newValue: updatedProject.statusId,
      });
    }

    if (previousProject.areaId !== updatedProject.areaId) {
      changes.push({
        field: 'areaId',
        oldValue: previousProject.areaId,
        newValue: updatedProject.areaId,
      });
    }

    if (previousProject.priority !== updatedProject.priority) {
      changes.push({
        field: 'priority',
        oldValue: previousProject.priority,
        newValue: updatedProject.priority,
      });
    }

    return changes;
  }

  async getProjectHistory(projectId: number): Promise<ProjectHistory[]> {
    return this.projectHistoryRepository.find({
      where: { projectId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
      select: {
        user: {
          id: true,
          name: true,
          email: true,
        },
      },
    });
  }

  async getProjectHistoryByUser(userId: number): Promise<ProjectHistory[]> {
    return this.projectHistoryRepository.find({
      where: { userId },
      relations: ['project'],
      order: { createdAt: 'DESC' },
      select: {
        project: {
          id: true,
          title: true,
        },
      },
    });
  }
} 