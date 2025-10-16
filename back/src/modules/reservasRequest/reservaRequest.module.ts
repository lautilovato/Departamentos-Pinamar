import { Module } from '@nestjs/common';
import { ReservasRequestService } from './reservasRequest.service';
import { ReservasRequestController } from './reservasRequest.controller';
import { ReservasRequestRepository } from './reservasRequest.repository';

@Module({
  controllers: [ReservasRequestController],
  providers: [ReservasRequestService, ReservasRequestRepository],
  exports: [ReservasRequestService],
})
export class ReservaRequestModule {}