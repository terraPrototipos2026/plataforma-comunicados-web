import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { Comunicado } from '../../domain/entities/comunicado.entity.js';

export class ComunicadoResponseDto {
  @ApiProperty({ example: 'b5143f61-f93d-4728-8483-b4538cfd0100' })
  idComunicado: string;

  @ApiProperty({ example: 'COM-2026-089' })
  codigo: string;

  @ApiProperty({ example: 'ALERTA URGENTE: Protocolo de Seguridad' })
  titulo: string;

  @ApiPropertyOptional({ example: 'Extracto para notificaciones push' })
  extracto: string | null;

  @ApiProperty({ example: 'AVANZADO' })
  medioPublicacion: string;

  @ApiProperty({ example: 'URGENTE' })
  prioridad: string;

  @ApiProperty({ example: 'PUBLICADO' })
  estado: string;

  @ApiProperty({ example: 'TODA_EMPRESA' })
  tipoAlcance: string;

  @ApiPropertyOptional({ example: '2026-10-30T09:00:00.000Z' })
  fechaPublicacion: Date | null;

  @ApiPropertyOptional({ example: null })
  fechaProgramada: Date | null;

  @ApiProperty({ example: 'Andrea Muñoz L.' })
  autorNombre?: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/...' })
  portadaUrl: string | null;

  @ApiProperty({ example: 149 })
  totalDestinatarios: number;

  @ApiProperty({ example: 122 })
  totalConfirmados: number;

  @ApiProperty({ example: 82 })
  porcentajeLectura: number;

  @ApiProperty({ example: 1 })
  totalAdjuntosPdf: number;

  @ApiPropertyOptional()
  cuerpo?: {
    contenido: string;
    urlArchivo?: string | null;
    nombreArchivo?: string | null;
    tamanoBytes?: number | null;
    numeroPaginas?: number | null;
  } | null;

  @ApiPropertyOptional()
  imagenes?: {
    idImagen: string;
    urlImagen: string;
    nombreArchivo?: string | null;
    tamanoBytes?: number | null;
    esPortada: boolean;
    orden: number;
  }[];

  @ApiProperty()
  createdAt: Date;

  static fromDomain(c: Comunicado): ComunicadoResponseDto {
    const dto = new ComunicadoResponseDto();
    dto.idComunicado = c.idComunicado;
    dto.codigo = c.codigo;
    dto.titulo = c.titulo;
    dto.extracto = c.extracto;
    dto.medioPublicacion = c.medioPublicacion;
    dto.prioridad = c.prioridad;
    dto.estado = c.estado;
    dto.tipoAlcance = c.tipoAlcance;
    dto.fechaPublicacion = c.fechaPublicacion;
    dto.fechaProgramada = c.fechaProgramada;
    dto.autorNombre = c.autorNombre ?? 'Administrador TERRA';
    dto.portadaUrl = c.portadaUrl;
    dto.totalDestinatarios = c.totalDestinatarios;
    dto.totalConfirmados = c.totalConfirmados;
    dto.porcentajeLectura = c.porcentajeLectura;
    dto.totalAdjuntosPdf = c.cuerpo?.urlArchivo ? 1 : 0;
    dto.cuerpo = c.cuerpo;
    dto.imagenes = c.imagenes;
    dto.createdAt = c.createdAt;
    return dto;
  }
}

