import { Session } from '../entities/session.entity.js';

export interface SessionRepositoryPort {
  findById(idSesion: string): Promise<Session | null>;
  findByTokenHash(refreshTokenHash: string): Promise<Session | null>;
  save(session: Session): Promise<void>;
  update(session: Session): Promise<void>;
  revokeAllForUser(idUsuario: string): Promise<void>;
}

