import type { Departamento } from '../../domain/models/departamento.model';
import type { DepartamentoRepository } from '../../domain/ports/departamento.repository';

export class GetDepartamentosUseCase {
  private readonly repository: DepartamentoRepository;

  constructor(repository: DepartamentoRepository) {
    this.repository = repository;
  }

  async findAll(): Promise<Departamento[]> {
    return this.repository.findAll();
  }

  async findById(idDepartamento: string): Promise<Departamento> {
    return this.repository.findById(idDepartamento);
  }
}

