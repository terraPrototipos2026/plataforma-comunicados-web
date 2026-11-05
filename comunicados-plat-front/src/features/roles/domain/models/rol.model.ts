export interface RolPermisoItem {
  idPermiso: string;
  nombre: string;
}

export interface Rol {
  idRol: string;
  nombre: string;
  permisos: RolPermisoItem[];
}

export const RolRules = {
  normalizeNombre(nombre: string): string {
    return nombre.trim().toLowerCase();
  },

  isValidNombre(nombre: string): boolean {
    const normalized = RolRules.normalizeNombre(nombre);
    return normalized.length >= 1 && normalized.length <= 50;
  },

  deduplicatePermisoIds(permisoIds: readonly string[]): string[] {
    return Array.from(
      new Set(permisoIds.map((id) => id.trim()).filter((id) => id.length > 0)),
    );
  },

  formatDisplayName(nombre: string): string {
    const trimmed = nombre.trim();
    if (!trimmed) return '';
    return trimmed
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  },
};

