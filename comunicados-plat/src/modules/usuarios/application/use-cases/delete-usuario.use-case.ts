import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { USUARIO_REPOSITORY_TOKEN } from '../../infrastructure/tokens.js';
import type { UsuarioRepositoryPort } from '../../domain/ports/usuario.repository.port.js';

@Injectable()
export class DeleteUsuarioUseCase {
  constructor(
    @Inject(USUARIO_REPOSITORY_TOKEN)
    private readonly usuarioRepo: UsuarioRepositoryPort,
  ) {}

  async execute(id: string): Promise<{ message: string }> {
    const usuario = await this.usuarioRepo.findById(id);
    if (!usuario) {
      throw new NotFoundException(`El usuario con ID ${id} no existe.`);
    }

    await this.usuarioRepo.delete(id);
    return { message: `Usuario "${usuario.nombre}" eliminado correctamente.` };
  }
}

