import { DepartamentoDomainError } from '../../domain/errors/departamento.error';
import {
  DepartamentoRules,
  type Departamento,
} from '../../domain/models/departamento.model';
import type { DepartamentoRepository } from '../../domain/ports/departamento.repository';
import type { CreateDepartamentoInput } from '../dtos/departamento.dto';

export class CreateDepartamentoUseCase {
  private readonly repository: DepartamentoRepository;

  constructor(repository: DepartamentoRepository) {
    this.repository = repository;
  }

  async execute(input: CreateDepartamentoInput): Promise<Departamento> {
    const normalized = DepartamentoRules.normalizeNombre(input.nombre);

    if (!DepartamentoRules.isValidNombre(normalized)) {
      throw new DepartamentoDomainError(
        'El nombre del departamento es obligatorio y no puede exceder los 100 caracteres.',
      );
    }

    return this.repository.create({
      nombre: normalized,
      idSucursal: input.idSucursal ?? null,
    });
  }
}

