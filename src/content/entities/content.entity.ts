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
import { Category } from '../../categories/entities/category.entity';
import { Subcategory } from '../../subcategories/entities/subcategory.entity';
import { ContentHistory } from './content-history.entity';

export enum ContentStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

@Entity('contents')
export class Content {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column('simple-array')
  tags: string[];

  @Column({
    type: 'varchar',
    enum: ContentStatus,
    default: ContentStatus.DRAFT,
  })
  status: ContentStatus;

  @Column({ type: 'int', default: 0 })
  priority: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.contents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'authorId' })
  author: User;

  @Column()
  authorId: number;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'lastUpdatedById' })
  lastUpdatedBy: User;

  @Column({ nullable: true })
  lastUpdatedById: number;

  @ManyToOne(() => Category, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column({ nullable: true })
  categoryId: number;

  @ManyToOne(() => Subcategory, (subcategory) => subcategory.contents, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'subcategoryId' })
  subcategory: Subcategory;

  @Column({ nullable: true })
  subcategoryId: number;

  @OneToMany(() => ContentHistory, (history) => history.content)
  history: ContentHistory[];
} 