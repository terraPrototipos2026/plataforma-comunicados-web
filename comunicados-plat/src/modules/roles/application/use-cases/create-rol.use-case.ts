import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { ROL_REPOSITORY_TOKEN } from '../../infrastructure/tokens.js';
import { PERMISO_REPOSITORY_TOKEN } from '../../../permisos/infrastructure/tokens.js';
import type { RolRepositoryPort } from '../../domain/ports/rol.repository.port.js';
import type { PermisoRepositoryPort } from '../../../permisos/domain/ports/permiso.repository.port.js';
import { Rol, type RolPermisoItem } from '../../domain/entities/rol.entity.js';

export interface CreateRolInput {
  nombre: string;
  permisoIds?: string[];
}

export interface RolOutput {
  idRol: string;
  nombre: string;
  permisos: RolPermisoItem[];
}

@Injectable()
export class CreateRolUseCase {
  constructor(
    @Inject(ROL_REPOSITORY_TOKEN)
    private readonly rolRepository: RolRepositoryPort,
    @Inject(PERMISO_REPOSITORY_TOKEN)
    private readonly permisoRepository: PermisoRepositoryPort,
  ) {}

  async execute(input: CreateRolInput): Promise<RolOutput> {
    const normalized = input.nombre.trim().toLowerCase();
    const existing = await this.rolRepository.findByNombre(normalized);

    if (existing) {
      throw new ConflictException(`El rol "${normalized}" ya existe.`);
    }

    const uniquePermisoIds = Array.from(new Set(input.permisoIds ?? []));
    if (uniquePermisoIds.length > 0) {
      const foundPermisos = await this.permisoRepository.findByIds(uniquePermisoIds);
      if (foundPermisos.length !== uniquePermisoIds.length) {
        throw new NotFoundException('Uno o más permisos especificados no existen.');
      }
    }

    let rol: Rol;
    try {
      rol = Rol.create({
        idRol: randomUUID(),
        nombre: normalized,
      });
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Datos de rol inválidos.',
      );
    }

    await this.rolRepository.save(rol);

    if (uniquePermisoIds.length > 0) {
      rol = await this.rolRepository.syncPermisos(rol.idRol, uniquePermisoIds);
    }

    return {
      idRol: rol.idRol,
      nombre: rol.nombre,
      permisos: rol.permisos,
    };
  }
}
