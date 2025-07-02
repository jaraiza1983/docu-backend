import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Project } from './project.entity';
import { User } from '../../users/entities/user.entity';

export enum ProjectHistoryAction {
  CREATED = 'created',
  UPDATED = 'updated',
  STATUS_CHANGED = 'status_changed',
  AREA_CHANGED = 'area_changed',
  CONCLUSION_ADDED = 'conclusion_added',
  DELETED = 'deleted',
}

@Entity('project_history')
export class ProjectHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    enum: ProjectHistoryAction,
  })
  action: ProjectHistoryAction;

  @Column({ type: 'text', nullable: true })
  changes: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'text', nullable: true })
  previousData: string;

  @Column({ type: 'text', nullable: true })
  newData: string;

  @CreateDateColumn()
  createdAt: Date;

  // Project relationship
  @ManyToOne(() => Project, (project) => project.history, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @Column()
  projectId: number;

  // User who made the change
  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;
} 