import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PERMISO_REPOSITORY_TOKEN } from '../../infrastructure/tokens.js';
import type { PermisoRepositoryPort } from '../../domain/ports/permiso.repository.port.js';
import { Permiso } from '../../domain/entities/permiso.entity.js';

export interface CreatePermisoInput {
  nombre: string;
}

export interface PermisoOutput {
  idPermiso: string;
  nombre: string;
}

@Injectable()
export class CreatePermisoUseCase {
  constructor(
    @Inject(PERMISO_REPOSITORY_TOKEN)
    private readonly permisoRepository: PermisoRepositoryPort,
  ) {}

  async execute(input: CreatePermisoInput): Promise<PermisoOutput> {
    const normalized = input.nombre.trim().toLowerCase();
    const existing = await this.permisoRepository.findByNombre(normalized);

    if (existing) {
      throw new ConflictException(`El permiso "${normalized}" ya existe.`);
    }

    let permiso: Permiso;
    try {
      permiso = Permiso.create({
        idPermiso: randomUUID(),
        nombre: normalized,
      });
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Datos de permiso inválidos.',
      );
    }

    await this.permisoRepository.save(permiso);

    return {
      idPermiso: permiso.idPermiso,
      nombre: permiso.nombre,
    };
  }
}
