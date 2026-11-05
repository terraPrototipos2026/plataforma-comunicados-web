import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateSucursalRequestDto {
  @ApiPropertyOptional({
    description: 'Nombre de la sucursal',
    example: 'Sucursal Calacoto',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nombre?: string;

  @ApiPropertyOptional({
    description: 'Dirección física de la sucursal',
    example: 'Calle 21 de Calacoto #1050',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  direccion?: string;
}
