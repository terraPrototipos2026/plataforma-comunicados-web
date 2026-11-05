import { Rol } from '../entities/rol.entity.js';

export interface RolRepositoryPort {
  findAll(): Promise<Rol[]>;
  findById(idRol: string): Promise<Rol | null>;
  findByNombre(nombre: string): Promise<Rol | null>;
  save(rol: Rol): Promise<void>;
  syncPermisos(idRol: string, permisoIds: string[]): Promise<Rol>;
  delete(idRol: string): Promise<void>;
  hasAssignedUsers(idRol: string): Promise<boolean>;
}
