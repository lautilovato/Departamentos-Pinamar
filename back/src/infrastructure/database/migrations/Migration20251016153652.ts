import { Migration } from '@mikro-orm/migrations';

export class Migration20251016153652 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "user" ("id" serial primary key, "email" varchar(255) not null, "password" varchar(255) not null, "nombre" varchar(255) not null, "role" text check ("role" in ('admin', 'user')) not null, "created_at" timestamptz not null);`);
    this.addSql(`alter table "user" add constraint "user_email_unique" unique ("email");`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "user" cascade;`);
  }

}
