export interface ComunicadoApiResponseDto {
  idComunicado: string;
  codigo: string;
  titulo: string;
  extracto: string | null;
  medioPublicacion: 'EXPRESS' | 'AVANZADO';
  prioridad: 'NORMAL' | 'IMPORTANTE' | 'URGENTE';
  estado: 'BORRADOR' | 'PROGRAMADO' | 'PUBLICADO' | 'ANULADO';
  tipoAlcance:
    | 'TODA_EMPRESA'
    | 'POR_SUCURSAL'
    | 'ENCARGADOS_AREA'
    | 'POR_DEPARTAMENTO'
    | 'NOMINATIVO';
  fechaPublicacion: string | null;
  fechaProgramada: string | null;
  autorNombre: string;
  portadaUrl: string | null;
  totalDestinatarios: number;
  totalConfirmados: number;
  porcentajeLectura: number;
  totalAdjuntosPdf: number;
  cuerpo?: {
    idCuerpo?: string;
    contenido: string;
    urlArchivo?: string | null;
    nombreArchivo?: string | null;
    tamanoBytes?: number | null;
    numeroPaginas?: number | null;
  } | null;
  imagenes?: {
    idImagen?: string;
    urlImagen: string;
    nombreArchivo?: string | null;
    tamanoBytes?: number | null;
    esPortada: boolean;
    orden: number;
  }[];
  createdAt: string;
}

export interface CreateComunicadoApiRequestDto {
  titulo: string;
  extracto?: string;
  medioPublicacion?: 'EXPRESS' | 'AVANZADO';
  prioridad?: 'NORMAL' | 'IMPORTANTE' | 'URGENTE';
  estado?: 'BORRADOR' | 'PROGRAMADO' | 'PUBLICADO' | 'ANULADO';
  tipoAlcance?: string;
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

export interface EstimarAlcanceApiResponseDto {
  totalColaboradores: number;
  totalSucursales: number;
  totalDepartamentos: number;
  autorizado: boolean;
  mensajePermiso: string;
}
