import type { UsuarioRepository } from '../../domain/ports/usuario.repository';

export class DeleteUsuarioUseCase {
  private readonly repository: UsuarioRepository;

  constructor(repository: UsuarioRepository) {
    this.repository = repository;
  }

  async execute(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}
