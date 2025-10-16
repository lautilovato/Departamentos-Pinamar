import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AdminController } from '../admin/admin.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserRepository } from './user.repository';
import { User } from '../../infrastructure/database/entities/user.entity';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretkey',
      signOptions: { expiresIn: '24h' },
    }),
    MikroOrmModule.forFeature([User]),
  ],
  providers: [AuthService, JwtStrategy, UserRepository],
  controllers: [AuthController, AdminController],
  exports: [AuthService, UserRepository],
})
export class AuthModule {}