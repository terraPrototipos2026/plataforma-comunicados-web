export interface RolPermisoItemApiDto {
  idPermiso: string;
  nombre: string;
}

export interface RolApiResponseDto {
  idRol: string;
  nombre: string;
  permisos: RolPermisoItemApiDto[];
}

export interface CreateRolApiRequestDto {
  nombre: string;
  permisoIds?: string[];
}

export interface UpdateRolApiRequestDto {
  nombre: string;
}

export interface AssignPermisosToRolApiRequestDto {
  permisoIds: string[];
}

export interface DeleteRolApiResponseDto {
  message: string;
}

