export interface UsuarioProps {
  idUsuario: string;
  nombre: string;
  correo: string;
  telefono: string | null;
  idRol: string;
  rolNombre: string;
  idDepartamento: string;
  departamentoNombre: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Usuario {
  constructor(private readonly props: UsuarioProps) {}

  get idUsuario(): string {
    return this.props.idUsuario;
  }

  get nombre(): string {
    return this.props.nombre;
  }

  get correo(): string {
    return this.props.correo;
  }

  get telefono(): string | null {
    return this.props.telefono;
  }

  get idRol(): string {
    return this.props.idRol;
  }

  get rolNombre(): string {
    return this.props.rolNombre;
  }

  get idDepartamento(): string {
    return this.props.idDepartamento;
  }

  get departamentoNombre(): string {
    return this.props.departamentoNombre;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}

