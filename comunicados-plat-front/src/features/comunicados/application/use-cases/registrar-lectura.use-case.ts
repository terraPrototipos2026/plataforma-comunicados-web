import type { ComunicadoRepository } from '../../domain/ports/comunicado.repository';

export class RegistrarLecturaUseCase {
  private readonly repository: ComunicadoRepository;

  constructor(repository: ComunicadoRepository) {
    this.repository = repository;
  }

  async execute(idComunicado: string, confirmar: boolean = true): Promise<{ message: string }> {
    return this.repository.registrarLectura(idComunicado, confirmar);
  }
}
