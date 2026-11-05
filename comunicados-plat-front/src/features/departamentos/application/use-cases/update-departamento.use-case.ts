import { DepartamentoDomainError } from '../../domain/errors/departamento.error';
import {
  DepartamentoRules,
  type Departamento,
} from '../../domain/models/departamento.model';
import type { DepartamentoRepository } from '../../domain/ports/departamento.repository';
import type { UpdateDepartamentoInput } from '../dtos/departamento.dto';

export class UpdateDepartamentoUseCase {
  private readonly repository: DepartamentoRepository;

  constructor(repository: DepartamentoRepository) {
    this.repository = repository;
  }

  async execute(input: UpdateDepartamentoInput): Promise<Departamento> {
    if (!input.idDepartamento.trim()) {
      throw new DepartamentoDomainError('El identificador del departamento es obligatorio.');
    }

    const normalized = DepartamentoRules.normalizeNombre(input.nombre);

    if (!DepartamentoRules.isValidNombre(normalized)) {
      throw new DepartamentoDomainError(
        'El nombre del departamento es obligatorio y no puede exceder los 100 caracteres.',
      );
    }

    return this.repository.update({
      idDepartamento: input.idDepartamento,
      nombre: normalized,
      idSucursal: input.idSucursal !== undefined ? input.idSucursal : undefined,
    });
  }
}

