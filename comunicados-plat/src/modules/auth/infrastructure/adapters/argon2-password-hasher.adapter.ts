import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { PasswordHasherPort } from '../../application/ports/password-hasher.port.js';

@Injectable()
export class Argon2PasswordHasherAdapter implements PasswordHasherPort {
  async hash(plainText: string): Promise<string> {
    return argon2.hash(plainText, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 1,
    });
  }

  async compare(plainText: string, hash: string): Promise<boolean> {
    return argon2.verify(hash, plainText);
  }
}

