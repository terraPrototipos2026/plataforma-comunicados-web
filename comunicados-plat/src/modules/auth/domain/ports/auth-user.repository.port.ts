export interface CreateUserData {
  nombre: string;
  correo: string;
  password: string;
  telefono?: string;
  idRol: string;
  idDepartamento: string;
}

export interface AuthUserDetails {
  idUsuario: string;
  nombre: string;
  correo: string;
  password: string;
  telefono: string | null;
  idRol: string;
  rol: string;
  idDepartamento: string;
  departamento: string;
  permisos: string[];
}

export interface AuthUserRepositoryPort {
  create(data: CreateUserData): Promise<string>;
  findByEmail(correo: string): Promise<AuthUserDetails | null>;
  findByEmailWithRolesAndPermissions(correo: string): Promise<AuthUserDetails | null>;
  findByIdWithRolesAndPermissions(idUsuario: string): Promise<AuthUserDetails | null>;
  findRoleIdByName(nombre: string): Promise<string | null>;
  findDepartmentIdByName(nombre: string): Promise<string | null>;
}

