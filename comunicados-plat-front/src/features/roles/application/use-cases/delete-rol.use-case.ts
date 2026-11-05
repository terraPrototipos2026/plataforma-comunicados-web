import { RolDomainError } from '../../domain/errors/rol.error';
import type { RolRepository } from '../../domain/ports/rol.repository';

export class DeleteRolUseCase {
  private readonly repository: RolRepository;

  constructor(repository: RolRepository) {
    this.repository = repository;
  }

  async execute(idRol: string): Promise<{ message: string }> {
    if (!idRol.trim()) {
      throw new RolDomainError('El identificador del rol es obligatorio.');
    }

    return this.repository.delete(idRol);
  }
}

