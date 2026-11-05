import type { Usuario } from '../models/usuario.model';

export interface RegisterUsuarioParams {
  nombre: string;
  correo: string;
  password: string;
  telefono?: string;
  rol: string;
  departamento: string;
}

export interface UpdateUsuarioParams {
  nombre?: string;
  correo?: string;
  telefono?: string;
  rol?: string;
  departamento?: string;
}

export interface UsuarioRepository {
  findAll(): Promise<Usuario[]>;
  findById(id: string): Promise<Usuario>;
  register(params: RegisterUsuarioParams): Promise<{ idUsuario: string; correo: string }>;
  update(id: string, params: UpdateUsuarioParams): Promise<Usuario>;
  delete(id: string): Promise<void>;
}
