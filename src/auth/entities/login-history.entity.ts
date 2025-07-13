import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

@Entity('login_history')
export class LoginHistory {
  @ApiProperty({ description: 'Unique identifier for the login record' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'User ID' })
  @Column()
  userId: number;

  @ApiProperty({ description: 'IP address of the login attempt' })
  @Column()
  ipAddress: string;

  @ApiProperty({ description: 'User agent string' })
  @Column()
  userAgent: string;

  @ApiProperty({ description: 'Whether the login was successful' })
  @Column()
  success: boolean;

  @ApiProperty({ description: 'Login timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, user => user.loginHistory)
  @JoinColumn({ name: 'userId' })
  user: User;

  constructor(partial: Partial<LoginHistory>) {
    Object.assign(this, partial);
  }
} 