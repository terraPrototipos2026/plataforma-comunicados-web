import type { Sucursal } from '../../domain/models/sucursal.model';
import type { SucursalRepository } from '../../domain/ports/sucursal.repository';

export class GetSucursalesUseCase {
  private readonly repository: SucursalRepository;

  constructor(repository: SucursalRepository) {
    this.repository = repository;
  }

  async execute(): Promise<Sucursal[]> {
    return this.repository.findAll();
  }
}

