export class AuthDomainError extends Error {
  public readonly code: string;

  constructor(message: string, code = 'AUTH_DOMAIN_ERROR') {
    super(message);
    this.name = 'AuthDomainError';
    this.code = code;
  }
}
