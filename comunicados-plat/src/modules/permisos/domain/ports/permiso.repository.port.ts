import { Permiso } from '../entities/permiso.entity.js';

export interface PermisoRepositoryPort {
  findAll(): Promise<Permiso[]>;
  findById(idPermiso: string): Promise<Permiso | null>;
  findByIds(idPermisos: string[]): Promise<Permiso[]>;
  findByNombre(nombre: string): Promise<Permiso | null>;
  save(permiso: Permiso): Promise<void>;
  delete(idPermiso: string): Promise<void>;
}
