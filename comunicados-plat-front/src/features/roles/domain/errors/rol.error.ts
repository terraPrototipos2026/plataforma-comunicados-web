export class RolDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RolDomainError';
  }
}

