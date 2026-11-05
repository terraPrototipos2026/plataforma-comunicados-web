import { Inject, Injectable } from '@nestjs/common';
import { COMUNICADO_REPOSITORY_TOKEN } from '../../infrastructure/tokens.js';
import type { ComunicadoRepositoryPort } from '../../domain/ports/comunicado.repository.port.js';

@Injectable()
export class ConfirmarLecturaUseCase {
  constructor(
    @Inject(COMUNICADO_REPOSITORY_TOKEN)
    private readonly repository: ComunicadoRepositoryPort,
  ) {}

  async execute(idComunicado: string, idUsuario: string, confirmar: boolean = true): Promise<{ message: string }> {
    await this.repository.registrarLectura(idComunicado, idUsuario, confirmar);
    return {
      message: confirmar
        ? 'Lectura y recepción confirmadas correctamente.'
        : 'Visualización registrada correctamente.',
    };
  }
}

