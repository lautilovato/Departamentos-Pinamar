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
} from '@nestjs/common';

import { ReservasRequestService } from './reservasRequest.service';
import { UpdateReservaRequestDto } from './dto/updateReservaRequest.dto';
import { CreateReservaRequestDto } from './dto/createReservaRequest.dto';

@Controller('reservas-request')
export class ReservasRequestController {
    constructor(private reservasRequestService: ReservasRequestService) {}

    @Get(':id')
    async getReservaById(@Param('id', ParseIntPipe) id: number) {
        const reserva = await this.reservasRequestService.findOne(id);
        if (!reserva) {
            throw new NotFoundException('Reserva no encontrada');
        }
        return reserva;
    }

    @Get()
    async getAllReservas() {
        const reservas = await this.reservasRequestService.findAll();
        return reservas
    }

    @Post()
    create(@Body() createReservaRequestDto: CreateReservaRequestDto) {
        return this.reservasRequestService.create(createReservaRequestDto);
    }

    @Patch(':id/aprobar')
    async aprobarSolicitud(@Param('id', ParseIntPipe) id: number) {
        return this.reservasRequestService.aprobar(id);
    }

    @Patch(':id/rechazar')
    async rechazarSolicitud(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: { motivoRechazo: string }
    ) {
        if (!body.motivoRechazo) {
            throw new BadRequestException('El motivo de rechazo es requerido');
        }
        return this.reservasRequestService.rechazar(id);
    }

    @Get('estado/:estado')
    async getSolicitudesPorEstado(@Param('estado') estado: string) {
        const estadosValidos = ['pendiente', 'aprobada', 'rechazada'];
        if (!estadosValidos.includes(estado)) {
            throw new BadRequestException('Estado no válido');
        }
        return this.reservasRequestService.findByEstado(estado);
    }

}