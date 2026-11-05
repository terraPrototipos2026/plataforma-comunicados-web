import { Inject, Injectable } from '@nestjs/common';
import { COMUNICADO_REPOSITORY_TOKEN } from '../../infrastructure/tokens.js';
import type {
  ComunicadoRepositoryPort,
  FilterComunicadosParams,
} from '../../domain/ports/comunicado.repository.port.js';
import type { Comunicado } from '../../domain/entities/comunicado.entity.js';

@Injectable()
export class GetComunicadosUseCase {
  constructor(
    @Inject(COMUNICADO_REPOSITORY_TOKEN)
    private readonly repository: ComunicadoRepositoryPort,
  ) {}

  async execute(filters?: FilterComunicadosParams): Promise<Comunicado[]> {
    return this.repository.findAll(filters);
  }
}

