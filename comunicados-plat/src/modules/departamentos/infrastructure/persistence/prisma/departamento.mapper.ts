import type { Departamento as PrismaDepartamentoModel } from '@prisma/client';
import { Departamento } from '../../../domain/entities/departamento.entity.js';

export class DepartamentoMapper {
  public static toDomain(raw: PrismaDepartamentoModel): Departamento {
    return Departamento.reconstitute({
      idDepartamento: raw.idDepartamento,
      nombre: raw.nombre,
    });
  }

  public static toPersistence(entity: Departamento): PrismaDepartamentoModel {
    return {
      idDepartamento: entity.idDepartamento,
      nombre: entity.nombre,
    };
  }
}
