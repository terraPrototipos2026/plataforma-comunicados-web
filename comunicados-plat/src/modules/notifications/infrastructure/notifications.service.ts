import { Inject, Injectable, Logger } from '@nestjs/common';
import type { Messaging, Message } from 'firebase-admin/messaging';
import { FIREBASE_MESSAGING } from '../../../shared/infrastructure/firebase/firebase.provider.js';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service.js';
import type { RegisterDeviceDto } from '../application/dtos/register-device.dto.js';

export interface MulticastResult {
  successCount: number;
  failureCount: number;
  message?: string;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @Inject(FIREBASE_MESSAGING)
    private readonly messaging: Messaging,
    private readonly prisma: PrismaService,
  ) {}

  // Registrar o actualizar un dispositivo (FCM token)
  async registerDevice(idUsuario: string, dto: RegisterDeviceDto) {
    return this.prisma.pushDevice.upsert({
      where: { token: dto.token },
      update: {
        idUsuario,
        platform: dto.platform,
      },
      create: {
        idUsuario,
        token: dto.token,
        platform: dto.platform,
      },
    });
  }

  // Desvincular un dispositivo
  async unregisterDevice(idUsuario: string, token: string) {
    const result = await this.prisma.pushDevice.deleteMany({
      where: {
        idUsuario,
        token,
      },
    });
    return { removed: result.count > 0 };
  }

  // Listar dispositivos activos de un usuario
  async getUserDevices(idUsuario: string) {
    return this.prisma.pushDevice.findMany({
      where: { idUsuario },
      select: {
        id: true,
        platform: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  // Enviar a un usuario en todos sus dispositivos
  async sendToUser(idUsuario: string, title: string, body: string, url?: string): Promise<MulticastResult> {
    const devices = await this.prisma.pushDevice.findMany({
      where: { idUsuario },
      select: { token: true },
    });

    if (devices.length === 0) {
      return {
        successCount: 0,
        failureCount: 0,
        message: 'El usuario no tiene dispositivos registrados.',
      };
    }

    const tokens = [...new Set(devices.map((d) => d.token))];
    return this.sendMulticast(tokens, title, body, url);
  }

  // Enviar a múltiples usuarios (ej: destinatarios de un comunicado)
  async sendToMultipleUsers(userIds: string[], title: string, body: string, url?: string): Promise<MulticastResult> {
    if (userIds.length === 0) {
      return { successCount: 0, failureCount: 0 };
    }

    const devices = await this.prisma.pushDevice.findMany({
      where: { idUsuario: { in: userIds } },
      select: { token: true },
    });

    const tokens = [...new Set(devices.map((d) => d.token))];
    if (tokens.length === 0) {
      return { successCount: 0, failureCount: 0, message: 'Ningún destinatario tiene dispositivos registrados.' };
    }

    return this.sendMulticast(tokens, title, body, url);
  }

  // Enviar directamente a un token específico
  async sendToToken(token: string, title: string, body: string, url?: string) {
    const message: Message = {
      token,
      notification: { title, body },
      data: url ? { url } : undefined,
      webpush: url
        ? {
            fcmOptions: { link: url },
          }
        : undefined,
    };

    return this.messaging.send(message);
  }

  // Envío en lotes de hasta 500 destinatarios con limpieza de tokens caducados
  private async sendMulticast(tokens: string[], title: string, body: string, url?: string): Promise<MulticastResult> {
    let successCount = 0;
    let failureCount = 0;

    for (let i = 0; i < tokens.length; i += 500) {
      const batch = tokens.slice(i, i + 500);

      try {
        const response = await this.messaging.sendEachForMulticast({
          tokens: batch,
          notification: {
            title,
            body,
          },
          data: url ? { url } : {},
          webpush: {
            fcmOptions: url ? { link: url } : undefined,
          },
        });

        successCount += response.successCount;
        failureCount += response.failureCount;

        const tokensToDelete: string[] = [];

        response.responses.forEach((res, idx) => {
          if (!res.success) {
            const errorCode = res.error?.code;
            this.logger.warn(`FCM rechazó token [${batch[idx].slice(0, 10)}...]: ${errorCode}`);

            if (
              errorCode === 'messaging/registration-token-not-registered' ||
              errorCode === 'messaging/invalid-registration-token'
            ) {
              tokensToDelete.push(batch[idx]);
            }
          }
        });

        if (tokensToDelete.length > 0) {
          await this.prisma.pushDevice.deleteMany({
            where: { token: { in: tokensToDelete } },
          });
          this.logger.log(`Se eliminaron ${tokensToDelete.length} dispositivos caducados/inválidos.`);
        }
      } catch (err) {
        this.logger.error('Error al ejecutar sendEachForMulticast en Firebase:', err);
        failureCount += batch.length;
      }
    }

    return { successCount, failureCount };
  }
}

