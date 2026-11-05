import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../shared/infrastructure/prisma/prisma.service.js';
import type {
  AuthUserRepositoryPort,
  AuthUserDetails,
  CreateUserData,
} from '../../../domain/ports/auth-user.repository.port.js';

@Injectable()
export class AuthUserPrismaRepository implements AuthUserRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserData): Promise<string> {
    const user = await this.prisma.usuario.create({
      data: {
        nombre: data.nombre,
        correo: data.correo,
        password: data.password,
        telefono: data.telefono,
        idRol: data.idRol,
        idDepartamento: data.idDepartamento,
      },
    });
    return user.idUsuario;
  }

  async findByEmail(correo: string): Promise<AuthUserDetails | null> {
    return this.findByEmailWithRolesAndPermissions(correo);
  }

  async findRoleIdByName(nombre: string): Promise<string | null> {
    const rol = await this.prisma.roles.findFirst({
      where: {
        nombre: {
          equals: nombre.trim(),
          mode: 'insensitive',
        },
      },
    });
    return rol?.idRol ?? null;
  }

  async findDepartmentIdByName(nombre: string): Promise<string | null> {
    const departamento = await this.prisma.departamento.findFirst({
      where: {
        nombre: {
          equals: nombre.trim(),
          mode: 'insensitive',
        },
      },
    });
    return departamento?.idDepartamento ?? null;
  }

  async findByEmailWithRolesAndPermissions(correo: string): Promise<AuthUserDetails | null> {
    const raw = await this.prisma.usuario.findUnique({
      where: { correo },
      include: {
        rol: {
          include: {
            rolPermisos: {
              include: {
                permiso: true,
              },
            },
          },
        },
        departamento: true,
      },
    });

    if (!raw) return null;

    const permisos = raw.rol.rolPermisos.map(
      (rp: { permiso: { nombre: string } }) => rp.permiso.nombre,
    );

    return {
      idUsuario: raw.idUsuario,
      nombre: raw.nombre,
      correo: raw.correo,
      password: raw.password,
      telefono: raw.telefono,
      idRol: raw.idRol,
      rol: raw.rol.nombre,
      idDepartamento: raw.idDepartamento,
      departamento: raw.departamento.nombre,
      permisos,
    };
  }

  async findByIdWithRolesAndPermissions(idUsuario: string): Promise<AuthUserDetails | null> {
    const raw = await this.prisma.usuario.findUnique({
      where: { idUsuario },
      include: {
        rol: {
          include: {
            rolPermisos: {
              include: {
                permiso: true,
              },
            },
          },
        },
        departamento: true,
      },
    });

    if (!raw) return null;

    const permisos = raw.rol.rolPermisos.map(
      (rp: { permiso: { nombre: string } }) => rp.permiso.nombre,
    );

    return {
      idUsuario: raw.idUsuario,
      nombre: raw.nombre,
      correo: raw.correo,
      password: raw.password,
      telefono: raw.telefono,
      idRol: raw.idRol,
      rol: raw.rol.nombre,
      idDepartamento: raw.idDepartamento,
      departamento: raw.departamento.nombre,
      permisos,
    };
  }
}
