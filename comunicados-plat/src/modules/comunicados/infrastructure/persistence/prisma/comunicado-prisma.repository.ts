import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../shared/infrastructure/prisma/prisma.service.js';
import type {
  ComunicadoRepositoryPort,
  CreateComunicadoPersistenceData,
  EstimarAlcanceData,
  EstimarAlcanceResult,
  FilterComunicadosParams,
} from '../../../domain/ports/comunicado.repository.port.js';
import { Comunicado } from '../../../domain/entities/comunicado.entity.js';
import { ComunicadoMapper } from './comunicado.mapper.js';

@Injectable()
export class ComunicadoPrismaRepository implements ComunicadoRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters?: FilterComunicadosParams): Promise<Comunicado[]> {
    const where: any = {};

    if (filters?.estado && filters.estado !== 'TODOS') {
      where.estado = filters.estado;
    }

    if (filters?.prioridad && filters.prioridad !== 'TODAS') {
      where.prioridad = filters.prioridad;
    }

    if (filters?.search && filters.search.trim()) {
      const term = filters.search.trim();
      where.OR = [
        { codigo: { contains: term, mode: 'insensitive' } },
        { titulo: { contains: term, mode: 'insensitive' } },
        { autor: { nombre: { contains: term, mode: 'insensitive' } } },
      ];
    }

    const records = await this.prisma.comunicado.findMany({
      where,
      include: {
        autor: true,
        cuerpo: true,
        imagenes: {
          orderBy: { orden: 'asc' },
        },
        destinatarios: true,
      },
      orderBy: { createdAt: 'desc' },
      take: filters?.limit ?? 50,
      skip: filters?.offset ?? 0,
    });

