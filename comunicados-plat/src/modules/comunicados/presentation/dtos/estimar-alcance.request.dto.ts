import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EstimarAlcanceRequestDto {
  @ApiProperty({
    description: 'Tipo de alcance',
    example: 'TODA_EMPRESA',
    enum: ['TODA_EMPRESA', 'POR_SUCURSAL', 'ENCARGADOS_AREA', 'POR_DEPARTAMENTO', 'NOMINATIVO'],
  })
  @IsString()
  @IsNotEmpty()
  tipoAlcance: string;

  @ApiPropertyOptional({ description: 'IDs de sucursales seleccionadas', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sucursalIds?: string[];

  @ApiPropertyOptional({ description: 'IDs de departamentos seleccionados', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  departamentoIds?: string[];

  @ApiPropertyOptional({ description: 'IDs de usuarios seleccionados', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  usuarioIds?: string[];

  @ApiPropertyOptional({ description: 'Rol emisor simulado', example: 'gerente sucursal' })
  @IsOptional()
  @IsString()
  rolSimulado?: string;
}

