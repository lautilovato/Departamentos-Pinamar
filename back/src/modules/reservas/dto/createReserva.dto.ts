import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateReservaDto {
  @IsNotEmpty()
  @IsNumber()
  departamentoId: number;

  @IsNotEmpty()
  @IsString()
  cliente: string;

  @IsNotEmpty()
  @IsString()
  numeroTel?: string;

  @IsNotEmpty()
  @IsDateString()
  fechaInicio: string;

  @IsNotEmpty()
  @IsDateString()
  fechaFin: string;
}