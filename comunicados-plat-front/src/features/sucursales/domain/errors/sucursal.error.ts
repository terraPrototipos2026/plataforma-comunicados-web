export class SucursalDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SucursalDomainError';
  }
}

