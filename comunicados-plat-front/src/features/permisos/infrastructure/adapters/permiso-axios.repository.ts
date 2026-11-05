import { apiClient } from '../../../../core/http/api-client';
import type { Permiso } from '../../domain/models/permiso.model';
import type {
  CreatePermisoParams,
  PermisoRepository,
  UpdatePermisoParams,
} from '../../domain/ports/permiso.repository';
import type {
  DeletePermisoApiResponseDto,
  PermisoApiResponseDto,
} from '../dtos/permiso-api.dto';
import { PermisoMapper } from '../mappers/permiso.mapper';

export class PermisoAxiosRepository implements PermisoRepository {
  private readonly basePath = '/permisos';

  async findAll(): Promise<Permiso[]> {
    const { data } = await apiClient.get<PermisoApiResponseDto[]>(this.basePath);
    return data.map(PermisoMapper.toDomain);
  }

  async findById(idPermiso: string): Promise<Permiso> {
    const { data } = await apiClient.get<PermisoApiResponseDto>(
      `${this.basePath}/${idPermiso}`,
    );
    return PermisoMapper.toDomain(data);
  }

  async create(params: CreatePermisoParams): Promise<Permiso> {
    const payload = PermisoMapper.toCreateRequest(params);
    const { data } = await apiClient.post<PermisoApiResponseDto>(this.basePath, payload);
    return PermisoMapper.toDomain(data);
  }

  async update(params: UpdatePermisoParams): Promise<Permiso> {
    const payload = PermisoMapper.toUpdateRequest(params);
    const { data } = await apiClient.patch<PermisoApiResponseDto>(
      `${this.basePath}/${params.idPermiso}`,
      payload,
    );
    return PermisoMapper.toDomain(data);
  }

  async delete(idPermiso: string): Promise<{ message: string }> {
    const { data } = await apiClient.delete<DeletePermisoApiResponseDto>(
      `${this.basePath}/${idPermiso}`,
    );
    return { message: data.message };
  }
}

