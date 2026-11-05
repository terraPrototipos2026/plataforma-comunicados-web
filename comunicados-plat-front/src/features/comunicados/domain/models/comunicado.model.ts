export type ModalidadComunicado = 'EXPRESS' | 'AVANZADO';
export type PrioridadComunicado = 'NORMAL' | 'IMPORTANTE' | 'URGENTE';
export type EstadoComunicado = 'BORRADOR' | 'PROGRAMADO' | 'PUBLICADO' | 'ANULADO';
export type TipoAlcanceComunicado =
  | 'TODA_EMPRESA'
  | 'POR_SUCURSAL'
  | 'ENCARGADOS_AREA'
  | 'POR_DEPARTAMENTO'
  | 'NOMINATIVO';

export interface ImagenComunicado {
  idImagen?: string;
  urlImagen: string;
  nombreArchivo?: string | null;
  tamanoBytes?: number | null;
  esPortada: boolean;
  orden: number;
}

export interface CuerpoComunicado {
  idCuerpo?: string;
  contenido: string;
  urlArchivo?: string | null;
  nombreArchivo?: string | null;
  tamanoBytes?: number | null;
  numeroPaginas?: number | null;
}

export interface Comunicado {
  idComunicado: string;
  codigo: string;
  titulo: string;
  extracto: string | null;
  medioPublicacion: ModalidadComunicado;
  prioridad: PrioridadComunicado;
  estado: EstadoComunicado;
  tipoAlcance: TipoAlcanceComunicado;
  fechaPublicacion: Date | null;
  fechaProgramada: Date | null;
  autorNombre: string;
  portadaUrl: string | null;
  totalDestinatarios: number;
  totalConfirmados: number;
  porcentajeLectura: number;
  totalAdjuntosPdf: number;
  cuerpo?: CuerpoComunicado | null;
  imagenes?: ImagenComunicado[];
  createdAt: Date;
}

export const ComunicadoRules = {
  validarTitulo(titulo: string): boolean {
    const trimmed = titulo.trim();
    return trimmed.length >= 3 && trimmed.length <= 150;
  },

  getPrioridadBadgeStyles(prioridad: PrioridadComunicado): {
    bg: string;
    text: string;
    border: string;
  } {
    switch (prioridad) {
      case 'URGENTE':
        return {
          bg: 'bg-primario-claro',
          text: 'text-alerta font-extrabold',
          border: 'border-alerta/30',
        };
      case 'IMPORTANTE':
        return {
          bg: 'bg-[#fff7df]',
          text: 'text-[#b27600] font-extrabold',
          border: 'border-[#f0e0b8]',
        };
      case 'NORMAL':
      default:
        return {
          bg: 'bg-superficie-2',
          text: 'text-texto-suave font-bold',
          border: 'border-borde',
        };
    }
  },

  getEstadoBadgeStyles(estado: EstadoComunicado): {
    bg: string;
    text: string;
    border: string;
  } {
    switch (estado) {
      case 'PUBLICADO':
        return {
          bg: 'bg-[#e4f4e9]',
          text: 'text-exito font-extrabold',
          border: 'border-[#bfe3ca]',
        };
      case 'PROGRAMADO':
        return {
          bg: 'bg-[#e8f1fc]',
          text: 'text-[#2b6cb0] font-extrabold',
          border: 'border-[#bcd7f8]',
        };
      case 'BORRADOR':
        return {
          bg: 'bg-superficie-2',
          text: 'text-texto-suave font-bold',
          border: 'border-borde',
        };
      case 'ANULADO':
        return {
          bg: 'bg-primario-claro',
          text: 'text-alerta font-bold',
          border: 'border-alerta/20',
        };
      default:
        return {
          bg: 'bg-superficie-2',
          text: 'text-texto-suave',
          border: 'border-borde',
        };
    }
  },

  formatAlcanceLabel(tipo: TipoAlcanceComunicado): string {
    switch (tipo) {
      case 'TODA_EMPRESA':
        return 'Toda la Empresa';
      case 'POR_SUCURSAL':
        return 'Por Sucursal';
      case 'ENCARGADOS_AREA':
        return 'Encargados de Área';
      case 'POR_DEPARTAMENTO':
        return 'Por Departamento';
      case 'NOMINATIVO':
        return 'Nominativo';
      default:
        return 'Toda la Empresa';
    }
  },
};

