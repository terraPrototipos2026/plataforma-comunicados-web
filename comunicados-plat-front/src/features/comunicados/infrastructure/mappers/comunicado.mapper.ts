import type { Comunicado } from '../../domain/models/comunicado.model';
import type { CreateComunicadoParams } from '../../domain/ports/comunicado.repository';
import type {
  ComunicadoApiResponseDto,
  CreateComunicadoApiRequestDto,
} from '../dtos/comunicado-api.dto';

export class ComunicadoMapper {
  static toDomain(dto: ComunicadoApiResponseDto): Comunicado {
    return {
      idComunicado: dto.idComunicado,
      codigo: dto.codigo,
      titulo: dto.titulo,
      extracto: dto.extracto,
      medioPublicacion: dto.medioPublicacion,
      prioridad: dto.prioridad,
      estado: dto.estado,
      tipoAlcance: dto.tipoAlcance,
      fechaPublicacion: dto.fechaPublicacion ? new Date(dto.fechaPublicacion) : null,
      fechaProgramada: dto.fechaProgramada ? new Date(dto.fechaProgramada) : null,
      autorNombre: dto.autorNombre,
      portadaUrl: dto.portadaUrl,
      totalDestinatarios: dto.totalDestinatarios,
      totalConfirmados: dto.totalConfirmados,
      porcentajeLectura: dto.porcentajeLectura,
      totalAdjuntosPdf: dto.totalAdjuntosPdf,
      cuerpo: dto.cuerpo,
      imagenes: dto.imagenes,
      createdAt: new Date(dto.createdAt),
    };
  }

  static toCreateApiRequest(params: CreateComunicadoParams): CreateComunicadoApiRequestDto {
    return {
      titulo: params.titulo,
      extracto: params.extracto,
      medioPublicacion: params.medioPublicacion,
      prioridad: params.prioridad,
      estado: params.estado,
      tipoAlcance: params.tipoAlcance,
      fechaProgramada: params.fechaProgramada,
      contenidoHtml: params.contenidoHtml,
      urlArchivoPdf: params.urlArchivoPdf,
      nombreArchivoPdf: params.nombreArchivoPdf,
      tamanoBytesPdf: params.tamanoBytesPdf,
      numeroPaginasPdf: params.numeroPaginasPdf,
      imagenes: params.imagenes,
      sucursalIds: params.sucursalIds,
      departamentoIds: params.departamentoIds,
      destinatarioIds: params.destinatarioIds,
      rolSimulado: params.rolSimulado,
    };
  }
}

