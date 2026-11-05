import { RolDomainError } from '../../domain/errors/rol.error';
import { RolRules, type Rol } from '../../domain/models/rol.model';
import type { RolRepository } from '../../domain/ports/rol.repository';
import type { AssignPermisosToRolInput } from '../dtos/rol.dto';

export class AssignPermisosToRolUseCase {
  private readonly repository: RolRepository;

  constructor(repository: RolRepository) {
    this.repository = repository;
  }

  async execute(input: AssignPermisosToRolInput): Promise<Rol> {
    if (!input.idRol.trim()) {
      throw new RolDomainError('El identificador del rol es obligatorio.');
    }

    const permisoIds = RolRules.deduplicatePermisoIds(input.permisoIds);

    return this.repository.assignPermisos({
      idRol: input.idRol,
      permisoIds,
    });
  }
}