    return records.map(ComunicadoMapper.toDomain);
  }

  async findById(idComunicado: string): Promise<Comunicado | null> {
    let record = await this.prisma.comunicado.findUnique({
      where: { idComunicado },
      include: {
        autor: true,
        cuerpo: true,
        imagenes: {
          orderBy: { orden: 'asc' },
        },
        destinatarios: {
          include: {
            usuario: {
              include: {
                rol: true,
                departamento: {
                  include: {
                    sucursal: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!record) return null;

    // Si el comunicado no tiene destinatarios registrados en la tabla relacional,
    // se resuelven según su tipo de alcance para asegurar la visualización completa.
    if (!record.destinatarios || record.destinatarios.length === 0) {
      const calculo = await this.estimarAlcance({
        tipoAlcance: record.tipoAlcance,
      });

      if (calculo.targetUserIds.length > 0) {
        await this.prisma.comunicadoDestinatario.createMany({
          data: calculo.targetUserIds.map((userId) => ({
            idComunicado: record!.idComunicado,
            idUsuario: userId,
            estadoLectura: 'PENDIENTE',
          })),
          skipDuplicates: true,
        });

        record = await this.prisma.comunicado.findUnique({
          where: { idComunicado },
          include: {
            autor: true,
            cuerpo: true,
            imagenes: {
              orderBy: { orden: 'asc' },
            },
            destinatarios: {
              include: {
                usuario: {
                  include: {
                    rol: true,
                    departamento: {
                      include: {
                        sucursal: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });
      }
    }

    return record ? ComunicadoMapper.toDomain(record as any) : null;
  }

  async create(data: CreateComunicadoPersistenceData): Promise<Comunicado> {
    const record = await this.prisma.comunicado.create({
      data: {
        codigo: data.codigo,
        titulo: data.titulo,
        extracto: data.extracto,
        medioPublicacion: data.medioPublicacion,
        prioridad: data.prioridad,
        estado: data.estado,
        tipoAlcance: data.tipoAlcance,
        fechaPublicacion: data.fechaPublicacion ?? new Date(),
        fechaProgramada: data.fechaProgramada,
        idUsuario: data.idUsuario,
        cuerpo: data.cuerpo
          ? {
              create: {
                contenido: data.cuerpo.contenido,
                urlArchivo: data.cuerpo.urlArchivo,
                nombreArchivo: data.cuerpo.nombreArchivo,
                tamanoBytes: data.cuerpo.tamanoBytes,
                numeroPaginas: data.cuerpo.numeroPaginas,
              },
            }
          : undefined,
        imagenes: data.imagenes && data.imagenes.length > 0
          ? {
              create: data.imagenes.map((img) => ({
                urlImagen: img.urlImagen,
                nombreArchivo: img.nombreArchivo,
                tamanoBytes: img.tamanoBytes,
                esPortada: img.esPortada,
                orden: img.orden,
              })),
            }
          : undefined,
        notificaciones: {
          create: {
            tipo: 'PUSH_MOVIL',
            estado: data.estado === 'PUBLICADO' ? 'ENVIADA' : 'PENDIENTE',
          },
        },
        destinatarios: data.destinatarioIds && data.destinatarioIds.length > 0
          ? {
              create: data.destinatarioIds.map((userId) => ({
                idUsuario: userId,
                estadoLectura: 'PENDIENTE',
              })),
            }
          : undefined,
      },
      include: {
        autor: true,
        cuerpo: true,
        imagenes: true,
        destinatarios: true,
      },
    });

    return ComunicadoMapper.toDomain(record);
  }

  async anular(idComunicado: string): Promise<void> {
    await this.prisma.comunicado.update({
      where: { idComunicado },
      data: { estado: 'ANULADO' },
    });
  }

  async registrarLectura(idComunicado: string, idUsuario: string, confirmar: boolean): Promise<void> {
    const existing = await this.prisma.comunicadoDestinatario.findUnique({
      where: {
        idComunicado_idUsuario: {
          idComunicado,
          idUsuario,
        },
      },
    });

    if (existing) {
      await this.prisma.comunicadoDestinatario.update({
        where: { idComunicadoDestinatario: existing.idComunicadoDestinatario },
        data: {
          estadoLectura: confirmar ? 'CONFIRMADO' : (existing.estadoLectura === 'CONFIRMADO' ? 'CONFIRMADO' : 'VISUALIZADO'),
          fechaVisualizacion: existing.fechaVisualizacion ?? new Date(),
          fechaConfirmacion: confirmar ? (existing.fechaConfirmacion ?? new Date()) : existing.fechaConfirmacion,
        },
      });
    } else {
      await this.prisma.comunicadoDestinatario.create({
        data: {
          idComunicado,
          idUsuario,
          estadoLectura: confirmar ? 'CONFIRMADO' : 'VISUALIZADO',
          fechaVisualizacion: new Date(),
          fechaConfirmacion: confirmar ? new Date() : null,
        },
      });
    }
  }

  async getNextCodigo(): Promise<string> {
    const currentYear = new Date().getFullYear();
    const prefix = `COM-${currentYear}-`;

    const last = await this.prisma.comunicado.findFirst({
      where: {
        codigo: {
          startsWith: prefix,
        },
      },
      orderBy: { codigo: 'desc' },
      select: { codigo: true },
    });

    if (!last) {
      return `${prefix}001`;
    }

    const parts = last.codigo.split('-');
    const seq = parseInt(parts[2] || '0', 10);
    const nextSeq = String(seq + 1).padStart(3, '0');
    return `${prefix}${nextSeq}`;
  }

  async estimarAlcance(data: EstimarAlcanceData): Promise<EstimarAlcanceResult> {
    let users = [];

    if (data.tipoAlcance === 'NOMINATIVO' && data.usuarioIds && data.usuarioIds.length > 0) {
      users = await this.prisma.usuario.findMany({
        where: {
          idUsuario: { in: data.usuarioIds },
        },
        select: { idUsuario: true, idDepartamento: true, departamento: { select: { idSucursal: true } } },
      });
    } else if (data.tipoAlcance === 'ENCARGADOS_AREA') {
      const whereClause: Record<string, unknown> = {
        rol: {
          nombre: {
            in: [
              'encargado de area',
              'encargado de área',
              'jefe de operaciones',
              'gerente de sucursal',
              'gerente sucursal',
              'administrador general',
            ],
          },
        },
      };
      if (data.departamentoIds && data.departamentoIds.length > 0) {
        whereClause.idDepartamento = { in: data.departamentoIds };
      } else if (data.sucursalIds && data.sucursalIds.length > 0) {
        whereClause.departamento = { idSucursal: { in: data.sucursalIds } };
      }
      users = await this.prisma.usuario.findMany({
        where: whereClause,
        select: { idUsuario: true, idDepartamento: true, departamento: { select: { idSucursal: true } } },
      });
    } else if (data.tipoAlcance === 'POR_DEPARTAMENTO' && data.departamentoIds && data.departamentoIds.length > 0) {
      users = await this.prisma.usuario.findMany({
        where: {
          idDepartamento: { in: data.departamentoIds },
        },
        select: { idUsuario: true, idDepartamento: true, departamento: { select: { idSucursal: true } } },
      });
    } else if (data.tipoAlcance === 'POR_SUCURSAL' && data.sucursalIds && data.sucursalIds.length > 0) {
      users = await this.prisma.usuario.findMany({
        where: {
          departamento: {
            idSucursal: { in: data.sucursalIds },
          },
        },
        select: { idUsuario: true, idDepartamento: true, departamento: { select: { idSucursal: true } } },
      });
    } else {
      users = await this.prisma.usuario.findMany({
        select: { idUsuario: true, idDepartamento: true, departamento: { select: { idSucursal: true } } },
      });
    }

    const uniqueSucursales = new Set<string>();
    const uniqueDepartamentos = new Set<string>();

    for (const u of users) {
      if (u.idDepartamento) uniqueDepartamentos.add(u.idDepartamento);
      if (u.departamento?.idSucursal) uniqueSucursales.add(u.departamento.idSucursal);
    }

    return {
      totalColaboradores: users.length,
      totalSucursales: uniqueSucursales.size,
      totalDepartamentos: uniqueDepartamentos.size,
      targetUserIds: users.map((u) => u.idUsuario),
    };
  }
}

