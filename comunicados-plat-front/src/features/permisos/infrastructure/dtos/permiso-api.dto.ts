export interface PermisoApiResponseDto {
  idPermiso: string;
  nombre: string;
}

export interface CreatePermisoApiRequestDto {
  nombre: string;
}

export interface UpdatePermisoApiRequestDto {
  nombre: string;
}

export interface DeletePermisoApiResponseDto {
  message: string;
}

