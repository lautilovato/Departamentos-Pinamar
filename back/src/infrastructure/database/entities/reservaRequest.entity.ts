import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class ReservaRequest {
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
  estado?: string; // pendiente, aprobada, rechazada

  @Property({ onCreate: () => new Date() })
  fechaSolicitud!: Date;

  @Property({ nullable: true })
  reservaId?: number; // ID de la reserva creada al aprobar
}