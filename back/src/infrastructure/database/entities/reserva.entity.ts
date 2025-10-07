import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Reserva {
  @PrimaryKey()
  id!: number;

  @Property()
  cliente!: string;

  @Property()
  numeroTel!: string;

  @Property()
  fechaInicio!: Date;

  @Property()
  fechaFin!: Date;

  @Property()
  departamentoId!: number;

  @Property({ default: 'pendiente' })
  estado?: string; // pendiente, confirmada

}