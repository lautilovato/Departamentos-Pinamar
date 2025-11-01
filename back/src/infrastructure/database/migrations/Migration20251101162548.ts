import { Migration } from '@mikro-orm/migrations';

export class Migration20251101162548 extends Migration {

  override async up(): Promise<void> {
    // Eliminar la tabla departamento si existe (ya no se usa)
    this.addSql(`drop table if exists "departamento" cascade;`);

    // Verificar si el tipo enum user_role existe antes de crearlo
    this.addSql(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
          CREATE TYPE "user_role" AS ENUM ('ADMIN');
        END IF;
      END $$;
    `);

    // Crear tabla user solo si no existe
    this.addSql(`
      CREATE TABLE IF NOT EXISTS "user" (
        "id" serial primary key, 
        "created_at" timestamp(6) not null default now(), 
        "updated_at" timestamp(6) null, 
        "email" varchar(255) not null, 
        "password" varchar(255) not null, 
        "role" "user_role" not null
      );
    `);
    
    // Agregar constraint de email único solo si no existe
    this.addSql(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'user_email_unique'
        ) THEN
          ALTER TABLE "user" ADD CONSTRAINT "user_email_unique" UNIQUE ("email");
        END IF;
      END $$;
    `);
  }

  override async down(): Promise<void> {
    // En el rollback, recrear la tabla departamento
    this.addSql(`create table "departamento" ("id" serial primary key, "nombre" varchar(255) not null, "descripcion" varchar(255) not null, "precio" int not null, "disponible" boolean not null default true, "ubicacion" varchar(255) not null, "capacidad" int not null, "created_at" timestamptz not null, "updated_at" timestamptz not null);`);

    this.addSql(`drop table if exists "user" cascade;`);

    this.addSql(`drop type if exists "user_role";`);
  }

}
