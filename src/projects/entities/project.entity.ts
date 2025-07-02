import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ProjectStatus } from './project-status.entity';
import { ProjectArea } from './project-area.entity';
import { ProjectHistory } from './project-history.entity';

export enum ProjectStatusEnum {
  IN_PROCESS = 'In Process',
  FINISHED = 'Finished',
}

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  target: string;

  @Column({ type: 'text', nullable: true })
  conclusion: string;

  @Column({ type: 'int', default: 0 })
  priority: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Author (who created the project)
  @ManyToOne(() => User, (user) => user.projects, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'authorId' })
  author: User;

  @Column()
  authorId: number;

  // Last updated by (who last modified the project)
  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'lastUpdatedById' })
  lastUpdatedBy: User;

  @Column({ nullable: true })
  lastUpdatedById: number;

  // Project Status
  @ManyToOne(() => ProjectStatus, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'statusId' })
  status: ProjectStatus;

  @Column()
  statusId: number;

  // Project Area
  @ManyToOne(() => ProjectArea, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'areaId' })
  area: ProjectArea;

  @Column()
  areaId: number;

  // History relationship
  @OneToMany(() => ProjectHistory, (history) => history.project)
  history: ProjectHistory[];
} 