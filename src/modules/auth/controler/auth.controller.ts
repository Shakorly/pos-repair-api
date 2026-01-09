import { Body, Controller, Post, HttpCode, HttpStatus, UseGuards, Req, Get } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { LoginDto, RegisterDto } from '../dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

   @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard) 
    async getMe(@Req() req) {
      return this.authService.getProfile(req.user.userid)
    }
  
}