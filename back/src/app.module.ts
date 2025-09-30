import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Departamento } from './entities/departamento.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MikroOrmModule.forRoot({
      driver: PostgreSqlDriver,
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      user: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'root',
      dbName: process.env.DB_NAME || 'departamentos_pinamar',
      entities: [Departamento],
      debug: true,
      allowGlobalContext: true, // Solo para desarrollo
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}