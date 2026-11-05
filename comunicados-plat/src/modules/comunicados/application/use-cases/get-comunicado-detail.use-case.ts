import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { COMUNICADO_REPOSITORY_TOKEN } from '../../infrastructure/tokens.js';
import type { ComunicadoRepositoryPort } from '../../domain/ports/comunicado.repository.port.js';
import type { Comunicado } from '../../domain/entities/comunicado.entity.js';

@Injectable()
export class GetComunicadoDetailUseCase {
  constructor(
    @Inject(COMUNICADO_REPOSITORY_TOKEN)
    private readonly repository: ComunicadoRepositoryPort,
  ) {}

  async execute(idComunicado: string): Promise<Comunicado> {
    const item = await this.repository.findById(idComunicado);
    if (!item) {
      throw new NotFoundException(`El comunicado con ID "${idComunicado}" no fue encontrado.`);
    }
    return item;
  }
}

