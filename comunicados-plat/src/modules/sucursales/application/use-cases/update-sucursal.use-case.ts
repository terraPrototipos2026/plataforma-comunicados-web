import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Sucursal } from '../../domain/entities/sucursal.entity.js';
import type { SucursalRepositoryPort } from '../../domain/ports/sucursal.repository.port.js';
import { SUCURSAL_REPOSITORY_TOKEN } from '../../infrastructure/tokens.js';
import type { UpdateSucursalInput } from '../dtos/sucursal.dto.js';

@Injectable()
export class UpdateSucursalUseCase {
  constructor(
    @Inject(SUCURSAL_REPOSITORY_TOKEN)
    private readonly repository: SucursalRepositoryPort,
  ) {}

  async execute(input: UpdateSucursalInput): Promise<Sucursal> {
    const sucursal = await this.repository.findById(input.idSucursal);
    if (!sucursal) {
      throw new NotFoundException(
        `No se encontró la sucursal con el id "${input.idSucursal}".`,
      );
    }

    if (input.nombre !== undefined) {
      const existing = await this.repository.findByNombre(input.nombre);
      if (existing && existing.idSucursal !== input.idSucursal) {
        throw new ConflictException(
          `Ya existe otra sucursal registrada con el nombre "${input.nombre.trim()}".`,
        );
      }
    }

    sucursal.update(input.nombre, input.direccion);
    await this.repository.save(sucursal);

    return sucursal;
  }
}
