export interface DepartamentoProps {
  idDepartamento: string;
  nombre: string;
}

export class Departamento {
  private constructor(private readonly props: DepartamentoProps) {}

  public static create(props: DepartamentoProps): Departamento {
    const normalized = Departamento.normalizeNombre(props.nombre);
    Departamento.validateNombre(normalized);

    return new Departamento({
      idDepartamento: props.idDepartamento,
      nombre: normalized,
    });
  }

  public static reconstitute(props: DepartamentoProps): Departamento {
    return new Departamento({
      idDepartamento: props.idDepartamento,
      nombre: props.nombre,
    });
  }

  public rename(nuevoNombre: string): void {
    const normalized = Departamento.normalizeNombre(nuevoNombre);
    Departamento.validateNombre(normalized);
    this.props.nombre = normalized;
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
    return this.props.idDepartamento;
  }

  public get nombre(): string {
    return this.props.nombre;
  }
}
