export interface Permiso {
  idPermiso: string;
  nombre: string;
}

export const PermisoRules = {
  normalizeNombre(nombre: string): string {
    return nombre.trim().toLowerCase();
  },

  isValidNombre(nombre: string): boolean {
    const normalized = PermisoRules.normalizeNombre(nombre);
    return normalized.length >= 1 && normalized.length <= 100;
  },
};
