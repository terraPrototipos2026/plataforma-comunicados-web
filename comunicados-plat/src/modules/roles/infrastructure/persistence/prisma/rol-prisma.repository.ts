import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../shared/infrastructure/prisma/prisma.service.js';
import type { RolRepositoryPort } from '../../../domain/ports/rol.repository.port.js';
import { Rol } from '../../../domain/entities/rol.entity.js';
import { RolMapper } from './rol.mapper.js';

@Injectable()
export class RolPrismaRepository implements RolRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Rol[]> {
    const records = await this.prisma.roles.findMany({
      include: {
        rolPermisos: {
          include: { permiso: true },
        },
      },
      orderBy: { nombre: 'asc' },
    });
    return records.map((raw) => RolMapper.toDomain(raw));
  }

  async findById(idRol: string): Promise<Rol | null> {
    const raw = await this.prisma.roles.findUnique({
      where: { idRol },
      include: {
        rolPermisos: {
          include: { permiso: true },
        },
      },
    });
    return raw ? RolMapper.toDomain(raw) : null;
  }

  async findByNombre(nombre: string): Promise<Rol | null> {
    const raw = await this.prisma.roles.findUnique({
      where: { nombre: nombre.trim().toLowerCase() },
      include: {
        rolPermisos: {
          include: { permiso: true },
        },
      },
    });
    return raw ? RolMapper.toDomain(raw) : null;
  }

  async save(rol: Rol): Promise<void> {
    const data = RolMapper.toPersistence(rol);
    await this.prisma.roles.upsert({
      where: { idRol: data.idRol },
      update: { nombre: data.nombre },
      create: data,
    });
  }

  async syncPermisos(idRol: string, permisoIds: string[]): Promise<Rol> {
    const uniqueIds = Array.from(new Set(permisoIds));

    await this.prisma.$transaction([
      this.prisma.rolPermiso.deleteMany({
        where: { idRol },
      }),
      ...(uniqueIds.length > 0
        ? [
            this.prisma.rolPermiso.createMany({
              data: uniqueIds.map((idPermiso) => ({ idRol, idPermiso })),
            }),
          ]
        : []),
    ]);

    const updated = await this.findById(idRol);
    if (!updated) {
      throw new Error(`No se encontró el rol "${idRol}" tras sincronizar permisos.`);
    }
    return updated;
  }

  async delete(idRol: string): Promise<void> {
    await this.prisma.roles.delete({
      where: { idRol },
    });
  }

  async hasAssignedUsers(idRol: string): Promise<boolean> {
    const count = await this.prisma.usuario.count({
      where: { idRol },
    });
    return count > 0;
  }
}
