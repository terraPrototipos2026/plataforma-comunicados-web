import type { AuthSession, AuthUser } from '../../domain/models/auth-user.model';
import type { LoginCredentials } from '../../domain/ports/auth.repository';
import type {
  AuthApiResponseDto,
  AuthUserApiDto,
  LoginApiRequestDto,
} from '../dtos/auth-api.dto';

export class AuthMapper {
  static toUserDomain(dto: AuthUserApiDto): AuthUser {
    return {
      idUsuario: dto.idUsuario,
      nombre: dto.nombre,
      correo: dto.correo,
      rol: dto.rol,
      departamento: dto.departamento,
      permisos: Array.isArray(dto.permisos) ? dto.permisos : [],
    };
  }

  static toDomain(dto: AuthApiResponseDto): AuthSession {
    return {
      accessToken: dto.accessToken,
      user: AuthMapper.toUserDomain(dto.user),
    };
  }

  static toLoginRequest(credentials: LoginCredentials): LoginApiRequestDto {
    return {
      correo: credentials.correo,
      password: credentials.password,
    };
  }
}
