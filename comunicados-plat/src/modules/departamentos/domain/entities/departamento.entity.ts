export interface DepartamentoProps {
  idDepartamento: string;
  nombre: string;
  idSucursal?: string | null;
}

export class Departamento {
  private readonly _idDepartamento: string;
  private _nombre: string;
  private _idSucursal: string | null;

  private constructor(props: DepartamentoProps) {
    this._idDepartamento = props.idDepartamento;
    this._nombre = props.nombre;
    this._idSucursal = props.idSucursal ?? null;
  }

  public static create(props: DepartamentoProps): Departamento {
    const normalized = Departamento.normalizeNombre(props.nombre);
    Departamento.validateNombre(normalized);

    return new Departamento({
      idDepartamento: props.idDepartamento,
      nombre: normalized,
      idSucursal: props.idSucursal ?? null,
    });
  }

  public static reconstitute(props: DepartamentoProps): Departamento {
    return new Departamento({
      idDepartamento: props.idDepartamento,
      nombre: props.nombre,
      idSucursal: props.idSucursal ?? null,
    });
  }

  public rename(nuevoNombre: string): void {
    const normalized = Departamento.normalizeNombre(nuevoNombre);
    Departamento.validateNombre(normalized);
    this._nombre = normalized;
  }

  public assignSucursal(idSucursal: string | null): void {
    this._idSucursal = idSucursal;
  }

  private static normalizeNombre(nombre: string): string {
    return nombre.trim().toLowerCase();
  }

  private static validateNombre(nombre: string): void {
    if (!nombre || nombre.length === 0) {
      throw new Error('El nombre del departamento no puede estar vacío.');
    }
    if (nombre.length > 100) {
      throw new Error('El nombre del departamento no puede exceder los 100 caracteres.');
    }
  }

  public get idDepartamento(): string {
    return this._idDepartamento;
  }

  public get nombre(): string {
    return this._nombre;
  }

  public get idSucursal(): string | null {
    return this._idSucursal;
  }
}
