import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { COMUNICADO_REPOSITORY_TOKEN } from '../../infrastructure/tokens.js';
import type { ComunicadoRepositoryPort } from '../../domain/ports/comunicado.repository.port.js';

@Injectable()
export class AnularComunicadoUseCase {
  constructor(
    @Inject(COMUNICADO_REPOSITORY_TOKEN)
    private readonly repository: ComunicadoRepositoryPort,
  ) {}

  async execute(idComunicado: string): Promise<{ message: string }> {
    const existing = await this.repository.findById(idComunicado);
    if (!existing) {
      throw new NotFoundException(`El comunicado con ID "${idComunicado}" no existe.`);
    }

    await this.repository.anular(idComunicado);
    return {
      message: `Comunicado ${existing.codigo} anulado exitosamente.`,
    };
  }
}

