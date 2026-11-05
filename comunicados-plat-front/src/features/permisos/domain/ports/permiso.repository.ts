import type { Permiso } from '../models/permiso.model';

export interface CreatePermisoParams {
  nombre: string;
}

export interface UpdatePermisoParams {
  idPermiso: string;
  nombre: string;
}

export interface PermisoRepository {
  findAll(): Promise<Permiso[]>;
  findById(idPermiso: string): Promise<Permiso>;
  create(params: CreatePermisoParams): Promise<Permiso>;
  update(params: UpdatePermisoParams): Promise<Permiso>;
  delete(idPermiso: string): Promise<{ message: string }>;
}

