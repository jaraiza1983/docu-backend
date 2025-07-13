import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { LoginHistory } from './entities/login-history.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(LoginHistory)
    private loginHistoryRepository: Repository<LoginHistory>,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: [
        { username },
        { email: username },
      ],
    });

    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto, ipAddress: string, userAgent: string) {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    
    if (!user) {
      // Log failed login attempt
      await this.logLoginAttempt(loginDto.username, ipAddress, userAgent, false);
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      await this.logLoginAttempt(user.username, ipAddress, userAgent, false);
      throw new UnauthorizedException('Account is deactivated');
    }

    // Log successful login
    await this.logLoginAttempt(user.username, ipAddress, userAgent, true);

    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  private async logLoginAttempt(username: string, ipAddress: string, userAgent: string, success: boolean) {
    const user = await this.usersRepository.findOne({ where: { username } });
    if (user) {
      const loginHistory = this.loginHistoryRepository.create({
        userId: user.id,
        ipAddress,
        userAgent,
        success,
      });
      await this.loginHistoryRepository.save(loginHistory);
    }
  }

  async getLoginHistory(userId: number) {
    return this.loginHistoryRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 10,
    });
  }
} 