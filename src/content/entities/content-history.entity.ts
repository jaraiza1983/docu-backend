import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Content } from './content.entity';

export enum ContentAction {
  CREATED = 'created',
  UPDATED = 'updated',
  STATUS_CHANGED = 'status_changed',
  DELETED = 'deleted',
}

@Entity('content_history')
export class ContentHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    enum: ContentAction,
  })
  action: ContentAction;

  @Column({ type: 'text', nullable: true })
  previousData: string; // JSON string of previous state

  @Column({ type: 'text', nullable: true })
  newData: string; // JSON string of new state

  @Column({ type: 'text', nullable: true })
  changes: string; // JSON string describing what changed

  @Column({ type: 'text', nullable: true })
  notes: string; // Optional notes about the change

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Content, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'contentId' })
  content: Content;

  @Column()
  contentId: number;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;
} 