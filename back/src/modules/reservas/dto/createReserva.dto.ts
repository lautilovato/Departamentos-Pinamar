import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateReservaDto {
  @IsNotEmpty()
  @IsString()
  cliente: string;

  @IsNotEmpty()
  @IsString()
  numeroTel?: string;

  @IsNotEmpty()
  @IsString()
  numeroDepartamento: string;

  @IsNotEmpty()
  @IsDateString()
  fechaInicio: string;

  @IsNotEmpty()
  @IsDateString()
  fechaFin: string;
}