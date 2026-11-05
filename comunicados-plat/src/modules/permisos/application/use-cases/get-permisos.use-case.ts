import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PERMISO_REPOSITORY_TOKEN } from '../../infrastructure/tokens.js';
import type { PermisoRepositoryPort } from '../../domain/ports/permiso.repository.port.js';
import type { PermisoOutput } from './create-permiso.use-case.js';

@Injectable()
export class GetPermisosUseCase {
  constructor(
    @Inject(PERMISO_REPOSITORY_TOKEN)
    private readonly permisoRepository: PermisoRepositoryPort,
  ) {}

  async findAll(): Promise<PermisoOutput[]> {
    const list = await this.permisoRepository.findAll();
    return list.map((item) => ({
      idPermiso: item.idPermiso,
      nombre: item.nombre,
    }));
  }

  async findById(idPermiso: string): Promise<PermisoOutput> {
    const item = await this.permisoRepository.findById(idPermiso);
    if (!item) {
      throw new NotFoundException(`El permiso con ID "${idPermiso}" no fue encontrado.`);
    }

    return {
      idPermiso: item.idPermiso,
      nombre: item.nombre,
    };
  }
}
