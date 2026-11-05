export interface DepartamentoApiResponseDto {
  idDepartamento: string;
  nombre: string;
  idSucursal?: string | null;
}

export interface CreateDepartamentoApiRequestDto {
  nombre: string;
  idSucursal?: string | null;
}

export interface UpdateDepartamentoApiRequestDto {
  nombre: string;
  idSucursal?: string | null;
}

export interface DeleteDepartamentoApiResponseDto {
  message: string;
}

