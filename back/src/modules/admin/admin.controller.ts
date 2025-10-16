import { Controller, Get, Post, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.guard';
import { AdminGuard } from './admin.guard';
import { UserRepository } from '../auth/user.repository';
import { RegisterDto } from '../auth/dto/register.dto';
import { AuthService } from '../auth/auth.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
  ) {}

  @Get('users')
  async getAllUsers() {
    const users = await this.userRepository.findAll();
    // Remover passwords de la respuesta
    return users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  @Post('users')
  async createUser(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Delete('users/:id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    await this.userRepository.delete(id);
    return { message: 'Usuario eliminado correctamente' };
  }

  @Get('dashboard')
  async getDashboardStats() {
    const users = await this.userRepository.findAll();
    return {
      totalUsers: users.length,
      adminUsers: users.filter(user => user.role === 'admin').length,
      regularUsers: users.filter(user => user.role === 'user').length,
    };
  }
}