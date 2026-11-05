import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../shared/infrastructure/prisma/prisma.service.js';
import type { DepartamentoRepositoryPort } from '../../../domain/ports/departamento.repository.port.js';
import { Departamento } from '../../../domain/entities/departamento.entity.js';
import { DepartamentoMapper } from './departamento.mapper.js';

@Injectable()
export class DepartamentoPrismaRepository implements DepartamentoRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Departamento[]> {
    const records = await this.prisma.departamento.findMany({
      orderBy: { nombre: 'asc' },
    });
    return records.map((raw) => DepartamentoMapper.toDomain(raw));
  }

  async findById(idDepartamento: string): Promise<Departamento | null> {
    const raw = await this.prisma.departamento.findUnique({
      where: { idDepartamento },
    });
    return raw ? DepartamentoMapper.toDomain(raw) : null;
  }

  async findByNombre(nombre: string): Promise<Departamento | null> {
    const raw = await this.prisma.departamento.findUnique({
      where: { nombre: nombre.trim().toLowerCase() },
    });
    return raw ? DepartamentoMapper.toDomain(raw) : null;
  }

  async save(departamento: Departamento): Promise<void> {
    const data = DepartamentoMapper.toPersistence(departamento);
    await this.prisma.departamento.upsert({
      where: { idDepartamento: data.idDepartamento },
      update: { nombre: data.nombre },
      create: data,
    });
  }

  async delete(idDepartamento: string): Promise<void> {
    await this.prisma.departamento.delete({
      where: { idDepartamento },
    });
  }

  async hasAssignedUsers(idDepartamento: string): Promise<boolean> {
    const count = await this.prisma.usuario.count({
      where: { idDepartamento },
    });
    return count > 0;
  }
}
