import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ROL_REPOSITORY_TOKEN } from '../../infrastructure/tokens.js';
import type { RolRepositoryPort } from '../../domain/ports/rol.repository.port.js';
import type { RolOutput } from './create-rol.use-case.js';

export interface UpdateRolInput {
  idRol: string;
  nombre: string;
}

@Injectable()
export class UpdateRolUseCase {
  constructor(
    @Inject(ROL_REPOSITORY_TOKEN)
    private readonly rolRepository: RolRepositoryPort,
  ) {}

  async execute(input: UpdateRolInput): Promise<RolOutput> {
    const current = await this.rolRepository.findById(input.idRol);
    if (!current) {
      throw new NotFoundException(`El rol con ID "${input.idRol}" no fue encontrado.`);
    }

    const normalized = input.nombre.trim().toLowerCase();
    const collision = await this.rolRepository.findByNombre(normalized);

    if (collision && collision.idRol !== current.idRol) {
      throw new ConflictException(`El nombre de rol "${normalized}" ya está en uso.`);
    }

    try {
      current.rename(normalized);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Nombre de rol inválido.',
      );
    }

    await this.rolRepository.save(current);

    return {
      idRol: current.idRol,
      nombre: current.nombre,
      permisos: current.permisos,
    };
  }
}
