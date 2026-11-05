export interface AuthUser {
  idUsuario: string;
  nombre: string;
  correo: string;
  rol: string;
  departamento: string;
  permisos: string[];
}

export interface AuthSession {
  accessToken: string;
  user: AuthUser;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const AuthRules = {
  isValidEmail(correo: string): boolean {
    return EMAIL_REGEX.test(correo.trim());
  },

  isValidPasswordInput(password: string): boolean {
    return password.trim().length > 0;
  },

  hasPermission(user: AuthUser | null, permiso: string): boolean {
    if (!user) return false;
    return user.permisos.includes(permiso);
  },

  hasRole(user: AuthUser | null, rol: string): boolean {
    if (!user) return false;
    return user.rol.toLowerCase() === rol.toLowerCase();
  },
};
