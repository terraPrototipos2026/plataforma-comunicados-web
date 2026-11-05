export interface LoginApiRequestDto {
  correo: string;
  password: string;
}

export interface AuthUserApiDto {
  idUsuario: string;
  nombre: string;
  correo: string;
  rol: string;
  departamento: string;
  permisos: string[];
}

export interface AuthApiResponseDto {
  accessToken: string;
  user: AuthUserApiDto;
}

export interface LogoutApiResponseDto {
  message: string;
}
