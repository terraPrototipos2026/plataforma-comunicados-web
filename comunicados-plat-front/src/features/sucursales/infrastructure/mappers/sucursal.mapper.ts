import type { Sucursal } from '../../domain/models/sucursal.model';
import type {
  CreateSucursalParams,
  UpdateSucursalParams,
} from '../../domain/ports/sucursal.repository';
import type {
  CreateSucursalApiRequestDto,
  SucursalApiResponseDto,
  UpdateSucursalApiRequestDto,
} from '../dtos/sucursal-api.dto';

export class SucursalMapper {
  static toDomain(dto: SucursalApiResponseDto): Sucursal {
    return {
      idSucursal: dto.idSucursal,
      nombre: dto.nombre,
      direccion: dto.direccion,
    };
  }

  static toCreateRequest(
    params: CreateSucursalParams,
  ): CreateSucursalApiRequestDto {
    return {
      nombre: params.nombre,
      direccion: params.direccion,
    };
  }

  static toUpdateRequest(
    params: UpdateSucursalParams,
  ): UpdateSucursalApiRequestDto {
    return {
      nombre: params.nombre,
      direccion: params.direccion,
    };
  }
}

