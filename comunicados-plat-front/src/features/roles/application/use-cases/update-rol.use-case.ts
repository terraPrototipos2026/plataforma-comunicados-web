import { RolDomainError } from '../../domain/errors/rol.error';
import { RolRules, type Rol } from '../../domain/models/rol.model';
import type { RolRepository } from '../../domain/ports/rol.repository';
import type { UpdateRolInput } from '../dtos/rol.dto';

export class UpdateRolUseCase {
  private readonly repository: RolRepository;

  constructor(repository: RolRepository) {
    this.repository = repository;
  }

  async execute(input: UpdateRolInput): Promise<Rol> {
    if (!input.idRol.trim()) {
      throw new RolDomainError('El identificador del rol es obligatorio.');
    }

    const normalized = RolRules.normalizeNombre(input.nombre);

    if (!RolRules.isValidNombre(normalized)) {
      throw new RolDomainError(
        'El nombre del rol es obligatorio y no puede exceder los 50 caracteres.',
      );
    }

    return this.repository.update({
      idRol: input.idRol,
      nombre: normalized,
    });
  }
}

