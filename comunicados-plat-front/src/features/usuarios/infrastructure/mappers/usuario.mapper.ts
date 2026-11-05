import type { Usuario } from '../../domain/models/usuario.model';
import type { RegisterUsuarioParams, UpdateUsuarioParams } from '../../domain/ports/usuario.repository';
import type {
  UsuarioApiResponseDto,
  RegisterUsuarioApiRequestDto,
  UpdateUsuarioApiRequestDto,
} from '../dtos/usuario-api.dto';

export class UsuarioMapper {
  static toDomain(dto: UsuarioApiResponseDto): Usuario {
    return {
      idUsuario: dto.idUsuario,
      nombre: dto.nombre,
      correo: dto.correo,
      telefono: dto.telefono,
      idRol: dto.idRol,
      rol: dto.rol,
      idDepartamento: dto.idDepartamento,
      departamento: dto.departamento,
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt),
    };
  }

  static toRegisterApiRequest(params: RegisterUsuarioParams): RegisterUsuarioApiRequestDto {
    return {
      nombre: params.nombre,
      correo: params.correo,
      password: params.password,
      telefono: params.telefono,
      rol: params.rol,
      departamento: params.departamento,
    };
  }

  static toUpdateApiRequest(params: UpdateUsuarioParams): UpdateUsuarioApiRequestDto {
    return {
      nombre: params.nombre,
      correo: params.correo,
      telefono: params.telefono,
      rol: params.rol,
      departamento: params.departamento,
    };
  }
}
