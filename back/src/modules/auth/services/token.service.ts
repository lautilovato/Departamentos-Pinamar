import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from '../../../infrastructure/database/entities/User.entity';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  async validateToken(token: string) {
    return await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET!,
    });
  }

  public async generateTokens(user: {
    id: number;
    email: string;
    role: UserRole;
    company?: { id: number };
    student?: { id: number };
  }) {
    const accessToken = await this.generateToken(user, false);
    const refreshToken = await this.generateToken(user, true);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async generateToken(
    user: {
      id: number;
      email: string;
      role: UserRole;
      company?: { id: number };
      student?: { id: number };
    },
    isRefreshToken: boolean,
  ) {
    const token = await this.jwtService.signAsync(user, {
      secret: process.env.JWT_SECRET,
      ...(process.env.NODE_ENV != 'prod'
        ? {}
        : { expiresIn: isRefreshToken ? '90d' : '15m' }),
    });

    return token;
  }
}
