export interface AccessTokenPayload {
  sub: string;
  correo: string;
  rol: string;
  permisos: string[];
}

export interface GeneratedTokens {
  accessToken: string;
  refreshToken: string;
}

export interface TokenServicePort {
  generateAccessToken(payload: AccessTokenPayload): Promise<string>;
  generateRefreshToken(): string;
  verifyAccessToken(token: string): Promise<AccessTokenPayload>;
  hashToken(token: string): Promise<string>;
}

