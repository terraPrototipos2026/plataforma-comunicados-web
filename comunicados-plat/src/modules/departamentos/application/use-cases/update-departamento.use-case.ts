import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DEPARTAMENTO_REPOSITORY_TOKEN } from '../../infrastructure/tokens.js';
import type { DepartamentoRepositoryPort } from '../../domain/ports/departamento.repository.port.js';
import type { DepartamentoOutput } from './create-departamento.use-case.js';

export interface UpdateDepartamentoInput {
  idDepartamento: string;
  nombre?: string;
  idSucursal?: string | null;
}

@Injectable()
export class UpdateDepartamentoUseCase {
  constructor(
    @Inject(DEPARTAMENTO_REPOSITORY_TOKEN)
    private readonly departamentoRepository: DepartamentoRepositoryPort,
  ) {}

  async execute(input: UpdateDepartamentoInput): Promise<DepartamentoOutput> {
    const current = await this.departamentoRepository.findById(input.idDepartamento);
    if (!current) {
      throw new NotFoundException(
        `El departamento con ID "${input.idDepartamento}" no fue encontrado.`,
      );
    }

    if (input.nombre !== undefined) {
      const normalized = input.nombre.trim().toLowerCase();
      const collision = await this.departamentoRepository.findByNombre(normalized);

      if (collision && collision.idDepartamento !== current.idDepartamento) {
        throw new ConflictException(`El nombre de departamento "${normalized}" ya está en uso.`);
      }

      try {
        current.rename(normalized);
      } catch (error) {
        throw new BadRequestException(
          error instanceof Error ? error.message : 'Nombre de departamento inválido.',
        );
      }
    }

    if (input.idSucursal !== undefined) {
      current.assignSucursal(input.idSucursal);
    }

    await this.departamentoRepository.save(current);

    return {
      idDepartamento: current.idDepartamento,
      nombre: current.nombre,
      idSucursal: current.idSucursal,
    };
  }
}
