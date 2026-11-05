import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PERMISO_REPOSITORY_TOKEN } from '../../infrastructure/tokens.js';
import type { PermisoRepositoryPort } from '../../domain/ports/permiso.repository.port.js';

@Injectable()
export class DeletePermisoUseCase {
  constructor(
    @Inject(PERMISO_REPOSITORY_TOKEN)
    private readonly permisoRepository: PermisoRepositoryPort,
  ) {}

  async execute(idPermiso: string): Promise<{ message: string }> {
    const existing = await this.permisoRepository.findById(idPermiso);
    if (!existing) {
      throw new NotFoundException(`El permiso con ID "${idPermiso}" no fue encontrado.`);
    }

    await this.permisoRepository.delete(idPermiso);

    return {
      message: `Permiso "${existing.nombre}" eliminado correctamente.`,
    };
  }
}
