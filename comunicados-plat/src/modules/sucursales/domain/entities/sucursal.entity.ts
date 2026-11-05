export interface SucursalProps {
  idSucursal: string;
  nombre: string;
  direccion: string;
}

export class Sucursal {
  private readonly _idSucursal: string;
  private _nombre: string;
  private _direccion: string;

  private constructor(props: SucursalProps) {
    this._idSucursal = props.idSucursal;
    this._nombre = props.nombre;
    this._direccion = props.direccion;
  }

  public static create(props: SucursalProps): Sucursal {
    const normalizedNombre = Sucursal.normalize(props.nombre);
    const normalizedDireccion = props.direccion.trim();

    Sucursal.validateNombre(normalizedNombre);
    Sucursal.validateDireccion(normalizedDireccion);

    return new Sucursal({
      idSucursal: props.idSucursal,
      nombre: normalizedNombre,
      direccion: normalizedDireccion,
    });
  }

  public static reconstitute(props: SucursalProps): Sucursal {
    return new Sucursal({
      idSucursal: props.idSucursal,
      nombre: props.nombre,
      direccion: props.direccion,
    });
  }

  public update(nuevoNombre?: string, nuevaDireccion?: string): void {
    if (nuevoNombre !== undefined) {
      const normalized = Sucursal.normalize(nuevoNombre);
      Sucursal.validateNombre(normalized);
      this._nombre = normalized;
    }

    if (nuevaDireccion !== undefined) {
      const normalized = nuevaDireccion.trim();
      Sucursal.validateDireccion(normalized);
      this._direccion = normalized;
    }
  }

  private static normalize(texto: string): string {
    return texto.trim().toLowerCase();
  }

  private static validateNombre(nombre: string): void {
    if (!nombre || nombre.length === 0) {
      throw new Error('El nombre de la sucursal no puede estar vacío.');
    }
    if (nombre.length > 100) {
      throw new Error('El nombre de la sucursal no puede exceder los 100 caracteres.');
    }
  }

  private static validateDireccion(direccion: string): void {
    if (!direccion || direccion.length === 0) {
      throw new Error('La dirección de la sucursal no puede estar vacía.');
    }
    if (direccion.length > 255) {
      throw new Error('La dirección de la sucursal no puede exceder los 255 caracteres.');
    }
  }

  public get idSucursal(): string {
    return this._idSucursal;
  }

  public get nombre(): string {
    return this._nombre;
  }

  public get direccion(): string {
    return this._direccion;
  }
}
