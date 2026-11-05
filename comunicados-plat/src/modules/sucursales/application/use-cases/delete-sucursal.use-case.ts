import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { SucursalRepositoryPort } from '../../domain/ports/sucursal.repository.port.js';
import { SUCURSAL_REPOSITORY_TOKEN } from '../../infrastructure/tokens.js';

@Injectable()
export class DeleteSucursalUseCase {
  constructor(
    @Inject(SUCURSAL_REPOSITORY_TOKEN)
    private readonly repository: SucursalRepositoryPort,
  ) {}

  async execute(idSucursal: string): Promise<{ message: string }> {
    const sucursal = await this.repository.findById(idSucursal);
    if (!sucursal) {
      throw new NotFoundException(
        `No se encontró la sucursal con el id "${idSucursal}".`,
      );
    }

    const hasDepartamentos = await this.repository.hasAssignedDepartamentos(idSucursal);
    if (hasDepartamentos) {
      throw new ConflictException(
        `No es posible eliminar la sucursal "${sucursal.nombre}" porque tiene departamentos asociados.`,
      );
    }

    await this.repository.delete(idSucursal);
    return {
      message: `Sucursal "${sucursal.nombre}" eliminada exitosamente.`,
    };
  }
}
