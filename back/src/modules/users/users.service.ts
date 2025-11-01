import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UpdateUserDto } from './dto/updateUser.dto';
import { User } from '../../infrastructure/database/entities/User';
import { Transactional, wrap } from '@mikro-orm/core';
import { TransactionalMikroOrmClass } from '../../shared/decorators/transactional-mikro-orm.decorator';

@Injectable()
@TransactionalMikroOrmClass()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    wrap(user).assign(updateUserDto, { ignoreUndefined: true });

    await this.usersRepository.save(user);
    return user;
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.removeAndFlush(user);
  }
}