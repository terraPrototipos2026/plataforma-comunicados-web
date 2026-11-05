import { PermisoDomainError } from '../../domain/errors/permiso.error';
import { PermisoRules, type Permiso } from '../../domain/models/permiso.model';
import type { PermisoRepository } from '../../domain/ports/permiso.repository';
import type { UpdatePermisoInput } from '../dtos/permiso.dto';

export class UpdatePermisoUseCase {
  private readonly repository: PermisoRepository;

  constructor(repository: PermisoRepository) {
    this.repository = repository;
  }

  async execute(input: UpdatePermisoInput): Promise<Permiso> {
    if (!input.idPermiso.trim()) {
      throw new PermisoDomainError('El identificador del permiso es obligatorio.');
    }

    const normalized = PermisoRules.normalizeNombre(input.nombre);

    if (!PermisoRules.isValidNombre(normalized)) {
      throw new PermisoDomainError(
        'El código del permiso es obligatorio y no puede exceder los 100 caracteres.',
      );
    }

    return this.repository.update({
      idPermiso: input.idPermiso,
      nombre: normalized,
    });
  }
}

