import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DEPARTAMENTO_REPOSITORY_TOKEN } from '../../infrastructure/tokens.js';
import type { DepartamentoRepositoryPort } from '../../domain/ports/departamento.repository.port.js';
import type { DepartamentoOutput } from './create-departamento.use-case.js';

@Injectable()
export class GetDepartamentosUseCase {
  constructor(
    @Inject(DEPARTAMENTO_REPOSITORY_TOKEN)
    private readonly departamentoRepository: DepartamentoRepositoryPort,
  ) {}

  async findAll(): Promise<DepartamentoOutput[]> {
    const list = await this.departamentoRepository.findAll();
    return list.map((item) => ({
      idDepartamento: item.idDepartamento,
      nombre: item.nombre,
    }));
  }

  async findById(idDepartamento: string): Promise<DepartamentoOutput> {
    const item = await this.departamentoRepository.findById(idDepartamento);
    if (!item) {
      throw new NotFoundException(`El departamento con ID "${idDepartamento}" no fue encontrado.`);
    }

    return {
      idDepartamento: item.idDepartamento,
      nombre: item.nombre,
    };
  }
}
