import { apiClient } from '../../../../core/http/api-client';
import type { Usuario } from '../../domain/models/usuario.model';
import type {
  UsuarioRepository,
  RegisterUsuarioParams,
  UpdateUsuarioParams,
} from '../../domain/ports/usuario.repository';
import type {
  UsuarioApiResponseDto,
  RegisterUsuarioApiResponseDto,
} from '../dtos/usuario-api.dto';
import { UsuarioMapper } from '../mappers/usuario.mapper';

export class UsuarioAxiosRepository implements UsuarioRepository {
  async findAll(): Promise<Usuario[]> {
    const { data } = await apiClient.get<UsuarioApiResponseDto[]>('/usuarios');
    return data.map(UsuarioMapper.toDomain);
  }

  async findById(id: string): Promise<Usuario> {
    const { data } = await apiClient.get<UsuarioApiResponseDto>(`/usuarios/${id}`);
    return UsuarioMapper.toDomain(data);
  }

  async register(params: RegisterUsuarioParams): Promise<{ idUsuario: string; correo: string }> {
    const payload = UsuarioMapper.toRegisterApiRequest(params);
    const { data } = await apiClient.post<RegisterUsuarioApiResponseDto>('/auth/register', payload);
    return data;
  }

  async update(id: string, params: UpdateUsuarioParams): Promise<Usuario> {
    const payload = UsuarioMapper.toUpdateApiRequest(params);
    const { data } = await apiClient.patch<UsuarioApiResponseDto>(`/usuarios/${id}`, payload);
    return UsuarioMapper.toDomain(data);
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/usuarios/${id}`);
  }
}
