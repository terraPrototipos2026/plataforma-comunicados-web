export interface RegisterUsuarioInput {
  nombre: string;
  correo: string;
  password: string;
  telefono?: string;
  rol: string;
  departamento: string;
}

export interface UpdateUsuarioInput {
  idUsuario: string;
  nombre?: string;
  correo?: string;
  telefono?: string;
  rol?: string;
  departamento?: string;
}

