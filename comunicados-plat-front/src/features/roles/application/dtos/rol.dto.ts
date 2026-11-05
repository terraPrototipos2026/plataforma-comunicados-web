export interface CreateRolInput {
  nombre: string;
  permisoIds?: string[];
}

export interface UpdateRolInput {
  idRol: string;
  nombre: string;
}

export interface AssignPermisosToRolInput {
  idRol: string;
  permisoIds: string[];
}

