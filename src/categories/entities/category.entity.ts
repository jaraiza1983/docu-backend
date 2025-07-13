import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Topic } from '../../topics/entities/topic.entity';

@Entity('categories')
export class Category {
  @ApiProperty({ description: 'Unique identifier for the category' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Category name' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Category description' })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({ description: 'Parent category ID (for subcategories)' })
  @Column({ nullable: true })
  parentId: number;

  @ApiProperty({ description: 'Creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Category, category => category.subcategories)
  @JoinColumn({ name: 'parentId' })
  parent: Category;

  @OneToMany(() => Category, category => category.parent)
  subcategories: Category[];

  @OneToMany(() => Topic, topic => topic.category)
  topics: Topic[];

  constructor(partial: Partial<Category>) {
    Object.assign(this, partial);
  }
} 