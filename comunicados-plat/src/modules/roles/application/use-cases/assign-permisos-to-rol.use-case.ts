import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ROL_REPOSITORY_TOKEN } from '../../infrastructure/tokens.js';
import { PERMISO_REPOSITORY_TOKEN } from '../../../permisos/infrastructure/tokens.js';
import type { RolRepositoryPort } from '../../domain/ports/rol.repository.port.js';
import type { PermisoRepositoryPort } from '../../../permisos/domain/ports/permiso.repository.port.js';
import type { RolOutput } from './create-rol.use-case.js';

export interface AssignPermisosToRolInput {
  idRol: string;
  permisoIds: string[];
}

@Injectable()
export class AssignPermisosToRolUseCase {
  constructor(
    @Inject(ROL_REPOSITORY_TOKEN)
    private readonly rolRepository: RolRepositoryPort,
    @Inject(PERMISO_REPOSITORY_TOKEN)
    private readonly permisoRepository: PermisoRepositoryPort,
  ) {}

  async execute(input: AssignPermisosToRolInput): Promise<RolOutput> {
    const current = await this.rolRepository.findById(input.idRol);
    if (!current) {
      throw new NotFoundException(`El rol con ID "${input.idRol}" no fue encontrado.`);
    }

    const uniqueIds = Array.from(new Set(input.permisoIds));
    if (uniqueIds.length > 0) {
      const foundPermisos = await this.permisoRepository.findByIds(uniqueIds);
      if (foundPermisos.length !== uniqueIds.length) {
        throw new NotFoundException('Uno o más permisos especificados no existen.');
      }
    }

    const updated = await this.rolRepository.syncPermisos(input.idRol, uniqueIds);

    return {
      idRol: updated.idRol,
      nombre: updated.nombre,
      permisos: updated.permisos,
    };
  }
}
