import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PERMISO_REPOSITORY_TOKEN } from '../../infrastructure/tokens.js';
import type { PermisoRepositoryPort } from '../../domain/ports/permiso.repository.port.js';
import type { PermisoOutput } from './create-permiso.use-case.js';

export interface UpdatePermisoInput {
  idPermiso: string;
  nombre: string;
}

@Injectable()
export class UpdatePermisoUseCase {
  constructor(
    @Inject(PERMISO_REPOSITORY_TOKEN)
    private readonly permisoRepository: PermisoRepositoryPort,
  ) {}

  async execute(input: UpdatePermisoInput): Promise<PermisoOutput> {
    const current = await this.permisoRepository.findById(input.idPermiso);
    if (!current) {
      throw new NotFoundException(`El permiso con ID "${input.idPermiso}" no fue encontrado.`);
    }

    const normalized = input.nombre.trim().toLowerCase();
    const collision = await this.permisoRepository.findByNombre(normalized);

    if (collision && collision.idPermiso !== current.idPermiso) {
      throw new ConflictException(`El nombre de permiso "${normalized}" ya está en uso.`);
    }

    try {
      current.rename(normalized);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Nombre de permiso inválido.',
      );
    }

    await this.permisoRepository.save(current);

    return {
      idPermiso: current.idPermiso,
      nombre: current.nombre,
    };
  }
}
