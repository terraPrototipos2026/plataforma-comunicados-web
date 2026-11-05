import type { Sucursal } from '../entities/sucursal.entity.js';

export interface SucursalRepositoryPort {
  findAll(): Promise<Sucursal[]>;
  findById(idSucursal: string): Promise<Sucursal | null>;
  findByNombre(nombre: string): Promise<Sucursal | null>;
  save(sucursal: Sucursal): Promise<void>;
  delete(idSucursal: string): Promise<void>;
  hasAssignedDepartamentos(idSucursal: string): Promise<boolean>;
}
