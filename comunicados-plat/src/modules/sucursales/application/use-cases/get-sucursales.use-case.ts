import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { Sucursal } from '../../domain/entities/sucursal.entity.js';
import type { SucursalRepositoryPort } from '../../domain/ports/sucursal.repository.port.js';
import { SUCURSAL_REPOSITORY_TOKEN } from '../../infrastructure/tokens.js';

@Injectable()
export class GetSucursalesUseCase {
  constructor(
    @Inject(SUCURSAL_REPOSITORY_TOKEN)
    private readonly repository: SucursalRepositoryPort,
  ) {}

  async findAll(): Promise<Sucursal[]> {
    return this.repository.findAll();
  }

  async findById(idSucursal: string): Promise<Sucursal> {
    const sucursal = await this.repository.findById(idSucursal);
    if (!sucursal) {
      throw new NotFoundException(`No se encontró la sucursal con el id "${idSucursal}".`);
    }
    return sucursal;
  }
}
