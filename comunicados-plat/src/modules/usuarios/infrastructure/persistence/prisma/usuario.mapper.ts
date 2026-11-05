import { Usuario as PrismaUsuario, Roles, Departamento } from '@prisma/client';
import { Usuario } from '../../../domain/entities/usuario.entity.js';

type PrismaUsuarioWithRelations = PrismaUsuario & {
  rol: Roles;
  departamento: Departamento;
};

export class UsuarioMapper {
  static toDomain(record: PrismaUsuarioWithRelations): Usuario {
    return new Usuario({
      idUsuario: record.idUsuario,
      nombre: record.nombre,
      correo: record.correo,
      telefono: record.telefono,
      idRol: record.idRol,
      rolNombre: record.rol.nombre,
      idDepartamento: record.idDepartamento,
      departamentoNombre: record.departamento.nombre,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}

