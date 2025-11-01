import { Global, Module } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Global()
@Module({
  imports: [],
  controllers: [UsersController],
  providers: [
    UsersRepository,
    UsersService,
  ],
  exports: [UsersRepository],
})
export class UsersModule {}