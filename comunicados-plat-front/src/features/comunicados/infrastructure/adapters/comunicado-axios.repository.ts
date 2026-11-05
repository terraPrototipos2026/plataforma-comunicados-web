import { apiClient } from '../../../../core/http/api-client';
import type { Comunicado } from '../../domain/models/comunicado.model';
import type {
  ComunicadoRepository,
  CreateComunicadoParams,
  EstimarAlcanceParams,
  EstimarAlcanceResult,
  FilterComunicadosParams,
} from '../../domain/ports/comunicado.repository';
import type {
  ComunicadoApiResponseDto,
  EstimarAlcanceApiResponseDto,
} from '../dtos/comunicado-api.dto';
import { ComunicadoMapper } from '../mappers/comunicado.mapper';

export class ComunicadoAxiosRepository implements ComunicadoRepository {
  private readonly basePath = '/comunicados';

  async findAll(filters?: FilterComunicadosParams): Promise<Comunicado[]> {
    const { data } = await apiClient.get<ComunicadoApiResponseDto[]>(this.basePath, {
      params: {
        search: filters?.search,
        estado: filters?.estado,
        prioridad: filters?.prioridad,
        idSucursal: filters?.idSucursal,
      },
    });
    return data.map(ComunicadoMapper.toDomain);
  }

  async findById(idComunicado: string): Promise<Comunicado> {
    const { data } = await apiClient.get<ComunicadoApiResponseDto>(`${this.basePath}/${idComunicado}`);
    return ComunicadoMapper.toDomain(data);
  }

  async create(params: CreateComunicadoParams): Promise<Comunicado> {
    const payload = ComunicadoMapper.toCreateApiRequest(params);
    const { data } = await apiClient.post<ComunicadoApiResponseDto>(this.basePath, payload);
    return ComunicadoMapper.toDomain(data);
  }

  async estimarAlcance(params: EstimarAlcanceParams): Promise<EstimarAlcanceResult> {
    const { data } = await apiClient.post<EstimarAlcanceApiResponseDto>(
      `${this.basePath}/estimar-alcance`,
      params,
    );
    return data;
  }

  async registrarLectura(idComunicado: string, confirmar: boolean = true): Promise<{ message: string }> {
    const { data } = await apiClient.patch<{ message: string }>(
      `${this.basePath}/${idComunicado}/lectura`,
      { confirmar },
    );
    return data;
  }

  async anular(idComunicado: string): Promise<{ message: string }> {
    const { data } = await apiClient.patch<{ message: string }>(
      `${this.basePath}/${idComunicado}/anular`,
    );
    return data;
  }
}

