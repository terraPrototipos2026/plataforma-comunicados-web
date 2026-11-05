import type {
  Comunicado as PrismaComunicado,
  Cuerpo as PrismaCuerpo,
  Imagenes as PrismaImagenes,
  Usuario as PrismaUsuario,
  ComunicadoDestinatario as PrismaDestinatario,
} from '@prisma/client';
import { Comunicado } from '../../../domain/entities/comunicado.entity.js';

export type PrismaComunicadoFull = PrismaComunicado & {
  autor?: PrismaUsuario;
  cuerpo?: PrismaCuerpo | null;
  imagenes?: PrismaImagenes[];
  destinatarios?: PrismaDestinatario[];
  _count?: {
    destinatarios?: number;
  };
};

export class ComunicadoMapper {
  public static toDomain(raw: PrismaComunicadoFull): Comunicado {
    const totalDestinatarios = raw._count?.destinatarios ?? raw.destinatarios?.length ?? 0;
    const totalConfirmados = raw.destinatarios
      ? raw.destinatarios.filter((d) => d.estadoLectura === 'CONFIRMADO').length
      : 0;

    return Comunicado.reconstitute({
      idComunicado: raw.idComunicado,
      codigo: raw.codigo,
      titulo: raw.titulo,
      extracto: raw.extracto,
      medioPublicacion: raw.medioPublicacion,
      prioridad: raw.prioridad,
      estado: raw.estado,
      tipoAlcance: raw.tipoAlcance,
      fechaPublicacion: raw.fechaPublicacion,
      fechaProgramada: raw.fechaProgramada,
      idUsuario: raw.idUsuario,
      autorNombre: raw.autor?.nombre,
      cuerpo: raw.cuerpo
        ? {
            idCuerpo: raw.cuerpo.idCuerpo,
            contenido: raw.cuerpo.contenido,
            urlArchivo: raw.cuerpo.urlArchivo,
            nombreArchivo: raw.cuerpo.nombreArchivo,
            tamanoBytes: raw.cuerpo.tamanoBytes,
            numeroPaginas: raw.cuerpo.numeroPaginas,
          }
        : null,
      imagenes: raw.imagenes
        ? raw.imagenes.map((img) => ({
            idImagen: img.idImagen,
            urlImagen: img.urlImagen,
            nombreArchivo: img.nombreArchivo,
            tamanoBytes: img.tamanoBytes,
            esPortada: img.esPortada,
            orden: img.orden,
          }))
        : [],
      totalDestinatarios,
      totalConfirmados,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}

