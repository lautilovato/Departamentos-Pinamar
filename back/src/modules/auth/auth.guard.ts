import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, TokenExpiredError, JsonWebTokenError } from '@nestjs/jwt';
import { UsersRepository } from '../users/users.repository';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly userRepository: UsersRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();

      const token = this.getTokenFromHeader(request.get('Authorization'));

      if (!token) {
        throw new ForbiddenException({
          message: 'No se encontró token de acceso',
          type: 'authentication_error',
        });
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET!,
      });

      if (!payload || !payload.id) {
        throw new ForbiddenException({
          message: 'No estas autenticado',
          type: 'authentication_error',
        });
      }

      await this.validateUserExists(payload.id);

      request['user'] = payload;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new ForbiddenException({
          message: 'Token de acceso expirado',
          type: 'authentication_error',
        });
      }

      if (error instanceof JsonWebTokenError) {
        throw new ForbiddenException({
          message: 'Token de acceso erroneo',
          type: 'authentication_error',
        });
      }

      throw error;
    }
    return true;
  }

  async validateUserExists(userId: number) {
    const user = await this.userRepository.findOne({
      id: userId,
    });

    if (!user) {
      throw new UnauthorizedException({
        message: 'No estas autorizado',
        type: 'authentication_error',
      });
    }
  }

  getTokenFromHeader(header: string) {
    if (!header) {
      throw new ForbiddenException({
        message: 'No estas autenticado',
        type: 'authentication_error',
      });
    }

    const token = header.replace('Bearer ', '');

    return token;
  }
}
