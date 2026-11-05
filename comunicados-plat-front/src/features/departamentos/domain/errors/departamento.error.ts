export class DepartamentoDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DepartamentoDomainError';
  }
}

