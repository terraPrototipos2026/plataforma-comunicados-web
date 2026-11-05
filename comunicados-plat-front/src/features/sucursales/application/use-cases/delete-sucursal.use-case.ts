import { SucursalDomainError } from '../../domain/errors/sucursal.error';
import type { SucursalRepository } from '../../domain/ports/sucursal.repository';

export class DeleteSucursalUseCase {
  private readonly repository: SucursalRepository;

  constructor(repository: SucursalRepository) {
    this.repository = repository;
  }

  async execute(idSucursal: string): Promise<{ message: string }> {
    if (!idSucursal.trim()) {
      throw new SucursalDomainError('El identificador de la sucursal es obligatorio.');
    }

    return this.repository.delete(idSucursal);
  }
}

