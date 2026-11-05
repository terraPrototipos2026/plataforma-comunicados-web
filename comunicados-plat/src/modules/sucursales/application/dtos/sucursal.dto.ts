export interface CreateSucursalInput {
  nombre: string;
  direccion: string;
}

export interface UpdateSucursalInput {
  idSucursal: string;
  nombre?: string;
  direccion?: string;
}
