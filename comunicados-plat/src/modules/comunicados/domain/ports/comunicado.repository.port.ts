import type { Comunicado } from '../entities/comunicado.entity.js';

export interface FilterComunicadosParams {
  search?: string;
  estado?: string;
  prioridad?: string;
  idSucursal?: string;
  limit?: number;
  offset?: number;
}

export interface CreateComunicadoPersistenceData {
  codigo: string;
  titulo: string;
  extracto?: string | null;
  medioPublicacion: string;
  prioridad: string;
  estado: string;
  tipoAlcance: string;
  fechaPublicacion?: Date | null;
  fechaProgramada?: Date | null;
  idUsuario: string;
  cuerpo?: {
    contenido: string;
    urlArchivo?: string | null;
    nombreArchivo?: string | null;
    tamanoBytes?: number | null;
    numeroPaginas?: number | null;
  } | null;
  imagenes?: {
    urlImagen: string;
    nombreArchivo?: string | null;
    tamanoBytes?: number | null;
    esPortada: boolean;
    orden: number;
  }[];
  destinatarioIds: string[];
}

export interface EstimarAlcanceData {
  tipoAlcance: string;
  sucursalIds?: string[];
  departamentoIds?: string[];
  usuarioIds?: string[];
}

export interface EstimarAlcanceResult {
  totalColaboradores: number;
  totalSucursales: number;
  totalDepartamentos: number;
  targetUserIds: string[];
}

export interface ComunicadoRepositoryPort {
  findAll(filters?: FilterComunicadosParams): Promise<Comunicado[]>;
  findById(idComunicado: string): Promise<Comunicado | null>;
  create(data: CreateComunicadoPersistenceData): Promise<Comunicado>;
  anular(idComunicado: string): Promise<void>;
  registrarLectura(idComunicado: string, idUsuario: string, confirmar: boolean): Promise<void>;
  getNextCodigo(): Promise<string>;
  estimarAlcance(data: EstimarAlcanceData): Promise<EstimarAlcanceResult>;
}

