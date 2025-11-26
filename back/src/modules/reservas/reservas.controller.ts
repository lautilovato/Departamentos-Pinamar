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
    BadRequestException,
    NotFoundException,
    Query,
} from '@nestjs/common';

import { ReservasService } from './reservas.service';
import { UpdateReservaDto } from './dto/updateReserva.dto';
import { CreateReservaDto } from './dto/createReserva.dto';

@Controller('reservas')
export class ReservasController {
    constructor(private reservasService: ReservasService) {}

    @Get(':id')
    async getReservaById(@Param('id', ParseIntPipe) id: number) {
        const reserva = await this.reservasService.findOne(id);
        if (!reserva) {
            throw new NotFoundException('Reserva no encontrada');
        }
        return reserva;
    }

    @Get()
    async getAllReservas(@Query('estado') estado?: string) {
        if (estado) {
            return await this.reservasService.findByEstado(estado);
        }
        const reservas = await this.reservasService.findAll();
        return reservas
    }

    @Post()
    create(@Body() createReservaDto: CreateReservaDto) {
        return this.reservasService.create(createReservaDto);
    }

    @Patch(':id')
    async updateReserva(@Param('id', ParseIntPipe) id: number, @Body() updateReservaDto: UpdateReservaDto) {
        return await this.reservasService.update(id, updateReservaDto);
    }

    @Patch(':id/confirmar')
    async confirmarReserva(@Param('id', ParseIntPipe) id: number) {
        return await this.reservasService.confirmarReserva(id);
    }

    @Patch(':id/rechazar')
    async rechazarReserva(@Param('id', ParseIntPipe) id: number) {
        return await this.reservasService.rechazarReserva(id);
    }

}