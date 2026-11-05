import { Injectable } from '@nestjs/common';
import type { Sucursal as PrismaSucursalModel } from '@prisma/client';
import { PrismaService } from '../../../../../shared/infrastructure/prisma/prisma.service.js';
import type { SucursalRepositoryPort } from '../../../domain/ports/sucursal.repository.port.js';
import { Sucursal } from '../../../domain/entities/sucursal.entity.js';
import { SucursalMapper } from './sucursal.mapper.js';

@Injectable()
export class SucursalPrismaRepository implements SucursalRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Sucursal[]> {
    const records = await this.prisma.sucursal.findMany({
      orderBy: { nombre: 'asc' },
    });
    return records.map((record: PrismaSucursalModel) => SucursalMapper.toDomain(record));
  }

  async findById(idSucursal: string): Promise<Sucursal | null> {
    const record = await this.prisma.sucursal.findUnique({
      where: { idSucursal },
    });
    return record ? SucursalMapper.toDomain(record) : null;
  }

  async findByNombre(nombre: string): Promise<Sucursal | null> {
    const record = await this.prisma.sucursal.findFirst({
      where: {
        nombre: {
          equals: nombre.trim().toLowerCase(),
          mode: 'insensitive',
        },
      },
    });
    return record ? SucursalMapper.toDomain(record) : null;
  }

  async save(sucursal: Sucursal): Promise<void> {
    const data = SucursalMapper.toPersistence(sucursal);
    await this.prisma.sucursal.upsert({
      where: { idSucursal: data.idSucursal },
      create: data,
      update: {
        nombre: data.nombre,
        direccion: data.direccion,
      },
    });
  }

  async delete(idSucursal: string): Promise<void> {
    await this.prisma.sucursal.delete({
      where: { idSucursal },
    });
  }

  async hasAssignedDepartamentos(idSucursal: string): Promise<boolean> {
    const count = await this.prisma.departamento.count({
      where: { idSucursal },
    });
    return count > 0;
  }
}
