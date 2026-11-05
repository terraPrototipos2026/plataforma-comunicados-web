export class PermisoDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PermisoDomainError';
  }
}

