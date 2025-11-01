import { Migration } from '@mikro-orm/migrations';

export class Migration20251101173010 extends Migration {

  override async up(): Promise<void> {
    // Eliminar columna departamento_id si existe
    this.addSql(`
      DO $$ BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'reserva' AND column_name = 'departamento_id'
        ) THEN
          ALTER TABLE "reserva" DROP COLUMN "departamento_id";
        END IF;
      END $$;
    `);

    // Agregar columna numero_departamento solo si no existe
    this.addSql(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'reserva' AND column_name = 'numero_departamento'
        ) THEN
          ALTER TABLE "reserva" ADD COLUMN "numero_departamento" varchar(255);
        END IF;
      END $$;
    `);
    
    // Actualizar registros existentes que tengan numero_departamento null
    this.addSql(`UPDATE "reserva" SET "numero_departamento" = 'ATL001' WHERE "numero_departamento" IS NULL;`);
    
    // Cambiar la columna a NOT NULL solo si no lo es ya
    this.addSql(`
      DO $$ BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'reserva' AND column_name = 'numero_departamento' AND is_nullable = 'YES'
        ) THEN
          ALTER TABLE "reserva" ALTER COLUMN "numero_departamento" SET NOT NULL;
        END IF;
      END $$;
    `);
  }

  override async down(): Promise<void> {
    this.addSql(`create table "departamento" ("id" serial primary key, "nombre" varchar(255) not null, "descripcion" varchar(255) not null, "precio" int not null, "disponible" boolean not null default true, "ubicacion" varchar(255) not null, "capacidad" int not null, "created_at" timestamptz not null, "updated_at" timestamptz not null);`);

    this.addSql(`alter table "reserva" drop column "numero_departamento";`);

    this.addSql(`alter table "reserva" add column "departamento_id" int not null;`);
  }

}
