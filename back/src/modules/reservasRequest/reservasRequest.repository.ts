import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from "@nestjs/common";
import { ReservaRequest } from '../../infrastructure/database/entities/reservaRequest.entity';
import { BaseMikroOrmRepository } from "../../shared/base/base.repository";

@Injectable()
export class ReservasRequestRepository extends BaseMikroOrmRepository<ReservaRequest> {

  constructor(em: EntityManager) {
    super(em, ReservaRequest);
  }

  async findByEstado(estado: string): Promise<ReservaRequest[]> {
    return this.find({ estado });
  }

}