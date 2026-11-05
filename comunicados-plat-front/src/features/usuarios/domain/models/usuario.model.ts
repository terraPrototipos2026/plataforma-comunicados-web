export interface Usuario {
  idUsuario: string;
  nombre: string;
  correo: string;
  telefono: string | null;
  idRol: string;
  rol: string;
  idDepartamento: string;
  departamento: string;
  createdAt: Date;
  updatedAt: Date;
}

export const UsuarioRules = {
  validarNombre(nombre: string): boolean {
    return nombre.trim().length >= 3 && nombre.trim().length <= 150;
  },

  validarCorreo(correo: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(correo.trim());
  },

  validarPassword(password: string): boolean {
    return password.length >= 6;
  },

  getIniciales(nombre: string): string {
    if (!nombre) return 'US';
    return nombre
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('');
  },
};

