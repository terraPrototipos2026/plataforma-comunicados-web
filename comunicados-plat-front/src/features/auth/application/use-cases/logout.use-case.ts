import type { AuthRepository } from '../../domain/ports/auth.repository';

export class LogoutUseCase {
  private readonly repository: AuthRepository;

  constructor(repository: AuthRepository) {
    this.repository = repository;
  }

  async execute(): Promise<void> {
    await this.repository.logout();
  }
}
