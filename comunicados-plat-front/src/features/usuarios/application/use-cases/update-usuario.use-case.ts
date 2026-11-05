import { UsuarioRules } from '../../domain/models/usuario.model';
import type { Usuario } from '../../domain/models/usuario.model';
import { UsuarioValidationError } from '../../domain/errors/usuario.error';
import type { UsuarioRepository } from '../../domain/ports/usuario.repository';
import type { UpdateUsuarioInput } from '../dtos/usuario.dto';

export class UpdateUsuarioUseCase {
  private readonly repository: UsuarioRepository;

  constructor(repository: UsuarioRepository) {
    this.repository = repository;
  }

  async execute(input: UpdateUsuarioInput): Promise<Usuario> {
    if (input.nombre !== undefined && !UsuarioRules.validarNombre(input.nombre)) {
      throw new UsuarioValidationError('El nombre debe tener al menos 3 caracteres.');
    }

    if (input.correo !== undefined && !UsuarioRules.validarCorreo(input.correo)) {
      throw new UsuarioValidationError('El correo electrónico no tiene un formato válido.');
    }

    return this.repository.update(input.idUsuario, {
      nombre: input.nombre?.trim(),
      correo: input.correo?.trim().toLowerCase(),
      telefono: input.telefono?.trim(),
      rol: input.rol?.trim(),
      departamento: input.departamento?.trim(),
    });
  }
}
