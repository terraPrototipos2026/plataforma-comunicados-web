import { apiClient } from '../../../../core/http/api-client';
import type { Departamento } from '../../domain/models/departamento.model';
import type {
  CreateDepartamentoParams,
  DepartamentoRepository,
  UpdateDepartamentoParams,
} from '../../domain/ports/departamento.repository';
import type {
  DeleteDepartamentoApiResponseDto,
  DepartamentoApiResponseDto,
} from '../dtos/departamento-api.dto';
import { DepartamentoMapper } from '../mappers/departamento.mapper';

export class DepartamentoAxiosRepository implements DepartamentoRepository {
  private readonly basePath = '/departamentos';

  async findAll(): Promise<Departamento[]> {
    const { data } = await apiClient.get<DepartamentoApiResponseDto[]>(this.basePath);
    return data.map(DepartamentoMapper.toDomain);
  }

  async findById(idDepartamento: string): Promise<Departamento> {
    const { data } = await apiClient.get<DepartamentoApiResponseDto>(
      `${this.basePath}/${idDepartamento}`,
    );
    return DepartamentoMapper.toDomain(data);
  }

  async create(params: CreateDepartamentoParams): Promise<Departamento> {
    const payload = DepartamentoMapper.toCreateRequest(params);
    const { data } = await apiClient.post<DepartamentoApiResponseDto>(
      this.basePath,
      payload,
    );
    return DepartamentoMapper.toDomain(data);
  }

  async update(params: UpdateDepartamentoParams): Promise<Departamento> {
    const payload = DepartamentoMapper.toUpdateRequest(params);
    const { data } = await apiClient.patch<DepartamentoApiResponseDto>(
      `${this.basePath}/${params.idDepartamento}`,
      payload,
    );
    return DepartamentoMapper.toDomain(data);
  }

  async delete(idDepartamento: string): Promise<{ message: string }> {
    const { data } = await apiClient.delete<DeleteDepartamentoApiResponseDto>(
      `${this.basePath}/${idDepartamento}`,
    );
    return { message: data.message };
  }
}

