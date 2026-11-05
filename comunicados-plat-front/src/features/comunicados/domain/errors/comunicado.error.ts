export class ComunicadoDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ComunicadoDomainError';
  }
}

