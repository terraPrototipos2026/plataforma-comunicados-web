import { PermisoDomainError } from '../../domain/errors/permiso.error';
import { PermisoRules, type Permiso } from '../../domain/models/permiso.model';
import type { PermisoRepository } from '../../domain/ports/permiso.repository';
import type { CreatePermisoInput } from '../dtos/permiso.dto';

export class CreatePermisoUseCase {
  private readonly repository: PermisoRepository;

  constructor(repository: PermisoRepository) {
    this.repository = repository;
  }

  async execute(input: CreatePermisoInput): Promise<Permiso> {
    const normalized = PermisoRules.normalizeNombre(input.nombre);

    if (!PermisoRules.isValidNombre(normalized)) {
      throw new PermisoDomainError(
        'El código del permiso es obligatorio y no puede exceder los 100 caracteres.',
      );
    }

    return this.repository.create({ nombre: normalized });
  }
}

