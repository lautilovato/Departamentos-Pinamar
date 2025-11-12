import { Injectable, NotFoundException } from "@nestjs/common";
import { TransactionalMikroOrmClass } from "../../shared/decorators/transactional-mikro-orm.decorator";
import { ReservasRepository } from "./reservas.repository";
import { UpdateReservaDto } from './dto/updateReserva.dto';
import { CreateReservaDto } from './dto/createReserva.dto';
import { wrap } from '@mikro-orm/core';
import { Reserva } from '../../infrastructure/database/entities/reserva.entity';

@Injectable()
@TransactionalMikroOrmClass()
export class ReservasService {
    constructor(
      private reservasRepository: ReservasRepository,
    ) { }

    async findOne(id: number) {
        return this.reservasRepository.findOne(id);
    }
 
    async findAll() {
        return this.reservasRepository.findAll();
    }

    async create(createReservaDto: CreateReservaDto): Promise<Reserva> {
        const reservaData = {
            ...createReservaDto,
            fechaInicio: new Date(createReservaDto.fechaInicio),
            fechaFin: new Date(createReservaDto.fechaFin)
        };
        const reserva = this.reservasRepository.create(reservaData);
        await this.reservasRepository.save(reserva);
        return reserva;
    }

    async update(reservaId: number, updatedStudent: UpdateReservaDto) {
        const reserva = await this.reservasRepository.findOne({ id: reservaId });
        if (!reserva) {
          throw new NotFoundException('Reserva no encontrada');
        }
        wrap(reserva).assign(updatedStudent, { ignoreUndefined: true });
        await this.reservasRepository.save(reserva);
        return reserva;
    }

    async confirmarReserva(id: number): Promise<Reserva> {
        const reserva = await this.reservasRepository.findOne({ id });
        if (!reserva) {
            throw new NotFoundException('Reserva no encontrada');
        }
        reserva.estado = 'confirmada';
        await this.reservasRepository.save(reserva);
        return reserva;
    }

    async rechazarReserva(id: number): Promise<Reserva> {
        const reserva = await this.reservasRepository.findOne({ id });
        if (!reserva) {
            throw new NotFoundException('Reserva no encontrada');
        }
        reserva.estado = 'rechazada';
        await this.reservasRepository.save(reserva);
        return reserva;
    }

    async findByEstado(estado: string): Promise<Reserva[]> {
        return this.reservasRepository.find({ estado });
    }

}