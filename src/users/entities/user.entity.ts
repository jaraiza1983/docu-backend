import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcryptjs';
import { Content } from '../../content/entities/content.entity';
import { Project } from '../../projects/entities/project.entity';

export enum UserRole {
  ADMIN = 'admin',
  CREATOR = 'creator',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({
    type: 'varchar',
    enum: UserRole,
    default: UserRole.CREATOR,
  })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Content, (content) => content.author)
  contents: Content[];

  @OneToMany(() => Project, (project) => project.author)
  projects: Project[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
} 