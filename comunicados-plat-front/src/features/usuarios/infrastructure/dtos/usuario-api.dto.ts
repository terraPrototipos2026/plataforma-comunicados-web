export interface UsuarioApiResponseDto {
  idUsuario: string;
  nombre: string;
  correo: string;
  telefono: string | null;
  idRol: string;
  rol: string;
  idDepartamento: string;
  departamento: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterUsuarioApiRequestDto {
  nombre: string;
  correo: string;
  password: string;
  telefono?: string;
  rol: string;
  departamento: string;
}

export interface RegisterUsuarioApiResponseDto {
  idUsuario: string;
  correo: string;
}

export interface UpdateUsuarioApiRequestDto {
  nombre?: string;
  correo?: string;
  telefono?: string;
  rol?: string;
  departamento?: string;
}

