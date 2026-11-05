import { Sesion as PrismaSessionModel } from '@prisma/client';
import { Session } from '../../../domain/entities/session.entity.js';

export class SessionMapper {
  public static toDomain(raw: PrismaSessionModel): Session {
    return Session.reconstitute({
      idSesion: raw.idSesion,
      idUsuario: raw.idUsuario,
      refreshTokenHash: raw.refreshTokenHash,
      fechaInicio: raw.fechaInicio,
      fechaExpiracion: raw.fechaExpiracion,
      isRevoked: raw.isRevoked,
      userAgent: raw.userAgent,
      ipAddress: raw.ipAddress,
    });
  }

  public static toPersistence(session: Session): PrismaSessionModel {
    return {
      idSesion: session.idSesion,
      idUsuario: session.idUsuario,
      refreshTokenHash: session.refreshTokenHash,
      fechaInicio: session.fechaInicio,
      fechaExpiracion: session.fechaExpiracion,
      isRevoked: session.isRevoked,
      userAgent: session.userAgent ?? null,
      ipAddress: session.ipAddress ?? null,
    };
  }
}

