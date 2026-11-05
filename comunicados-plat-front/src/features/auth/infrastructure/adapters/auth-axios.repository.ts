import { apiClient } from '../../../../core/http/api-client';
import type { AuthSession } from '../../domain/models/auth-user.model';
import type { AuthRepository, LoginCredentials } from '../../domain/ports/auth.repository';
import type { AuthApiResponseDto, LogoutApiResponseDto } from '../dtos/auth-api.dto';
import { AuthMapper } from '../mappers/auth.mapper';

export class AuthAxiosRepository implements AuthRepository {
  private readonly basePath = '/auth';

  async login(credentials: LoginCredentials): Promise<AuthSession> {
    const payload = AuthMapper.toLoginRequest(credentials);
    const { data } = await apiClient.post<AuthApiResponseDto>(`${this.basePath}/login`, payload);
    return AuthMapper.toDomain(data);
  }

  async refresh(): Promise<AuthSession> {
    const { data } = await apiClient.post<AuthApiResponseDto>(`${this.basePath}/refresh`, {});
    return AuthMapper.toDomain(data);
  }

  async logout(): Promise<void> {
    await apiClient.post<LogoutApiResponseDto>(`${this.basePath}/logout`, {});
  }
}
