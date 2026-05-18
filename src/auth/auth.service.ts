import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

const SALT_ROUNDS = 12;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const { password, ...rest } = dto;
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await this.usersService.create({ ...rest, password: hashedPassword });
    return { user, token: this.sign(user.id, user.email) };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmailOrUsername(dto.identifier);

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return { user, token: this.sign(user.id, user.email) };
  }

  private sign(userId: string, email: string): string {
    return this.jwtService.sign({ sub: userId, email });
  }
}
