export interface CuerpoProps {
  idCuerpo: string;
  contenido: string;
  urlArchivo?: string | null;
  nombreArchivo?: string | null;
  tamanoBytes?: number | null;
  numeroPaginas?: number | null;
}

export interface ImagenProps {
  idImagen: string;
  urlImagen: string;
  nombreArchivo?: string | null;
  tamanoBytes?: number | null;
  esPortada: boolean;
  orden: number;
}

export interface DestinatarioDetalleProps {
  idUsuario: string;
  nombre: string;
  correo: string;
  rol: string;
  idDepartamento: string;
  departamentoNombre: string;
  idSucursal: string;
  sucursalNombre: string;
  estadoLectura: string; // 'PENDIENTE' | 'VISUALIZADO' | 'CONFIRMADO'
  fechaVisualizacion?: Date | null;
  fechaConfirmacion?: Date | null;
}

export interface ComunicadoProps {
  idComunicado: string;
  codigo: string;
  titulo: string;
  extracto?: string | null;
  medioPublicacion: string; // 'EXPRESS' | 'AVANZADO'
  prioridad: string; // 'NORMAL' | 'IMPORTANTE' | 'URGENTE'
  estado: string; // 'BORRADOR' | 'PROGRAMADO' | 'PUBLICADO' | 'ANULADO'
  tipoAlcance: string; // 'TODA_EMPRESA' | 'POR_SUCURSAL' | 'ENCARGADOS_AREA' | 'POR_DEPARTAMENTO' | 'NOMINATIVO'
  fechaPublicacion?: Date | null;
  fechaProgramada?: Date | null;
  idUsuario: string;
  autorNombre?: string;
  cuerpo?: CuerpoProps | null;
  imagenes?: ImagenProps[];
  destinatariosDetalle?: DestinatarioDetalleProps[];
  totalDestinatarios?: number;
  totalConfirmados?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Comunicado {
  private readonly _idComunicado: string;
  private readonly _codigo: string;
  private _titulo: string;
  private _extracto: string | null;
  private _medioPublicacion: string;
  private _prioridad: string;
  private _estado: string;
  private _tipoAlcance: string;
  private _fechaPublicacion: Date | null;
  private _fechaProgramada: Date | null;
  private readonly _idUsuario: string;
  private _autorNombre?: string;
  private _cuerpo: CuerpoProps | null;
  private _imagenes: ImagenProps[];
  private _destinatariosDetalle: DestinatarioDetalleProps[];
  private _totalDestinatarios: number;
  private _totalConfirmados: number;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  private constructor(props: ComunicadoProps) {
    this._idComunicado = props.idComunicado;
    this._codigo = props.codigo;
    this._titulo = props.titulo;
    this._extracto = props.extracto ?? null;
    this._medioPublicacion = props.medioPublicacion;
    this._prioridad = props.prioridad;
    this._estado = props.estado;
    this._tipoAlcance = props.tipoAlcance;
    this._fechaPublicacion = props.fechaPublicacion ?? null;
    this._fechaProgramada = props.fechaProgramada ?? null;
    this._idUsuario = props.idUsuario;
    this._autorNombre = props.autorNombre;
    this._cuerpo = props.cuerpo ?? null;
    this._imagenes = props.imagenes ?? [];
    this._destinatariosDetalle = props.destinatariosDetalle ?? [];
    this._totalDestinatarios = props.totalDestinatarios ?? 0;
    this._totalConfirmados = props.totalConfirmados ?? 0;
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  public static create(props: ComunicadoProps): Comunicado {
    if (!props.titulo || props.titulo.trim().length < 3) {
      throw new Error('El título del comunicado debe tener al menos 3 caracteres.');
    }
    return new Comunicado(props);
  }

  public static reconstitute(props: ComunicadoProps): Comunicado {
    return new Comunicado(props);
  }

  public anular(): void {
    this._estado = 'ANULADO';
  }

  public get porcentajeLectura(): number {
    if (!this._totalDestinatarios || this._totalDestinatarios === 0) return 0;
    return Math.round((this._totalConfirmados / this._totalDestinatarios) * 100);
  }

  public get portadaUrl(): string | null {
    const portada = this._imagenes.find((img) => img.esPortada);
    if (portada) return portada.urlImagen;
    return this._imagenes[0]?.urlImagen ?? null;
  }

  public get idComunicado(): string { return this._idComunicado; }
  public get codigo(): string { return this._codigo; }
  public get titulo(): string { return this._titulo; }
  public get extracto(): string | null { return this._extracto; }
  public get medioPublicacion(): string { return this._medioPublicacion; }
  public get prioridad(): string { return this._prioridad; }
  public get estado(): string { return this._estado; }
  public get tipoAlcance(): string { return this._tipoAlcance; }
  public get fechaPublicacion(): Date | null { return this._fechaPublicacion; }
  public get fechaProgramada(): Date | null { return this._fechaProgramada; }
  public get idUsuario(): string { return this._idUsuario; }
  public get autorNombre(): string | undefined { return this._autorNombre; }
  public get cuerpo(): CuerpoProps | null { return this._cuerpo; }
  public get imagenes(): ImagenProps[] { return this._imagenes; }
  public get destinatariosDetalle(): DestinatarioDetalleProps[] { return this._destinatariosDetalle; }
  public get totalDestinatarios(): number { return this._totalDestinatarios; }
  public get totalConfirmados(): number { return this._totalConfirmados; }
  public get createdAt(): Date { return this._createdAt; }
  public get updatedAt(): Date { return this._updatedAt; }
}

