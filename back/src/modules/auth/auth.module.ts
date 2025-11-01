import { Global, Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { TokenService } from './services/token.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';

@Global()
@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService, TokenService, JwtService, AuthGuard],
  exports: [AuthService, TokenService, JwtService, AuthGuard],
})
export class AuthModule {}
