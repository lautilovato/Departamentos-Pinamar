import { Module } from '@nestjs/common';
import { ReservasRequestService } from './reservasRequest.service';
import { ReservasRequestController } from './reservasRequest.controller';
import { ReservasRequestRepository } from './reservasRequest.repository';
import { ReservasModule } from '../reservas/reservas.module';

@Module({
  imports: [ReservasModule],
  controllers: [ReservasRequestController],
  providers: [ReservasRequestService, ReservasRequestRepository],
  exports: [ReservasRequestService],
})
export class ReservaRequestModule {}