import { Injectable, NotFoundException } from "@nestjs/common";
import { TransactionalMikroOrmClass } from "../../shared/decorators/transactional-mikro-orm.decorator";
import { ReservasRequestRepository } from "./reservasRequest.repository";
import { ReservasRepository } from "../reservas/reservas.repository";
import { UpdateReservaRequestDto } from './dto/updateReservaRequest.dto';
import { CreateReservaRequestDto } from './dto/createReservaRequest.dto';
import { wrap } from '@mikro-orm/core';
import { ReservaRequest } from '../../infrastructure/database/entities/reservaRequest.entity';
import { Reserva } from '../../infrastructure/database/entities/reserva.entity';


@Injectable()
@TransactionalMikroOrmClass()
export class ReservasRequestService {
    constructor(
      private reservasRequestRepository: ReservasRequestRepository,
      private reservasRepository: ReservasRepository,
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
        const reservaRequest = await this.reservasRequestRepository.findOne({ id: reservaId });
        if (!reservaRequest) {
          throw new NotFoundException('Solicitud de reserva no encontrada');
        }

        // Crear la reserva confirmada con los datos de la solicitud
        const nuevaReserva = this.reservasRepository.create({
            cliente: reservaRequest.cliente,
            numeroTel: reservaRequest.numeroTel,
            fechaInicio: reservaRequest.fechaInicio,
            fechaFin: reservaRequest.fechaFin,
            departamentoId: reservaRequest.departamentoId,
        });

        // Guardar la nueva reserva
        await this.reservasRepository.save(nuevaReserva);

        // Actualizar el estado de la solicitud y vincular con la reserva creada
        reservaRequest.estado = 'aprobada';
        reservaRequest.reservaId = nuevaReserva.id;
        await this.reservasRequestRepository.save(reservaRequest);

        return {
            solicitud: reservaRequest,
            reservaCreada: nuevaReserva
        };
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