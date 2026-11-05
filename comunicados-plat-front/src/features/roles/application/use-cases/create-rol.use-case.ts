import { RolDomainError } from '../../domain/errors/rol.error';
import { RolRules, type Rol } from '../../domain/models/rol.model';
import type { RolRepository } from '../../domain/ports/rol.repository';
import type { CreateRolInput } from '../dtos/rol.dto';

export class CreateRolUseCase {
  private readonly repository: RolRepository;

  constructor(repository: RolRepository) {
    this.repository = repository;
  }

  async execute(input: CreateRolInput): Promise<Rol> {
    const normalized = RolRules.normalizeNombre(input.nombre);

    if (!RolRules.isValidNombre(normalized)) {
      throw new RolDomainError(
        'El nombre del rol es obligatorio y no puede exceder los 50 caracteres.',
      );
    }

    const permisoIds = input.permisoIds
      ? RolRules.deduplicatePermisoIds(input.permisoIds)
      : undefined;

    return this.repository.create({
      nombre: normalized,
      permisoIds,
    });
  }
}

