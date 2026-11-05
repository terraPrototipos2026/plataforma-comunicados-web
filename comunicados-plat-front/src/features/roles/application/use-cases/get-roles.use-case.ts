import type { Rol } from '../../domain/models/rol.model';
import type { RolRepository } from '../../domain/ports/rol.repository';

export class GetRolesUseCase {
  private readonly repository: RolRepository;

  constructor(repository: RolRepository) {
    this.repository = repository;
  }

  async findAll(): Promise<Rol[]> {
    return this.repository.findAll();
  }

  async findById(idRol: string): Promise<Rol> {
    return this.repository.findById(idRol);
  }
}

