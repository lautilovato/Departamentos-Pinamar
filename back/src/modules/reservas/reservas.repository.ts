import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from "@nestjs/common";
import { Reserva } from '../../infrastructure/database/entities/reserva.entity';
import { BaseMikroOrmRepository } from "../../shared/base/base.repository";

@Injectable()
export class ReservasRepository extends BaseMikroOrmRepository<Reserva> {

  constructor(em: EntityManager) {
    super(em, Reserva);
  }

}