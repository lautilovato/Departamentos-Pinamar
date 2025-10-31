import { Module } from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { ReservasController } from './reservas.controller';
import { ReservasRepository } from './reservas.repository';

@Module({
  controllers: [ReservasController],
  providers: [ReservasService, ReservasRepository],
  exports: [ReservasService, ReservasRepository],
})
export class ReservasModule {}