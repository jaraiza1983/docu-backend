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
import { Category } from '../../categories/entities/category.entity';
import { Content } from '../../content/entities/content.entity';

@Entity('subcategories')
export class Subcategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'int', default: 0 })
  priority: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Category, (category) => category.subcategories, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column()
  categoryId: number;

  @OneToMany(() => Content, (content) => content.subcategory)
  contents: Content[];
} 