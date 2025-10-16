import { Migration } from '@mikro-orm/migrations';

export class Migration20251016151815 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "reserva_request" ("id" serial primary key, "cliente" varchar(255) not null, "numero_tel" varchar(255) not null, "fecha_inicio" timestamptz not null, "fecha_fin" timestamptz not null, "departamento_id" int not null, "estado" varchar(255) null default 'pendiente', "fecha_solicitud" timestamptz not null, "reserva_id" int null);`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "reserva_request" cascade;`);
  }

}
