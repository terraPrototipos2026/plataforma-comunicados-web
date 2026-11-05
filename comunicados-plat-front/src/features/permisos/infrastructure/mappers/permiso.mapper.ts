import type { Permiso } from '../../domain/models/permiso.model';
import type {
  CreatePermisoParams,
  UpdatePermisoParams,
} from '../../domain/ports/permiso.repository';
import type {
  CreatePermisoApiRequestDto,
  PermisoApiResponseDto,
  UpdatePermisoApiRequestDto,
} from '../dtos/permiso-api.dto';

export class PermisoMapper {
  static toDomain(dto: PermisoApiResponseDto): Permiso {
    return {
      idPermiso: dto.idPermiso,
      nombre: dto.nombre,
    };
  }

  static toCreateRequest(params: CreatePermisoParams): CreatePermisoApiRequestDto {
    return {
      nombre: params.nombre,
    };
  }

  static toUpdateRequest(params: UpdatePermisoParams): UpdatePermisoApiRequestDto {
    return {
      nombre: params.nombre,
    };
  }
}

