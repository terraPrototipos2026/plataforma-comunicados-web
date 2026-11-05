import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes, createHash } from 'node:crypto';
import {
  TokenServicePort,
  AccessTokenPayload,
} from '../../application/ports/token-service.port.js';

@Injectable()
export class JwtTokenServiceAdapter implements TokenServicePort {
  constructor(private readonly jwtService: JwtService) {}

  async generateAccessToken(payload: AccessTokenPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });
  }

  generateRefreshToken(): string {
    return randomBytes(64).toString('hex');
  }

  async verifyAccessToken(token: string): Promise<AccessTokenPayload> {
    return this.jwtService.verifyAsync<AccessTokenPayload>(token);
  }

  async hashToken(token: string): Promise<string> {
    return createHash('sha256').update(token).digest('hex');
  }
}

