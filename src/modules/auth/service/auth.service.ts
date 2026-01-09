import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/services/user.service';
import { LoginDto } from '../dto/login.dto';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../dto/register.dto';
import { UserRole } from '../../../common/enums/user-role.enum';

@Injectable()
export class AuthService {
  constructor(
    // user data access
    private usersService: UsersService,

    // toke createion
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.create({
      ...registerDto,
      role: UserRole.TECHNICIAN,
    });

    return this.login({
      email: user.email,
      password: registerDto.password,
    });
  }

  async getProfile(userId: string) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };
  }
}
