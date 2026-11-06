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

export interface PushNotificationOptions {
  idComunicado?: string;
  codigo?: string;
  prioridad?: 'NORMAL' | 'IMPORTANTE' | 'URGENTE' | string;
  url?: string;
  imageUrl?: string;
  data?: Record<string, string>;
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

  // Obtener historial de notificaciones con estado de lectura del usuario
  async getHistory(idUsuario?: string) {
    const notificaciones = await this.prisma.notificacion.findMany({
      where: {
        comunicado: {
          estado: { in: ['PUBLICADO', 'PROGRAMADO'] },
        },
      },
      include: {
        comunicado: {
          select: {
            idComunicado: true,
            codigo: true,
            titulo: true,
            extracto: true,
            prioridad: true,
            fechaPublicacion: true,
            tipoAlcance: true,
            medioPublicacion: true,
            imagenes: {
              where: { esPortada: true },
              select: { urlImagen: true },
              take: 1,
            },
            destinatarios: idUsuario
              ? {
                  where: { idUsuario },
                  select: {
                    estadoLectura: true,
                    fechaVisualizacion: true,
                    fechaConfirmacion: true,
                  },
                }
              : false,
          },
        },
      },
      orderBy: { fechaEnvio: 'desc' },
      take: 30,
    });

    const items = notificaciones.map((n) => {
      const dest = n.comunicado.destinatarios?.[0];
      const isConfirmed = dest?.estadoLectura === 'CONFIRMADO';
      return {
        idNotificacion: n.idNotificacion,
        tipo: n.tipo,
        estado: n.estado,
        fechaEnvio: n.fechaEnvio,
        leido: isConfirmed,
        comunicado: {
          idComunicado: n.comunicado.idComunicado,
          codigo: n.comunicado.codigo,
          titulo: n.comunicado.titulo,
          extracto: n.comunicado.extracto,
          prioridad: n.comunicado.prioridad,
          fechaPublicacion: n.comunicado.fechaPublicacion,
          tipoAlcance: n.comunicado.tipoAlcance,
          portadaUrl: n.comunicado.imagenes?.[0]?.urlImagen ?? null,
        },
      };
    });

    const unreadCount = items.filter((item) => !item.leido).length;

    return {
      total: items.length,
      unreadCount,
      notifications: items,
    };
  }

  // Enviar a un usuario en todos sus dispositivos (Web, Android, iOS)
  async sendToUser(
    idUsuario: string,
    title: string,
    body: string,
    options?: PushNotificationOptions | string,
  ): Promise<MulticastResult> {
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
    return this.sendMulticast(tokens, title, body, options);
  }

  // Enviar a múltiples usuarios (destinatarios de comunicados oficiales)
  async sendToMultipleUsers(
    userIds: string[],
    title: string,
    body: string,
    options?: PushNotificationOptions | string,
  ): Promise<MulticastResult> {
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

    return this.sendMulticast(tokens, title, body, options);
  }

  // Enviar directamente a un token específico (Multiplataforma)
  async sendToToken(token: string, title: string, body: string, options?: PushNotificationOptions | string) {
    const opts = typeof options === 'string' ? { url: options } : (options ?? {});
    const url = opts.url ?? '/dashboard';
    const isUrgente = opts.prioridad === 'URGENTE';

    const dataPayload: Record<string, string> = {
      title,
      body,
      url,
      prioridad: opts.prioridad ?? 'NORMAL',
      click_action: 'FLUTTER_NOTIFICATION_CLICK',
      ...(opts.imageUrl ? { imageUrl: opts.imageUrl } : {}),
      ...(opts.idComunicado ? { idComunicado: opts.idComunicado } : {}),
      ...(opts.codigo ? { codigo: opts.codigo } : {}),
      ...(opts.data ?? {}),
    };

    const message: Message = {
      token,
      notification: {
        title,
        body,
        ...(opts.imageUrl ? { imageUrl: opts.imageUrl } : {}),
      },
      data: dataPayload,
      android: {
        priority: 'high',
        notification: {
          channelId: isUrgente ? 'comunicados_urgentes' : 'comunicados_generales',
          sound: 'default',
          clickAction: 'OPEN_COMUNICADO',
          ...(opts.imageUrl ? { imageUrl: opts.imageUrl } : {}),
        },
      },
      apns: {
        headers: { 'apns-priority': '10' },
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
            contentAvailable: true,
          },
        },
        ...(opts.imageUrl ? { fcmOptions: { imageUrl: opts.imageUrl } } : {}),
      },
      webpush: {
        fcmOptions: { link: url },
        notification: {
          requireInteraction: isUrgente,
          ...(opts.imageUrl ? { image: opts.imageUrl } : {}),
        },
      },
    };

    return this.messaging.send(message);
  }

  // Envío en lotes de hasta 500 destinatarios con payload nativo especializado (Web, Android, iOS)
  private async sendMulticast(
    tokens: string[],
    title: string,
    body: string,
    options?: PushNotificationOptions | string,
  ): Promise<MulticastResult> {
    let successCount = 0;
    let failureCount = 0;

    const opts = typeof options === 'string' ? { url: options } : (options ?? {});
    const url = opts.url ?? '/dashboard';
    const isUrgente = opts.prioridad === 'URGENTE';

    const dataPayload: Record<string, string> = {
      title,
      body,
      url,
      prioridad: opts.prioridad ?? 'NORMAL',
      click_action: 'FLUTTER_NOTIFICATION_CLICK',
      ...(opts.imageUrl ? { imageUrl: opts.imageUrl } : {}),
      ...(opts.idComunicado ? { idComunicado: opts.idComunicado } : {}),
      ...(opts.codigo ? { codigo: opts.codigo } : {}),
      ...(opts.data ?? {}),
    };

    for (let i = 0; i < tokens.length; i += 500) {
      const batch = tokens.slice(i, i + 500);

      try {
        const response = await this.messaging.sendEachForMulticast({
          tokens: batch,
          notification: {
            title,
            body,
            ...(opts.imageUrl ? { imageUrl: opts.imageUrl } : {}),
          },
          data: dataPayload,
          // Configuración nativa para Android (sonido, canales de prioridad, deep linking, imagen)
          android: {
            priority: 'high',
            notification: {
              channelId: isUrgente ? 'comunicados_urgentes' : 'comunicados_generales',
              sound: 'default',
              notificationCount: 1,
              clickAction: 'OPEN_COMUNICADO',
              ...(opts.imageUrl ? { imageUrl: opts.imageUrl } : {}),
            },
          },
          // Configuración nativa para iOS (APNs vía Apple Push Notification service con imagen)
          apns: {
            headers: {
              'apns-priority': '10',
            },
            payload: {
              aps: {
                sound: 'default',
                badge: 1,
                contentAvailable: true,
              },
            },
            ...(opts.imageUrl ? { fcmOptions: { imageUrl: opts.imageUrl } } : {}),
          },
          // Configuración nativa para Web Push (Service Worker con imagen de banner)
          webpush: {
            fcmOptions: {
              link: url,
            },
            notification: {
              requireInteraction: isUrgente,
              ...(opts.imageUrl ? { image: opts.imageUrl } : {}),
            },
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

