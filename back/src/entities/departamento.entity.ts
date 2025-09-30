import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Departamento {
  @PrimaryKey()
  id!: number;

  @Property()
  nombre!: string;

  @Property()
  descripcion!: string;

  @Property()
  precio!: number;

  @Property()
  disponible: boolean = true;

  @Property()
  ubicacion!: string;

  @Property()
  capacidad!: number;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}