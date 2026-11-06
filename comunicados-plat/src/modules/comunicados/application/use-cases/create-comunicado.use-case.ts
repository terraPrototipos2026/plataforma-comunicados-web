import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { COMUNICADO_REPOSITORY_TOKEN } from '../../infrastructure/tokens.js';
import type { ComunicadoRepositoryPort } from '../../domain/ports/comunicado.repository.port.js';
import { JerarquiaEmisorPolicy } from '../../domain/services/jerarquia-emisor.policy.js';
import { NotificationsService } from '../../../notifications/infrastructure/notifications.service.js';
import type { CreateComunicadoInput } from '../dtos/comunicado.dto.js';
import type { Comunicado } from '../../domain/entities/comunicado.entity.js';

@Injectable()
export class CreateComunicadoUseCase {
  constructor(
    @Inject(COMUNICADO_REPOSITORY_TOKEN)
    private readonly repository: ComunicadoRepositoryPort,
    private readonly notificationsService: NotificationsService,
  ) {}

  async execute(input: CreateComunicadoInput): Promise<Comunicado> {
    if (!input.titulo || input.titulo.trim().length < 3) {
      throw new BadRequestException('El título del comunicado debe tener al menos 3 caracteres.');
    }

    const medio = input.medioPublicacion ?? 'AVANZADO';
    const tipoAlcance = medio === 'EXPRESS' ? 'TODA_EMPRESA' : (input.tipoAlcance ?? 'TODA_EMPRESA');

    // Validación de jerarquía de rol
    const evaluacion = JerarquiaEmisorPolicy.evaluar({
      rolEmisor: input.rolEmisor ?? 'administrador general',
      tipoAlcance,
    });

    if (!evaluacion.autorizado) {
      throw new BadRequestException(`Emisión no autorizada: ${evaluacion.mensaje}`);
    }

    // Código correlativo COM-YYYY-NNN
    const codigo = await this.repository.getNextCodigo();

    // Resolución de destinatarios
    let targetUserIds = input.destinatarioIds ?? [];
    if (targetUserIds.length === 0) {
      const calculo = await this.repository.estimarAlcance({
        tipoAlcance,
        sucursalIds: input.sucursalIds,
        departamentoIds: input.departamentoIds,
      });
      targetUserIds = calculo.targetUserIds;
    }

    const cuerpoData = input.contenidoHtml || input.urlArchivoPdf
      ? {
          contenido: input.contenidoHtml ?? '',
          urlArchivo: input.urlArchivoPdf ?? null,
          nombreArchivo: input.nombreArchivoPdf ?? null,
          tamanoBytes: input.tamanoBytesPdf ?? null,
          numeroPaginas: input.numeroPaginasPdf ?? null,
        }
      : null;

    const imagenesData = input.imagenes?.map((img, idx) => ({
      urlImagen: img.urlImagen,
      nombreArchivo: img.nombreArchivo ?? null,
      tamanoBytes: img.tamanoBytes ?? null,
      esPortada: img.esPortada ?? (idx === 0),
      orden: img.orden ?? idx,
    })) ?? [];

    const estado = input.estado ?? (input.fechaProgramada ? 'PROGRAMADO' : 'PUBLICADO');
    const fechaProgramada = input.fechaProgramada ? new Date(input.fechaProgramada) : null;
    const fechaPublicacion = estado === 'PROGRAMADO' ? null : new Date();

    const created = await this.repository.create({
      codigo,
      titulo: input.titulo.trim(),
      extracto: input.extracto?.trim() ?? null,
      medioPublicacion: medio,
      prioridad: input.prioridad ?? 'NORMAL',
      estado,
      tipoAlcance,
      fechaPublicacion,
      fechaProgramada,
      idUsuario: input.idAutor,
      cuerpo: cuerpoData,
      imagenes: imagenesData,
      destinatarioIds: targetUserIds,
    });

    // Notificar en background vía Firebase Push a los colaboradores destinatarios (Móvil y Web)
    if (created.estado === 'PUBLICADO' && targetUserIds.length > 0) {
      const portada = created.portadaUrl || created.imagenes?.[0]?.urlImagen || undefined;
      this.notificationsService
        .sendToMultipleUsers(
          targetUserIds,
          `Nuevo Comunicado: ${created.titulo}`,
          created.extracto || 'Se ha publicado un nuevo comunicado oficial.',
          {
            idComunicado: created.idComunicado,
            codigo: created.codigo,
            prioridad: created.prioridad,
            url: `/dashboard`,
            imageUrl: portada,
          },
        )
        .catch((err) => {
          console.warn('⚠️ Error al enviar notificaciones push del comunicado:', err);
        });
    }

    return created;
  }
}

