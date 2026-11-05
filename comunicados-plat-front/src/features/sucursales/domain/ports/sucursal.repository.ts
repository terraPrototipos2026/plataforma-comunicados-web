import type { Sucursal } from '../models/sucursal.model';

export interface CreateSucursalParams {
  nombre: string;
  direccion: string;
}

export interface UpdateSucursalParams {
  idSucursal: string;
  nombre?: string;
  direccion?: string;
}

export interface SucursalRepository {
  findAll(): Promise<Sucursal[]>;
  findById(idSucursal: string): Promise<Sucursal>;
  create(params: CreateSucursalParams): Promise<Sucursal>;
  update(params: UpdateSucursalParams): Promise<Sucursal>;
  delete(idSucursal: string): Promise<{ message: string }>;
}

