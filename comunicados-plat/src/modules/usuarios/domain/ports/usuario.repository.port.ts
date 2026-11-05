import { Usuario } from '../entities/usuario.entity.js';

export interface UpdateUsuarioData {
  nombre?: string;
  correo?: string;
  telefono?: string;
  idRol?: string;
  idDepartamento?: string;
}

export interface UsuarioRepositoryPort {
  findAll(): Promise<Usuario[]>;
  findById(id: string): Promise<Usuario | null>;
  findByEmail(email: string): Promise<Usuario | null>;
  update(id: string, data: UpdateUsuarioData): Promise<Usuario>;
  delete(id: string): Promise<void>;
  findRoleIdByName(name: string): Promise<string | null>;
  findDepartmentIdByName(name: string): Promise<string | null>;
}

