import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { USUARIO_REPOSITORY_TOKEN } from '../../infrastructure/tokens.js';
import type { UsuarioRepositoryPort } from '../../domain/ports/usuario.repository.port.js';
import { Usuario } from '../../domain/entities/usuario.entity.js';

@Injectable()
export class GetUsuariosUseCase {
  constructor(
    @Inject(USUARIO_REPOSITORY_TOKEN)
    private readonly usuarioRepo: UsuarioRepositoryPort,
  ) {}

  async findAll(): Promise<Usuario[]> {
    return this.usuarioRepo.findAll();
  }

  async findById(id: string): Promise<Usuario> {
    const usuario = await this.usuarioRepo.findById(id);
    if (!usuario) {
      throw new NotFoundException(`El usuario con ID ${id} no existe.`);
    }
    return usuario;
  }
}

