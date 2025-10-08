import { IsOptional, IsString, IsDateString, IsNumber, IsIn } from 'class-validator';

export class UpdateReservaDto {
  @IsOptional()
  @IsString()
  cliente?: string;

  @IsOptional()
  @IsString()
  numeroTel?: string;

  @IsOptional()
  @IsDateString()
  fechaInicio?: Date;

  @IsOptional()
  @IsDateString()
  fechaFin?: Date;

  @IsOptional()
  @IsNumber()
  departamentoId?: number;

  @IsOptional()
  @IsString()
  @IsIn(['pendiente', 'confirmada'])
  estado?: string;
}