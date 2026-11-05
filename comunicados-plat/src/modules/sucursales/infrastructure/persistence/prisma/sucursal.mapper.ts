import type { Sucursal as PrismaSucursalModel } from '@prisma/client';
import { Sucursal } from '../../../domain/entities/sucursal.entity.js';

export class SucursalMapper {
  public static toDomain(raw: PrismaSucursalModel): Sucursal {
    return Sucursal.reconstitute({
      idSucursal: raw.idSucursal,
      nombre: raw.nombre,
      direccion: raw.direccion,
    });
  }

  public static toPersistence(entity: Sucursal): PrismaSucursalModel {
    return {
      idSucursal: entity.idSucursal,
      nombre: entity.nombre,
      direccion: entity.direccion,
    };
  }
}
