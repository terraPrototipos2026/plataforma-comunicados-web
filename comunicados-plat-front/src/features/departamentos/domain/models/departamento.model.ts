export interface Departamento {
  idDepartamento: string;
  nombre: string;
  idSucursal?: string | null;
}

export const DepartamentoRules = {
  normalizeNombre(nombre: string): string {
    return nombre.trim().toLowerCase();
  },

  isValidNombre(nombre: string): boolean {
    const normalized = DepartamentoRules.normalizeNombre(nombre);
    return normalized.length >= 1 && normalized.length <= 100;
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

