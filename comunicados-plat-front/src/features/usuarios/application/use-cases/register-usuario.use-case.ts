import { UsuarioRules } from '../../domain/models/usuario.model';
import { UsuarioValidationError } from '../../domain/errors/usuario.error';
import type { UsuarioRepository } from '../../domain/ports/usuario.repository';
import type { RegisterUsuarioInput } from '../dtos/usuario.dto';

export class RegisterUsuarioUseCase {
  private readonly repository: UsuarioRepository;

  constructor(repository: UsuarioRepository) {
    this.repository = repository;
  }

  async execute(input: RegisterUsuarioInput): Promise<{ idUsuario: string; correo: string }> {
    if (!UsuarioRules.validarNombre(input.nombre)) {
      throw new UsuarioValidationError('El nombre debe tener al menos 3 caracteres.');
    }

    if (!UsuarioRules.validarCorreo(input.correo)) {
      throw new UsuarioValidationError('El correo electrónico no tiene un formato válido.');
    }

    if (!UsuarioRules.validarPassword(input.password)) {
      throw new UsuarioValidationError('La contraseña debe contener al menos 6 caracteres.');
    }

    if (!input.rol.trim()) {
      throw new UsuarioValidationError('Debe seleccionar un rol para el usuario.');
    }

    if (!input.departamento.trim()) {
      throw new UsuarioValidationError('Debe seleccionar un departamento para el usuario.');
    }

    return this.repository.register({
      nombre: input.nombre.trim(),
      correo: input.correo.trim().toLowerCase(),
      password: input.password,
      telefono: input.telefono?.trim() || undefined,
      rol: input.rol.trim(),
      departamento: input.departamento.trim(),
    });
  }
}
