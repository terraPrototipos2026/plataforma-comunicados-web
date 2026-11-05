import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ROL_REPOSITORY_TOKEN } from '../../infrastructure/tokens.js';
import type { RolRepositoryPort } from '../../domain/ports/rol.repository.port.js';

@Injectable()
export class DeleteRolUseCase {
  constructor(
    @Inject(ROL_REPOSITORY_TOKEN)
    private readonly rolRepository: RolRepositoryPort,
  ) {}

  async execute(idRol: string): Promise<{ message: string }> {
    const existing = await this.rolRepository.findById(idRol);
    if (!existing) {
      throw new NotFoundException(`El rol con ID "${idRol}" no fue encontrado.`);
    }

    const hasUsers = await this.rolRepository.hasAssignedUsers(idRol);
    if (hasUsers) {
      throw new ConflictException(
        `No se puede eliminar el rol "${existing.nombre}" porque tiene usuarios asignados.`,
      );
    }

    await this.rolRepository.delete(idRol);

    return {
      message: `Rol "${existing.nombre}" eliminado correctamente.`,
    };
  }
}
