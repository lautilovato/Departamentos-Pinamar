import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { MikroORM } from '@mikro-orm/core';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Reserva } from './infrastructure/database/entities/reserva.entity';
import { User } from './infrastructure/database/entities/User.entity';
import { ReservasModule } from './modules/reservas/reservas.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const clientUrl = config.get<string>('DATABASE_URL');
        const base = {
          driver: PostgreSqlDriver,
          entities: [Reserva, User],
          debug: true,
          allowGlobalContext: true,
          migrations: {
            path: join(__dirname, './infrastructure/database/migrations'),
            pathTs: join(process.cwd(), 'src/infrastructure/database/migrations'),
          },
        };

        if (clientUrl) {
          return { ...base, clientUrl };
        }

        return {
          ...base,
          host: config.get('DB_HOST', 'localhost'),
          port: parseInt(config.get('DB_PORT', '5432'), 10),
          user: config.get('DB_USERNAME', 'postgres'),
          password: config.get('DB_PASSWORD', 'root'),
          dbName: config.get('DB_NAME', 'departamentos_pinamar'),
        };
      },
    }),
    ReservasModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly orm: MikroORM) {}

  async onModuleInit() {
    if (process.env.NODE_ENV !== 'test') {
      await this.orm.getMigrator().up();
    }
  }
}