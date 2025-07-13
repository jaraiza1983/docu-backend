import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Project } from '../../projects/entities/project.entity';

@Entity('project_categories')
export class ProjectCategory {
  @ApiProperty({ description: 'Unique identifier for the project category' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Project category name' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Project category description' })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({ description: 'Parent project category ID (for subcategories)' })
  @Column({ nullable: true })
  parentId: number;

  @ApiProperty({ description: 'Creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => ProjectCategory, category => category.subcategories)
  @JoinColumn({ name: 'parentId' })
  parent: ProjectCategory;

  @OneToMany(() => ProjectCategory, category => category.parent)
  subcategories: ProjectCategory[];

  @OneToMany(() => Project, project => project.category)
  projects: Project[];

  constructor(partial: Partial<ProjectCategory>) {
    Object.assign(this, partial);
  }
} 