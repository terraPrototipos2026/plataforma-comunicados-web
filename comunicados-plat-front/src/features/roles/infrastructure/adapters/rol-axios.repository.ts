import { apiClient } from '../../../../core/http/api-client';
import type { Rol } from '../../domain/models/rol.model';
import type {
  AssignPermisosToRolParams,
  CreateRolParams,
  RolRepository,
  UpdateRolParams,
} from '../../domain/ports/rol.repository';
import type {
  DeleteRolApiResponseDto,
  RolApiResponseDto,
} from '../dtos/rol-api.dto';
import { RolMapper } from '../mappers/rol.mapper';

export class RolAxiosRepository implements RolRepository {
  private readonly basePath = '/roles';

  async findAll(): Promise<Rol[]> {
    const { data } = await apiClient.get<RolApiResponseDto[]>(this.basePath);
    return data.map(RolMapper.toDomain);
  }

  async findById(idRol: string): Promise<Rol> {
    const { data } = await apiClient.get<RolApiResponseDto>(
      `${this.basePath}/${idRol}`,
    );
    return RolMapper.toDomain(data);
  }

  async create(params: CreateRolParams): Promise<Rol> {
    const payload = RolMapper.toCreateRequest(params);
    const { data } = await apiClient.post<RolApiResponseDto>(this.basePath, payload);
    return RolMapper.toDomain(data);
  }

  async update(params: UpdateRolParams): Promise<Rol> {
    const payload = RolMapper.toUpdateRequest(params);
    const { data } = await apiClient.patch<RolApiResponseDto>(
      `${this.basePath}/${params.idRol}`,
      payload,
    );
    return RolMapper.toDomain(data);
  }

  async assignPermisos(params: AssignPermisosToRolParams): Promise<Rol> {
    const payload = RolMapper.toAssignPermisosRequest(params);
    const { data } = await apiClient.put<RolApiResponseDto>(
      `${this.basePath}/${params.idRol}/permisos`,
      payload,
    );
    return RolMapper.toDomain(data);
  }

  async delete(idRol: string): Promise<{ message: string }> {
    const { data } = await apiClient.delete<DeleteRolApiResponseDto>(
      `${this.basePath}/${idRol}`,
    );
    return { message: data.message };
  }
}

