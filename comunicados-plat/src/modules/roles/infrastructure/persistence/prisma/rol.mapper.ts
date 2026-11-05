import type {
  Roles as PrismaRolesModel,
  Permiso as PrismaPermisoModel,
  RolPermiso as PrismaRolPermisoModel,
} from '@prisma/client';
import { Rol } from '../../../domain/entities/rol.entity.js';

export type PrismaRolWithPermisos = PrismaRolesModel & {
  rolPermisos?: Array<
    PrismaRolPermisoModel & {
      permiso: PrismaPermisoModel;
    }
  >;
};

export class RolMapper {
  public static toDomain(raw: PrismaRolWithPermisos): Rol {
    const permisos = (raw.rolPermisos ?? []).map((rp) => ({
      idPermiso: rp.permiso.idPermiso,
      nombre: rp.permiso.nombre,
    }));

    return Rol.reconstitute({
      idRol: raw.idRol,
      nombre: raw.nombre,
      permisos,
    });
  }

  public static toPersistence(entity: Rol): PrismaRolesModel {
    return {
      idRol: entity.idRol,
      nombre: entity.nombre,
    };
  }
}
