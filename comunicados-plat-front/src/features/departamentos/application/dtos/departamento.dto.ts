export interface CreateDepartamentoInput {
  nombre: string;
  idSucursal?: string | null;
}

export interface UpdateDepartamentoInput {
  idDepartamento: string;
  nombre: string;
  idSucursal?: string | null;
}

