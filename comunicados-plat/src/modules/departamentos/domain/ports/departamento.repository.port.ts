import { Departamento } from '../entities/departamento.entity.js';

export interface DepartamentoRepositoryPort {
  findAll(): Promise<Departamento[]>;
  findById(idDepartamento: string): Promise<Departamento | null>;
  findByNombre(nombre: string): Promise<Departamento | null>;
  save(departamento: Departamento): Promise<void>;
  delete(idDepartamento: string): Promise<void>;
  hasAssignedUsers(idDepartamento: string): Promise<boolean>;
}
