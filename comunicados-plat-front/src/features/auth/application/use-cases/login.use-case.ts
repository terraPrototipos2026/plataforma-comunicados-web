import { AuthDomainError } from '../../domain/errors/auth.error';
import { AuthRules, type AuthSession } from '../../domain/models/auth-user.model';
import type { AuthRepository } from '../../domain/ports/auth.repository';
import type { LoginInput } from '../dtos/login.dto';

export class LoginUseCase {
  private readonly repository: AuthRepository;

  constructor(repository: AuthRepository) {
    this.repository = repository;
  }

  async execute(input: LoginInput): Promise<AuthSession> {
    const normalizedEmail = input.correo.trim().toLowerCase();

    if (!AuthRules.isValidEmail(normalizedEmail)) {
      throw new AuthDomainError(
        'Ingresa un correo electrónico corporativo con formato válido.',
        'INVALID_EMAIL_FORMAT',
      );
    }

    if (!AuthRules.isValidPasswordInput(input.password)) {
      throw new AuthDomainError(
        'La contraseña no puede estar vacía.',
        'EMPTY_PASSWORD',
      );
    }

    return this.repository.login({
      correo: normalizedEmail,
      password: input.password,
    });
  }
}
