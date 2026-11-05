import { randomUUID } from 'node:crypto';
import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { Sucursal } from '../../domain/entities/sucursal.entity.js';
import type { SucursalRepositoryPort } from '../../domain/ports/sucursal.repository.port.js';
import { SUCURSAL_REPOSITORY_TOKEN } from '../../infrastructure/tokens.js';
import type { CreateSucursalInput } from '../dtos/sucursal.dto.js';

@Injectable()
export class CreateSucursalUseCase {
  constructor(
    @Inject(SUCURSAL_REPOSITORY_TOKEN)
    private readonly repository: SucursalRepositoryPort,
  ) {}

  async execute(input: CreateSucursalInput): Promise<Sucursal> {
    const existing = await this.repository.findByNombre(input.nombre);
    if (existing) {
      throw new ConflictException(
        `La sucursal con el nombre "${input.nombre.trim()}" ya existe.`,
      );
    }

    const sucursal = Sucursal.create({
      idSucursal: randomUUID(),
      nombre: input.nombre,
      direccion: input.direccion,
    });

    await this.repository.save(sucursal);
    return sucursal;
  }
}
