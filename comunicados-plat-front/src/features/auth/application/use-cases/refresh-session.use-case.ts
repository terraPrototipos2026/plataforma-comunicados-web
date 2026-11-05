import type { AuthSession } from '../../domain/models/auth-user.model';
import type { AuthRepository } from '../../domain/ports/auth.repository';

export class RefreshSessionUseCase {
  private readonly repository: AuthRepository;

  constructor(repository: AuthRepository) {
    this.repository = repository;
  }

  async execute(): Promise<AuthSession> {
    return this.repository.refresh();
  }
}
