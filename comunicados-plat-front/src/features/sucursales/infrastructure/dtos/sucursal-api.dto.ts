export interface SucursalApiResponseDto {
  idSucursal: string;
  nombre: string;
  direccion: string;
}

export interface CreateSucursalApiRequestDto {
  nombre: string;
  direccion: string;
}

export interface UpdateSucursalApiRequestDto {
  nombre?: string;
  direccion?: string;
}

export interface DeleteSucursalApiResponseDto {
  message: string;
}

