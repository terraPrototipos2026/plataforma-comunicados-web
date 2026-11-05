import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../shared/infrastructure/prisma/prisma.service.js';
import type { PermisoRepositoryPort } from '../../../domain/ports/permiso.repository.port.js';
import { Permiso } from '../../../domain/entities/permiso.entity.js';
import { PermisoMapper } from './permiso.mapper.js';

@Injectable()
export class PermisoPrismaRepository implements PermisoRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Permiso[]> {
    const records = await this.prisma.permiso.findMany({
      orderBy: { nombre: 'asc' },
    });
    return records.map((raw) => PermisoMapper.toDomain(raw));
  }

  async findById(idPermiso: string): Promise<Permiso | null> {
    const raw = await this.prisma.permiso.findUnique({
      where: { idPermiso },
    });
    return raw ? PermisoMapper.toDomain(raw) : null;
  }

  async findByIds(idPermisos: string[]): Promise<Permiso[]> {
    if (idPermisos.length === 0) return [];
    const records = await this.prisma.permiso.findMany({
      where: {
        idPermiso: { in: idPermisos },
      },
      orderBy: { nombre: 'asc' },
    });
    return records.map((raw) => PermisoMapper.toDomain(raw));
  }

  async findByNombre(nombre: string): Promise<Permiso | null> {
    const raw = await this.prisma.permiso.findUnique({
      where: { nombre: nombre.trim().toLowerCase() },
    });
    return raw ? PermisoMapper.toDomain(raw) : null;
  }

  async save(permiso: Permiso): Promise<void> {
    const data = PermisoMapper.toPersistence(permiso);
    await this.prisma.permiso.upsert({
      where: { idPermiso: data.idPermiso },
      update: { nombre: data.nombre },
      create: data,
    });
  }

  async delete(idPermiso: string): Promise<void> {
    await this.prisma.permiso.delete({
      where: { idPermiso },
    });
  }
}
