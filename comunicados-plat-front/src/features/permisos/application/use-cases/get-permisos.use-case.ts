import type { Permiso } from '../../domain/models/permiso.model';
import type { PermisoRepository } from '../../domain/ports/permiso.repository';

export class GetPermisosUseCase {
  private readonly repository: PermisoRepository;

  constructor(repository: PermisoRepository) {
    this.repository = repository;
  }

  async findAll(): Promise<Permiso[]> {
    return this.repository.findAll();
  }

  async findById(idPermiso: string): Promise<Permiso> {
    return this.repository.findById(idPermiso);
  }
}

