import { Migration } from '@mikro-orm/migrations';

export class Migration20251101124253 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`drop table if exists "reserva_request" cascade;`);

    this.addSql(`drop table if exists "user" cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table "reserva_request" ("id" serial primary key, "cliente" varchar(255) not null, "numero_tel" varchar(255) not null, "fecha_inicio" timestamptz(6) not null, "fecha_fin" timestamptz(6) not null, "departamento_id" int4 not null, "estado" varchar(255) null default 'pendiente', "fecha_solicitud" timestamptz(6) not null, "reserva_id" int4 null);`);

    this.addSql(`create table "user" ("id" serial primary key, "email" varchar(255) not null, "password" varchar(255) not null, "nombre" varchar(255) not null, "role" text check ("role" in ('admin', 'user')) not null, "created_at" timestamptz(6) not null);`);
    this.addSql(`alter table "user" add constraint "user_email_unique" unique ("email");`);
  }

}
