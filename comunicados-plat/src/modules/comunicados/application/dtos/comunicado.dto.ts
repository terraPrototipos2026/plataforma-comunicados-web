export interface CreateComunicadoInput {
  titulo: string;
  extracto?: string;
  medioPublicacion?: 'EXPRESS' | 'AVANZADO';
  prioridad?: 'NORMAL' | 'IMPORTANTE' | 'URGENTE';
  estado?: 'BORRADOR' | 'PROGRAMADO' | 'PUBLICADO';
  tipoAlcance?: 'TODA_EMPRESA' | 'POR_SUCURSAL' | 'ENCARGADOS_AREA' | 'POR_DEPARTAMENTO' | 'NOMINATIVO';
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
  idAutor: string;
  rolEmisor?: string;
}

export interface EstimarAlcanceInput {
  tipoAlcance: string;
  sucursalIds?: string[];
  departamentoIds?: string[];
  usuarioIds?: string[];
  rolSimulado?: string;
}

