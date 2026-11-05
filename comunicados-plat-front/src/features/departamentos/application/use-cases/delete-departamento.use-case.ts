import { DepartamentoDomainError } from '../../domain/errors/departamento.error';
import type { DepartamentoRepository } from '../../domain/ports/departamento.repository';

export class DeleteDepartamentoUseCase {
  private readonly repository: DepartamentoRepository;

  constructor(repository: DepartamentoRepository) {
    this.repository = repository;
  }

  async execute(idDepartamento: string): Promise<{ message: string }> {
    if (!idDepartamento.trim()) {
      throw new DepartamentoDomainError('El identificador del departamento es obligatorio.');
    }

    return this.repository.delete(idDepartamento);
  }
}

