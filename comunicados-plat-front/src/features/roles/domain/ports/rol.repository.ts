import type { Rol } from '../models/rol.model';

export interface CreateRolParams {
  nombre: string;
  permisoIds?: string[];
}

export interface UpdateRolParams {
  idRol: string;
  nombre: string;
}

export interface AssignPermisosToRolParams {
  idRol: string;
  permisoIds: string[];
}

export interface RolRepository {
  findAll(): Promise<Rol[]>;
  findById(idRol: string): Promise<Rol>;
  create(params: CreateRolParams): Promise<Rol>;
  update(params: UpdateRolParams): Promise<Rol>;
  assignPermisos(params: AssignPermisosToRolParams): Promise<Rol>;
  delete(idRol: string): Promise<{ message: string }>;
}

