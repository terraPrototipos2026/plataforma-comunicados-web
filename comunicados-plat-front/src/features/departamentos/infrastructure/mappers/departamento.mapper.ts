import type { Departamento } from '../../domain/models/departamento.model';
import type {
  CreateDepartamentoParams,
  UpdateDepartamentoParams,
} from '../../domain/ports/departamento.repository';
import type {
  CreateDepartamentoApiRequestDto,
  DepartamentoApiResponseDto,
  UpdateDepartamentoApiRequestDto,
} from '../dtos/departamento-api.dto';

export class DepartamentoMapper {
  static toDomain(dto: DepartamentoApiResponseDto): Departamento {
    return {
      idDepartamento: dto.idDepartamento,
      nombre: dto.nombre,
      idSucursal: dto.idSucursal ?? null,
    };
  }

  static toCreateRequest(
    params: CreateDepartamentoParams,
  ): CreateDepartamentoApiRequestDto {
    return {
      nombre: params.nombre,
      idSucursal: params.idSucursal ?? null,
    };
  }

  static toUpdateRequest(
    params: UpdateDepartamentoParams,
  ): UpdateDepartamentoApiRequestDto {
    return {
      nombre: params.nombre,
      idSucursal: params.idSucursal !== undefined ? params.idSucursal : undefined,
    };
  }
}

