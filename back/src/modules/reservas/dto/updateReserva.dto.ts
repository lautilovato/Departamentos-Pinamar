import { IsOptional, IsString, IsDateString, IsIn } from 'class-validator';

export class UpdateReservaDto {
  @IsOptional()
  @IsString()
  cliente?: string;

  @IsOptional()
  @IsString()
  numeroTel?: string;

  @IsOptional()
  @IsString()
  numeroDepartamento?: string;

  @IsOptional()
  @IsDateString()
  fechaInicio?: Date;

  @IsOptional()
  @IsDateString()
  fechaFin?: Date;

  @IsOptional()
  @IsString()
  @IsIn(['pendiente', 'confirmada'])
  estado?: string;
}