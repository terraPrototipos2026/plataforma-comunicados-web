import type { Usuario } from '../../domain/models/usuario.model';
import type { UsuarioRepository } from '../../domain/ports/usuario.repository';

export class GetUsuariosUseCase {
  private readonly repository: UsuarioRepository;

  constructor(repository: UsuarioRepository) {
    this.repository = repository;
  }

  async execute(): Promise<Usuario[]> {
    return this.repository.findAll();
  }

  async executeById(id: string): Promise<Usuario> {
    return this.repository.findById(id);
  }
}
