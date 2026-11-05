export interface RolPermisoItem {
  idPermiso: string;
  nombre: string;
}

export interface RolProps {
  idRol: string;
  nombre: string;
  permisos?: RolPermisoItem[];
}

export class Rol {
  private readonly _idRol: string;
  private _nombre: string;
  private _permisos: RolPermisoItem[];

  private constructor(props: RolProps) {
    this._idRol = props.idRol;
    this._nombre = props.nombre;
    this._permisos = props.permisos ? [...props.permisos] : [];
  }

  public static create(props: RolProps): Rol {
    const normalized = Rol.normalizeNombre(props.nombre);
    Rol.validateNombre(normalized);

    return new Rol({
      idRol: props.idRol,
      nombre: normalized,
      permisos: props.permisos ?? [],
    });
  }

  public static reconstitute(props: RolProps): Rol {
    return new Rol({
      idRol: props.idRol,
      nombre: props.nombre,
      permisos: props.permisos ?? [],
    });
  }

  public rename(nuevoNombre: string): void {
    const normalized = Rol.normalizeNombre(nuevoNombre);
    Rol.validateNombre(normalized);
    this._nombre = normalized;
  }

  public setPermisos(permisos: RolPermisoItem[]): void {
    this._permisos = [...permisos];
  }

  private static normalizeNombre(nombre: string): string {
    return nombre.trim().toLowerCase();
  }

  private static validateNombre(nombre: string): void {
    if (!nombre || nombre.length === 0) {
      throw new Error('El nombre del rol no puede estar vacío.');
    }
    if (nombre.length > 50) {
      throw new Error('El nombre del rol no puede exceder los 50 caracteres.');
    }
  }

  public get idRol(): string {
    return this._idRol;
  }

  public get nombre(): string {
    return this._nombre;
  }

  public get permisos(): RolPermisoItem[] {
    return [...this._permisos];
  }
}
