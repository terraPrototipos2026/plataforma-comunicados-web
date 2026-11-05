export interface PermisoProps {
  idPermiso: string;
  nombre: string;
}

export class Permiso {
  private constructor(private readonly props: PermisoProps) {}

  public static create(props: PermisoProps): Permiso {
    const normalized = Permiso.normalizeNombre(props.nombre);
    Permiso.validateNombre(normalized);

    return new Permiso({
      idPermiso: props.idPermiso,
      nombre: normalized,
    });
  }

  public static reconstitute(props: PermisoProps): Permiso {
    return new Permiso({
      idPermiso: props.idPermiso,
      nombre: props.nombre,
    });
  }

  public rename(nuevoNombre: string): void {
    const normalized = Permiso.normalizeNombre(nuevoNombre);
    Permiso.validateNombre(normalized);
    this.props.nombre = normalized;
  }

  private static normalizeNombre(nombre: string): string {
    return nombre.trim().toLowerCase();
  }

  private static validateNombre(nombre: string): void {
    if (!nombre || nombre.length === 0) {
      throw new Error('El nombre del permiso no puede estar vacío.');
    }
    if (nombre.length > 100) {
      throw new Error('El nombre del permiso no puede exceder los 100 caracteres.');
    }
  }

  public get idPermiso(): string {
    return this.props.idPermiso;
  }

  public get nombre(): string {
    return this.props.nombre;
  }
}
