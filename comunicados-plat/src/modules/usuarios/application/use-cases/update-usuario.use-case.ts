import {
  Inject,
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { USUARIO_REPOSITORY_TOKEN } from '../../infrastructure/tokens.js';
import type { UsuarioRepositoryPort } from '../../domain/ports/usuario.repository.port.js';
import { Usuario } from '../../domain/entities/usuario.entity.js';

export interface UpdateUsuarioInput {
  idUsuario: string;
  nombre?: string;
  correo?: string;
  telefono?: string;
  rol?: string;
  departamento?: string;
}

@Injectable()
export class UpdateUsuarioUseCase {
  constructor(
    @Inject(USUARIO_REPOSITORY_TOKEN)
    private readonly usuarioRepo: UsuarioRepositoryPort,
  ) {}

  async execute(input: UpdateUsuarioInput): Promise<Usuario> {
    const usuario = await this.usuarioRepo.findById(input.idUsuario);
    if (!usuario) {
      throw new NotFoundException(`El usuario con ID ${input.idUsuario} no existe.`);
    }

    if (input.correo && input.correo.toLowerCase() !== usuario.correo.toLowerCase()) {
      const existingEmail = await this.usuarioRepo.findByEmail(input.correo);
      if (existingEmail && existingEmail.idUsuario !== input.idUsuario) {
        throw new ConflictException('El correo ya se encuentra en uso por otro usuario.');
      }
    }

    let idRol: string | undefined;
    if (input.rol) {
      const foundRolId = await this.usuarioRepo.findRoleIdByName(input.rol);
      if (!foundRolId) {
        throw new NotFoundException(`El rol "${input.rol}" no existe.`);
      }
      idRol = foundRolId;
    }

    let idDepartamento: string | undefined;
    if (input.departamento) {
      const foundDeptId = await this.usuarioRepo.findDepartmentIdByName(input.departamento);
      if (!foundDeptId) {
        throw new NotFoundException(`El departamento "${input.departamento}" no existe.`);
      }
      idDepartamento = foundDeptId;
    }

    return this.usuarioRepo.update(input.idUsuario, {
      nombre: input.nombre?.trim(),
      correo: input.correo?.trim().toLowerCase(),
      telefono: input.telefono?.trim(),
      idRol,
      idDepartamento,
    });
  }
}

