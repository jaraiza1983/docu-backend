import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Topic } from '../../topics/entities/topic.entity';
import { Project } from '../../projects/entities/project.entity';
import { LoginHistory } from '../../auth/entities/login-history.entity';
import { File } from '../../files/entities/file.entity';

export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer',
}

@Entity('users')
export class User {
  @ApiProperty({ description: 'Unique identifier for the user' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Username for login' })
  @Column({ unique: true })
  username: string;

  @ApiProperty({ description: 'Email address' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ description: 'First name' })
  @Column()
  firstName: string;

  @ApiProperty({ description: 'Last name' })
  @Column()
  lastName: string;

  @ApiProperty({ description: 'User role (admin, editor, viewer)' })
  @Column({
    type: 'text',
    default: UserRole.VIEWER,
  })
  role: UserRole;

  @Exclude()
  @Column()
  password: string;

  @ApiProperty({ description: 'Whether the user is active' })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Topic, topic => topic.createdBy)
  topics: Topic[];

  @OneToMany(() => Topic, topic => topic.updatedBy)
  updatedTopics: Topic[];

  @OneToMany(() => Project, project => project.createdBy)
  projects: Project[];

  @OneToMany(() => Project, project => project.updatedBy)
  updatedProjects: Project[];

  @OneToMany(() => LoginHistory, loginHistory => loginHistory.user)
  loginHistory: LoginHistory[];

  @OneToMany(() => File, file => file.uploadedBy)
  uploadedFiles: File[];

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
} 