import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Req,
    UseGuards,
  } from '@nestjs/common';
  import { UsersService } from './users.service';
  import { UpdateUserDto } from './dto/updateUser.dto';
  import { Request } from 'express';
  import { RequestWithUser } from '../../shared/types/global.types';
  import { AuthGuard } from '../auth/auth.guard';
  
  @Controller('users')
  export class UsersController {
    constructor(private readonly usersService: UsersService) {}
  
    @Get()
    async getAllUsers() {
      const users = await this.usersService.findAll();
      return users;
    }
  
    @Get('me')
    @UseGuards(AuthGuard)
    async getCurrentUser(@Req() req: RequestWithUser) {
      const user = await this.usersService.findOne(req.user.id);
      return user;
    }
  
    @Get(':id')
    async getUserById(@Param('id', ParseIntPipe) id: number) {
      const user = await this.usersService.findOne(id);
      return user;
    }
  
    @Delete(':id')
    @UseGuards(AuthGuard)
    async deleteUser(@Param('id', ParseIntPipe) id: number) {
      await this.usersService.remove(id);
      return { message: 'Usuario eliminado correctamente' };
    }
  }