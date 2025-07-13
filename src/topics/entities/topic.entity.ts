import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';

@Entity('topics')
export class Topic {
  @ApiProperty({ description: 'Unique identifier for the topic' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Topic title' })
  @Column()
  title: string;

  @ApiProperty({ description: 'Topic body/content' })
  @Column('text')
  body: string;

  @ApiProperty({ description: 'Category ID' })
  @Column()
  categoryId: number;

  @ApiProperty({ description: 'Subcategory ID' })
  @Column({ nullable: true })
  subcategoryId: number;

  @ApiProperty({ description: 'User ID who created the topic' })
  @Column()
  createdById: number;

  @ApiProperty({ description: 'User ID who last updated the topic' })
  @Column({ nullable: true })
  updatedById: number;

  @ApiProperty({ description: 'Creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, user => user.topics)
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @ManyToOne(() => User, user => user.updatedTopics)
  @JoinColumn({ name: 'updatedById' })
  updatedBy: User;

  @ManyToOne(() => Category, category => category.topics)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @ManyToOne(() => Category, category => category.topics)
  @JoinColumn({ name: 'subcategoryId' })
  subcategory: Category;

  constructor(partial: Partial<Topic>) {
    Object.assign(this, partial);
  }
} 