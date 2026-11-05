import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { DEPARTAMENTO_REPOSITORY_TOKEN } from '../../infrastructure/tokens.js';
import type { DepartamentoRepositoryPort } from '../../domain/ports/departamento.repository.port.js';
import { Departamento } from '../../domain/entities/departamento.entity.js';

export interface CreateDepartamentoInput {
  nombre: string;
}

export interface DepartamentoOutput {
  idDepartamento: string;
  nombre: string;
}

@Injectable()
export class CreateDepartamentoUseCase {
  constructor(
    @Inject(DEPARTAMENTO_REPOSITORY_TOKEN)
    private readonly departamentoRepository: DepartamentoRepositoryPort,
  ) {}

  async execute(input: CreateDepartamentoInput): Promise<DepartamentoOutput> {
    const normalized = input.nombre.trim().toLowerCase();
    const existing = await this.departamentoRepository.findByNombre(normalized);

    if (existing) {
      throw new ConflictException(`El departamento "${normalized}" ya existe.`);
    }

    let departamento: Departamento;
    try {
      departamento = Departamento.create({
        idDepartamento: randomUUID(),
        nombre: normalized,
      });
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Datos de departamento inválidos.',
      );
    }

    await this.departamentoRepository.save(departamento);

    return {
      idDepartamento: departamento.idDepartamento,
      nombre: departamento.nombre,
    };
  }
}
