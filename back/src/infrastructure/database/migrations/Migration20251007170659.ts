import { Migration } from '@mikro-orm/migrations';

export class Migration20251007170659 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "departamento" ("id" serial primary key, "nombre" varchar(255) not null, "descripcion" varchar(255) not null, "precio" int not null, "disponible" boolean not null default true, "ubicacion" varchar(255) not null, "capacidad" int not null, "created_at" timestamptz not null, "updated_at" timestamptz not null);`);

    this.addSql(`create table "reserva" ("id" serial primary key, "cliente" varchar(255) not null, "numero_tel" varchar(255) not null, "fecha_inicio" timestamptz not null, "fecha_fin" timestamptz not null, "departamento_id" int not null, "estado" varchar(255) null default 'pendiente');`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "departamento" cascade;`);

    this.addSql(`drop table if exists "reserva" cascade;`);
  }

}
