import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FilterComunicadosQueryDto {
  @ApiPropertyOptional({ description: 'Búsqueda por código, título o autor' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filtrar por estado (PUBLICADO, BORRADOR, PROGRAMADO, ANULADO)' })
  @IsOptional()
  @IsString()
  estado?: string;

  @ApiPropertyOptional({ description: 'Filtrar por prioridad (NORMAL, IMPORTANTE, URGENTE)' })
  @IsOptional()
  @IsString()
  prioridad?: string;

  @ApiPropertyOptional({ description: 'Filtrar por UUID de sucursal' })
  @IsOptional()
  @IsString()
  idSucursal?: string;
}

