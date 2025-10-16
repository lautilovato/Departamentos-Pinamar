import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { MikroORM } from '@mikro-orm/core';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Departamento } from './infrastructure/database/entities/departamento.entity';
import { Reserva } from './infrastructure/database/entities/reserva.entity';
import { ReservasModule } from './modules/reservas/reservas.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MikroOrmModule.forRoot({
      driver: PostgreSqlDriver,
      // Preferir DATABASE_URL si está presente (Railway)
      clientUrl: process.env.DATABASE_URL,
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      user: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'root',
      dbName: process.env.DB_NAME || 'departamentos_pinamar',
      entities: [Departamento, Reserva],
      debug: true,
      allowGlobalContext: true, // Solo para desarrollo
      migrations: {
        path: join(__dirname, './infrastructure/database/migrations'),
        pathTs: join(process.cwd(), 'src/infrastructure/database/migrations'),
      },
    }),
    ReservasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly orm: MikroORM) {}

  async onModuleInit() {
    // Ejecutar migraciones automáticamente (omitir en tests)
    if (process.env.NODE_ENV !== 'test') {
      await this.orm.getMigrator().up();
    }
  }
}