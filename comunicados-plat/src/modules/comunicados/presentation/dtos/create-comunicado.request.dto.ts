import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ImagenItemDto {
  @ApiProperty({ description: 'URL de la imagen o afiche', example: 'https://images.unsplash.com/...' })
  @IsString()
  @IsNotEmpty()
  urlImagen: string;

  @ApiPropertyOptional({ description: 'Nombre original del archivo', example: 'afiche.png' })
  @IsOptional()
  @IsString()
  nombreArchivo?: string;

  @ApiPropertyOptional({ description: 'Peso en bytes' })
  @IsOptional()
  tamanoBytes?: number;

  @ApiPropertyOptional({ description: 'Si es la portada del comunicado', default: false })
  @IsOptional()
  esPortada?: boolean;

  @ApiPropertyOptional({ description: 'Orden en la galería', default: 0 })
  @IsOptional()
  orden?: number;
}

export class CreateComunicadoRequestDto {
  @ApiProperty({ description: 'Título del comunicado', example: 'ALERTA URGENTE: Protocolo de Seguridad' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  titulo: string;

  @ApiPropertyOptional({ description: 'Extracto para notificaciones push en smartphones' })
  @IsOptional()
  @IsString()
  @MaxLength(280)
  extracto?: string;

  @ApiPropertyOptional({ description: 'Modalidad de emisión', enum: ['EXPRESS', 'AVANZADO'], default: 'AVANZADO' })
  @IsOptional()
  @IsEnum(['EXPRESS', 'AVANZADO'])
  medioPublicacion?: 'EXPRESS' | 'AVANZADO';

  @ApiPropertyOptional({ description: 'Nivel de prioridad', enum: ['NORMAL', 'IMPORTANTE', 'URGENTE'], default: 'NORMAL' })
  @IsOptional()
  @IsEnum(['NORMAL', 'IMPORTANTE', 'URGENTE'])
  prioridad?: 'NORMAL' | 'IMPORTANTE' | 'URGENTE';

  @ApiPropertyOptional({ description: 'Estado', enum: ['BORRADOR', 'PROGRAMADO', 'PUBLICADO'], default: 'PUBLICADO' })
  @IsOptional()
  @IsEnum(['BORRADOR', 'PROGRAMADO', 'PUBLICADO'])
  estado?: 'BORRADOR' | 'PROGRAMADO' | 'PUBLICADO';

  @ApiPropertyOptional({
    description: 'Tipo de alcance',
    enum: ['TODA_EMPRESA', 'POR_SUCURSAL', 'ENCARGADOS_AREA', 'POR_DEPARTAMENTO', 'NOMINATIVO'],
    default: 'TODA_EMPRESA',
  })
  @IsOptional()
  @IsEnum(['TODA_EMPRESA', 'POR_SUCURSAL', 'ENCARGADOS_AREA', 'POR_DEPARTAMENTO', 'NOMINATIVO'])
  tipoAlcance?: 'TODA_EMPRESA' | 'POR_SUCURSAL' | 'ENCARGADOS_AREA' | 'POR_DEPARTAMENTO' | 'NOMINATIVO';

  @ApiPropertyOptional({ description: 'Fecha programada ISO si el estado es PROGRAMADO' })
  @IsOptional()
  @IsString()
  fechaProgramada?: string;

  @ApiPropertyOptional({ description: 'Cuerpo en formato HTML enriquecido' })
  @IsOptional()
  @IsString()
  contenidoHtml?: string;

  @ApiPropertyOptional({ description: 'URL del archivo PDF oficial' })
  @IsOptional()
  @IsString()
  urlArchivoPdf?: string;

  @ApiPropertyOptional({ description: 'Nombre del archivo PDF' })
  @IsOptional()
  @IsString()
  nombreArchivoPdf?: string;

  @ApiPropertyOptional({ description: 'Peso del PDF en bytes' })
  @IsOptional()
  tamanoBytesPdf?: number;

  @ApiPropertyOptional({ description: 'Número de páginas del PDF' })
  @IsOptional()
  numeroPaginasPdf?: number;

  @ApiPropertyOptional({ description: 'Lista de imágenes institucionales', type: [ImagenItemDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImagenItemDto)
  imagenes?: ImagenItemDto[];

  @ApiPropertyOptional({ description: 'UUIDs de sucursales si el alcance es POR_SUCURSAL', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sucursalIds?: string[];

  @ApiPropertyOptional({ description: 'UUIDs de departamentos si el alcance es POR_DEPARTAMENTO', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  departamentoIds?: string[];

  @ApiPropertyOptional({ description: 'UUIDs de usuarios si el alcance es NOMINATIVO', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  destinatarioIds?: string[];

  @ApiPropertyOptional({ description: 'Rol emisor simulado para testing de permisos', example: 'administrador general' })
  @IsOptional()
  @IsString()
  rolSimulado?: string;
}

