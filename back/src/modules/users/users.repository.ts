import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from "@nestjs/common";
import { User } from "../../infrastructure/database/entities/User.entity";
import { BaseMikroOrmRepository } from "../../shared/base/base.repository";

@Injectable()
export class UsersRepository extends BaseMikroOrmRepository<User> {
  
  constructor(em: EntityManager) {
    super(em, User);
  }

  async findByEmail(email: string) {
    return this.em.findOne(User, { email });
  }
}