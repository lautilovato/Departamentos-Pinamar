import { Migration } from '@mikro-orm/migrations';

export class Migration20251101162548 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create type "user_role" as enum ('ADMIN');`);
    this.addSql(`create table "departamento" ("id" serial primary key, "nombre" varchar(255) not null, "descripcion" varchar(255) not null, "precio" int not null, "disponible" boolean not null default true, "ubicacion" varchar(255) not null, "capacidad" int not null, "created_at" timestamptz not null, "updated_at" timestamptz not null);`);

    this.addSql(`create table "user" ("id" serial primary key, "created_at" timestamp(6) not null default now(), "updated_at" timestamp(6) null, "email" varchar(255) not null, "password" varchar(255) not null, "role" "user_role" not null);`);
    this.addSql(`alter table "user" add constraint "user_email_unique" unique ("email");`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "departamento" cascade;`);

    this.addSql(`drop table if exists "user" cascade;`);

    this.addSql(`drop type "user_role";`);
  }

}
