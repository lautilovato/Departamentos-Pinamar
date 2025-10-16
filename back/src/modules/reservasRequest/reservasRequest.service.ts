import { Injectable, NotFoundException } from "@nestjs/common";
import { TransactionalMikroOrmClass } from "../../shared/decorators/transactional-mikro-orm.decorator";
import { ReservasRequestRepository } from "./reservasRequest.repository";
import { UpdateReservaRequestDto } from './dto/updateReservaRequest.dto';
import { CreateReservaRequestDto } from './dto/createReservaRequest.dto';
import { wrap } from '@mikro-orm/core';
import { ReservaRequest } from '../../infrastructure/database/entities/reservaRequest.entity';

@Injectable()
@TransactionalMikroOrmClass()
export class ReservasRequestService {
    constructor(
      private reservasRequestRepository: ReservasRequestRepository,
    ) { }

    async findOne(id: number) {
        return this.reservasRequestRepository.findOne(id);
    }
 
    async findAll() {
        return this.reservasRequestRepository.findAll();
    }

    async create(createReservaRequestDto: CreateReservaRequestDto): Promise<ReservaRequest> {
        const reservaData = {
            ...createReservaRequestDto,
            fechaInicio: new Date(createReservaRequestDto.fechaInicio),
            fechaFin: new Date(createReservaRequestDto.fechaFin),
            estado: 'pendiente' // Asegurar que tenga estado inicial
        };
        const reserva = this.reservasRequestRepository.create(reservaData);
        await this.reservasRequestRepository.save(reserva);
        return reserva;
    }

    async update(reservaId: number, updateReservaRequest: UpdateReservaRequestDto) {
        const reserva = await this.reservasRequestRepository.findOne({ id: reservaId });
        if (!reserva) {
          throw new NotFoundException('Reserva no encontrada');
        }
        wrap(reserva).assign(updateReservaRequest, { ignoreUndefined: true });
        await this.reservasRequestRepository.save(reserva);
        return reserva;
    }

    async aprobar(reservaId: number) {
        const reserva = await this.reservasRequestRepository.findOne({ id: reservaId });
        if (!reserva) {
          throw new NotFoundException('Reserva no encontrada');
        }
        reserva.estado = 'aprobada';
        await this.reservasRequestRepository.save(reserva);
        return reserva;
    }

    async rechazar(reservaId: number) {
        const reserva = await this.reservasRequestRepository.findOne({ id: reservaId });
        if (!reserva) {
          throw new NotFoundException('Reserva no encontrada');
        }
        reserva.estado = 'rechazada';
        await this.reservasRequestRepository.save(reserva);
        return reserva;
    }

    async findByEstado(estado: string) {
        return this.reservasRequestRepository.findByEstado(estado);
    }
    
}