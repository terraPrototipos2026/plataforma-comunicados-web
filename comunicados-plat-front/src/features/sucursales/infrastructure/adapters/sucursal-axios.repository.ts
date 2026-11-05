import { apiClient } from '../../../../core/http/api-client';
import type { Sucursal } from '../../domain/models/sucursal.model';
import type {
  CreateSucursalParams,
  SucursalRepository,
  UpdateSucursalParams,
} from '../../domain/ports/sucursal.repository';
import type {
  DeleteSucursalApiResponseDto,
  SucursalApiResponseDto,
} from '../dtos/sucursal-api.dto';
import { SucursalMapper } from '../mappers/sucursal.mapper';

export class SucursalAxiosRepository implements SucursalRepository {
  private readonly basePath = '/sucursales';

  async findAll(): Promise<Sucursal[]> {
    const { data } = await apiClient.get<SucursalApiResponseDto[]>(this.basePath);
    return data.map(SucursalMapper.toDomain);
  }

  async findById(idSucursal: string): Promise<Sucursal> {
    const { data } = await apiClient.get<SucursalApiResponseDto>(
      `${this.basePath}/${idSucursal}`,
    );
    return SucursalMapper.toDomain(data);
  }

  async create(params: CreateSucursalParams): Promise<Sucursal> {
    const payload = SucursalMapper.toCreateRequest(params);
    const { data } = await apiClient.post<SucursalApiResponseDto>(
      this.basePath,
      payload,
    );
    return SucursalMapper.toDomain(data);
  }

  async update(params: UpdateSucursalParams): Promise<Sucursal> {
    const payload = SucursalMapper.toUpdateRequest(params);
    const { data } = await apiClient.patch<SucursalApiResponseDto>(
      `${this.basePath}/${params.idSucursal}`,
      payload,
    );
    return SucursalMapper.toDomain(data);
  }

  async delete(idSucursal: string): Promise<{ message: string }> {
    const { data } = await apiClient.delete<DeleteSucursalApiResponseDto>(
      `${this.basePath}/${idSucursal}`,
    );
    return { message: data.message };
  }
}

