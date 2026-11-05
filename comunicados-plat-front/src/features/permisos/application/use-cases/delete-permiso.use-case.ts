import { PermisoDomainError } from '../../domain/errors/permiso.error';
import type { PermisoRepository } from '../../domain/ports/permiso.repository';

export class DeletePermisoUseCase {
  private readonly repository: PermisoRepository;

  constructor(repository: PermisoRepository) {
    this.repository = repository;
  }

  async execute(idPermiso: string): Promise<{ message: string }> {
    if (!idPermiso.trim()) {
      throw new PermisoDomainError('El identificador del permiso es obligatorio.');
    }

    return this.repository.delete(idPermiso);
  }
}

