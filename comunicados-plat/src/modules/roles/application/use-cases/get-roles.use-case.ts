import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ROL_REPOSITORY_TOKEN } from '../../infrastructure/tokens.js';
import type { RolRepositoryPort } from '../../domain/ports/rol.repository.port.js';
import type { RolOutput } from './create-rol.use-case.js';

@Injectable()
export class GetRolesUseCase {
  constructor(
    @Inject(ROL_REPOSITORY_TOKEN)
    private readonly rolRepository: RolRepositoryPort,
  ) {}

  async findAll(): Promise<RolOutput[]> {
    const list = await this.rolRepository.findAll();
    return list.map((item) => ({
      idRol: item.idRol,
      nombre: item.nombre,
      permisos: item.permisos,
    }));
  }

  async findById(idRol: string): Promise<RolOutput> {
    const item = await this.rolRepository.findById(idRol);
    if (!item) {
      throw new NotFoundException(`El rol con ID "${idRol}" no fue encontrado.`);
    }

    return {
      idRol: item.idRol,
      nombre: item.nombre,
      permisos: item.permisos,
    };
  }
}
