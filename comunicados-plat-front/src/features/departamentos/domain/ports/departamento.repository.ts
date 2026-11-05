import type { Departamento } from '../models/departamento.model';

export interface CreateDepartamentoParams {
  nombre: string;
  idSucursal?: string | null;
}

export interface UpdateDepartamentoParams {
  idDepartamento: string;
  nombre: string;
  idSucursal?: string | null;
}

export interface DepartamentoRepository {
  findAll(): Promise<Departamento[]>;
  findById(idDepartamento: string): Promise<Departamento>;
  create(params: CreateDepartamentoParams): Promise<Departamento>;
  update(params: UpdateDepartamentoParams): Promise<Departamento>;
  delete(idDepartamento: string): Promise<{ message: string }>;
}

