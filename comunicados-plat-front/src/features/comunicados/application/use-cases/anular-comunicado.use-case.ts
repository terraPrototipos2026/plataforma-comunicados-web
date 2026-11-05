import type { ComunicadoRepository } from '../../domain/ports/comunicado.repository';

export class AnularComunicadoUseCase {
  private readonly repository: ComunicadoRepository;

  constructor(repository: ComunicadoRepository) {
    this.repository = repository;
  }

  async execute(idComunicado: string): Promise<{ message: string }> {
    return this.repository.anular(idComunicado);
  }
}
