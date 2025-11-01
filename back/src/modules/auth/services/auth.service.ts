import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TransactionalMikroOrmClass } from '../../../shared/decorators/transactional-mikro-orm.decorator';
import { UsersRepository } from '../../users/users.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { TokenService } from './token.service';
import { LoginDto } from '../dto/login.dto';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';
import { EntityManager } from '@mikro-orm/core';

@Injectable()
@TransactionalMikroOrmClass()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private tokenService: TokenService,
    private em: EntityManager,
  ) {}

  async refreshAccessToken(refreshToken: string) {
    try {
      const payload = await this.tokenService.validateToken(refreshToken);

      if (!payload || !payload.id) {
        throw new ForbiddenException({
          message: 'No estas autenticado',
          type: 'authentication_error',
        });
      }

      const user = await this.usersRepository.findOne({
        id: payload.id,
      });

      if (!user) {
        throw new BadRequestException('Email o contraseña incorrectos');
      }

      const { accessToken } = await this.tokenService.generateTokens({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      return accessToken;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException(
          'Token de actualización expirado',
          'authentication_error',
        );
      }

      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException({
          message: 'Token de actualización erroneo',
          type: 'authentication_error',
        });
      }

      throw error;
    }
  }

  async login(login: LoginDto) {
    const user = await this.usersRepository.findByEmail(login.email);

    if (!user) {
      throw new BadRequestException('Email o contraseña incorrectos');
    }

    await user.validatePassword(login.password);

    user.validateCorrectRole(login.role);

    return this.tokenService.generateTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    });
  }

  async register(createUserDto: CreateUserDto): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const userFound = await this.usersRepository.findByEmail(
      createUserDto.email,
    );

    if (userFound) {
      throw new BadRequestException('Usuario ya registrado');
    }

    const user = this.usersRepository.create(createUserDto);
    await user.hashPassword();
    await this.usersRepository.save(user);

    return this.tokenService.generateTokens({
      id: user.id,
      email: user.email,
      role: user.role
    });
  }
}
