import type { Rol } from '../../domain/models/rol.model';
import type {
  AssignPermisosToRolParams,
  CreateRolParams,
  UpdateRolParams,
} from '../../domain/ports/rol.repository';
import type {
  AssignPermisosToRolApiRequestDto,
  CreateRolApiRequestDto,
  RolApiResponseDto,
  UpdateRolApiRequestDto,
} from '../dtos/rol-api.dto';

export class RolMapper {
  static toDomain(dto: RolApiResponseDto): Rol {
    return {
      idRol: dto.idRol,
      nombre: dto.nombre,
      permisos: Array.isArray(dto.permisos)
        ? dto.permisos.map((p) => ({
            idPermiso: p.idPermiso,
            nombre: p.nombre,
          }))
        : [],
    };
  }

  static toCreateRequest(params: CreateRolParams): CreateRolApiRequestDto {
    return {
      nombre: params.nombre,
      ...(params.permisoIds ? { permisoIds: params.permisoIds } : {}),
    };
  }

  static toUpdateRequest(params: UpdateRolParams): UpdateRolApiRequestDto {
    return {
      nombre: params.nombre,
    };
  }

  static toAssignPermisosRequest(
    params: AssignPermisosToRolParams,
  ): AssignPermisosToRolApiRequestDto {
    return {
      permisoIds: params.permisoIds,
    };
  }
}

