import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../shared/infrastructure/prisma/prisma.service.js';
import { UsuarioRepositoryPort, UpdateUsuarioData } from '../../../domain/ports/usuario.repository.port.js';
import { Usuario } from '../../../domain/entities/usuario.entity.js';
import { UsuarioMapper } from './usuario.mapper.js';

@Injectable()
export class UsuarioPrismaRepository implements UsuarioRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Usuario[]> {
    const records = await this.prisma.usuario.findMany({
      include: {
        rol: true,
        departamento: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return records.map(UsuarioMapper.toDomain);
  }

  async findById(id: string): Promise<Usuario | null> {
    const record = await this.prisma.usuario.findUnique({
      where: { idUsuario: id },
      include: {
        rol: true,
        departamento: true,
      },
    });
    return record ? UsuarioMapper.toDomain(record) : null;
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    const record = await this.prisma.usuario.findUnique({
      where: { correo: email },
      include: {
        rol: true,
        departamento: true,
      },
    });
    return record ? UsuarioMapper.toDomain(record) : null;
  }

  async update(id: string, data: UpdateUsuarioData): Promise<Usuario> {
    const record = await this.prisma.usuario.update({
      where: { idUsuario: id },
      data: {
        nombre: data.nombre,
        correo: data.correo,
        telefono: data.telefono,
        idRol: data.idRol,
        idDepartamento: data.idDepartamento,
      },
      include: {
        rol: true,
        departamento: true,
      },
    });
    return UsuarioMapper.toDomain(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.usuario.delete({
      where: { idUsuario: id },
    });
  }

  async findRoleIdByName(name: string): Promise<string | null> {
    const rol = await this.prisma.roles.findFirst({
      where: {
        nombre: {
          equals: name.trim(),
          mode: 'insensitive',
        },
      },
    });
    return rol ? rol.idRol : null;
  }

  async findDepartmentIdByName(name: string): Promise<string | null> {
    const dept = await this.prisma.departamento.findFirst({
      where: {
        nombre: {
          equals: name.trim(),
          mode: 'insensitive',
        },
      },
    });
    return dept ? dept.idDepartamento : null;
  }
}
