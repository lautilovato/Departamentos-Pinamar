import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh_token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() createUserDto: CreateUserDto) {
    const tokens = await this.authService.register(createUserDto);
    return tokens;
  }

  @Post('/login')
  async login(@Body() login: LoginDto) {
    const tokens = await this.authService.login(login);
    return tokens;
  }

  @Post('tokens/refresh')
  async refreshAcessToken(@Body() token: RefreshTokenDto) {
    const accessToken = await this.authService.refreshAccessToken(
      token.refreshToken,
    );

    return {
      accessToken,
    };
  }
}
