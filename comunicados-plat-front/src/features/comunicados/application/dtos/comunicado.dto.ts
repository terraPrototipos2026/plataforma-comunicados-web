import type {
  EstadoComunicado,
  PrioridadComunicado,
  TipoAlcanceComunicado,
} from '../../domain/models/comunicado.model';

export interface CreateComunicadoInput {
  titulo: string;
  extracto?: string;
  medioPublicacion?: 'EXPRESS' | 'AVANZADO';
  prioridad?: PrioridadComunicado;
  estado?: EstadoComunicado;
  tipoAlcance?: TipoAlcanceComunicado;
  fechaProgramada?: string;
  contenidoHtml?: string;
  urlArchivoPdf?: string;
  nombreArchivoPdf?: string;
  tamanoBytesPdf?: number;
  numeroPaginasPdf?: number;
  imagenes?: {
    urlImagen: string;
    nombreArchivo?: string;
    tamanoBytes?: number;
    esPortada?: boolean;
    orden?: number;
  }[];
  sucursalIds?: string[];
  departamentoIds?: string[];
  destinatarioIds?: string[];
  rolSimulado?: string;
}

