import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../shared/infrastructure/prisma/prisma.service.js';
import type { SessionRepositoryPort } from '../../../domain/ports/session.repository.port.js';
import { Session } from '../../../domain/entities/session.entity.js';
import { SessionMapper } from './session.mapper.js';

@Injectable()
export class SessionPrismaRepository implements SessionRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findById(idSesion: string): Promise<Session | null> {
    const raw = await this.prisma.sesion.findUnique({
      where: { idSesion },
    });
    return raw ? SessionMapper.toDomain(raw) : null;
  }

  async findByTokenHash(refreshTokenHash: string): Promise<Session | null> {
    const raw = await this.prisma.sesion.findUnique({
      where: { refreshTokenHash },
    });
    return raw ? SessionMapper.toDomain(raw) : null;
  }

  async save(session: Session): Promise<void> {
    const data = SessionMapper.toPersistence(session);
    await this.prisma.sesion.create({
      data,
    });
  }

  async update(session: Session): Promise<void> {
    const data = SessionMapper.toPersistence(session);
    await this.prisma.sesion.update({
      where: { idSesion: data.idSesion },
      data: {
        isRevoked: data.isRevoked,
        fechaExpiracion: data.fechaExpiracion,
        refreshTokenHash: data.refreshTokenHash,
      },
    });
  }

  async revokeAllForUser(idUsuario: string): Promise<void> {
    await this.prisma.sesion.updateMany({
      where: { idUsuario, isRevoked: false },
      data: { isRevoked: true },
    });
  }
}
