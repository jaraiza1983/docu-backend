import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { ProjectCategory } from '../../project-categories/entities/project-category.entity';

@Entity('projects')
export class Project {
  @ApiProperty({ description: 'Unique identifier for the project' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Project title' })
  @Column()
  title: string;

  @ApiProperty({ description: 'Project body/content' })
  @Column('text')
  body: string;

  @ApiProperty({ description: 'Project category ID' })
  @Column()
  categoryId: number;

  @ApiProperty({ description: 'User ID who created the project' })
  @Column()
  createdById: number;

  @ApiProperty({ description: 'User ID who last updated the project' })
  @Column({ nullable: true })
  updatedById: number;

  @ApiProperty({ description: 'Creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, user => user.projects)
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @ManyToOne(() => User, user => user.updatedProjects)
  @JoinColumn({ name: 'updatedById' })
  updatedBy: User;

  @ManyToOne(() => ProjectCategory, category => category.projects)
  @JoinColumn({ name: 'categoryId' })
  category: ProjectCategory;

  constructor(partial: Partial<Project>) {
    Object.assign(this, partial);
  }
} 