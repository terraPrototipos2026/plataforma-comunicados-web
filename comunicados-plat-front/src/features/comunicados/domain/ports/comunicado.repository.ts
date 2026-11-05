import type {
  Comunicado,
  EstadoComunicado,
  PrioridadComunicado,
  TipoAlcanceComunicado,
} from '../models/comunicado.model';

export interface FilterComunicadosParams {
  search?: string;
  estado?: EstadoComunicado | string;
  prioridad?: PrioridadComunicado | string;
  idSucursal?: string;
}

export interface CreateComunicadoParams {
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

export interface EstimarAlcanceParams {
  tipoAlcance: TipoAlcanceComunicado;
  sucursalIds?: string[];
  departamentoIds?: string[];
  usuarioIds?: string[];
  rolSimulado?: string;
}

export interface EstimarAlcanceResult {
  totalColaboradores: number;
  totalSucursales: number;
  totalDepartamentos: number;
  autorizado: boolean;
  mensajePermiso: string;
}

export interface ComunicadoRepository {
  findAll(filters?: FilterComunicadosParams): Promise<Comunicado[]>;
  findById(idComunicado: string): Promise<Comunicado>;
  create(params: CreateComunicadoParams): Promise<Comunicado>;
  estimarAlcance(params: EstimarAlcanceParams): Promise<EstimarAlcanceResult>;
  registrarLectura(idComunicado: string, confirmar?: boolean): Promise<{ message: string }>;
  anular(idComunicado: string): Promise<{ message: string }>;
}

