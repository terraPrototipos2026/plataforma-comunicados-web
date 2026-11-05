import type { Permiso as PrismaPermisoModel } from '@prisma/client';
import { Permiso } from '../../../domain/entities/permiso.entity.js';

export class PermisoMapper {
  public static toDomain(raw: PrismaPermisoModel): Permiso {
    return Permiso.reconstitute({
      idPermiso: raw.idPermiso,
      nombre: raw.nombre,
    });
  }

  public static toPersistence(entity: Permiso): PrismaPermisoModel {
    return {
      idPermiso: entity.idPermiso,
      nombre: entity.nombre,
    };
  }
}
