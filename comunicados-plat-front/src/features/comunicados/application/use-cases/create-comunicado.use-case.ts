import { ComunicadoDomainError } from '../../domain/errors/comunicado.error';
import {
  ComunicadoRules,
  type Comunicado,
} from '../../domain/models/comunicado.model';
import type { ComunicadoRepository } from '../../domain/ports/comunicado.repository';
import type { CreateComunicadoInput } from '../dtos/comunicado.dto';

export class CreateComunicadoUseCase {
  private readonly repository: ComunicadoRepository;

  constructor(repository: ComunicadoRepository) {
    this.repository = repository;
  }

  async execute(input: CreateComunicadoInput): Promise<Comunicado> {
    if (!ComunicadoRules.validarTitulo(input.titulo)) {
      throw new ComunicadoDomainError(
        'El título del comunicado debe tener entre 3 y 150 caracteres.',
      );
    }

    return this.repository.create({
      ...input,
      titulo: input.titulo.trim(),
      extracto: input.extracto?.trim(),
      medioPublicacion: input.medioPublicacion ?? 'AVANZADO',
      prioridad: input.prioridad ?? 'NORMAL',
      estado: input.estado ?? 'PUBLICADO',
      tipoAlcance: input.tipoAlcance ?? 'TODA_EMPRESA',
    });
  }
}
