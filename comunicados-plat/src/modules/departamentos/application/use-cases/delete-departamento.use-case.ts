import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DEPARTAMENTO_REPOSITORY_TOKEN } from '../../infrastructure/tokens.js';
import type { DepartamentoRepositoryPort } from '../../domain/ports/departamento.repository.port.js';

@Injectable()
export class DeleteDepartamentoUseCase {
  constructor(
    @Inject(DEPARTAMENTO_REPOSITORY_TOKEN)
    private readonly departamentoRepository: DepartamentoRepositoryPort,
  ) {}

  async execute(idDepartamento: string): Promise<{ message: string }> {
    const existing = await this.departamentoRepository.findById(idDepartamento);
    if (!existing) {
      throw new NotFoundException(
        `El departamento con ID "${idDepartamento}" no fue encontrado.`,
      );
    }

    const hasUsers = await this.departamentoRepository.hasAssignedUsers(idDepartamento);
    if (hasUsers) {
      throw new ConflictException(
        `No se puede eliminar el departamento "${existing.nombre}" porque tiene usuarios asignados.`,
      );
    }

    await this.departamentoRepository.delete(idDepartamento);

    return {
      message: `Departamento "${existing.nombre}" eliminado correctamente.`,
    };
  }
}
