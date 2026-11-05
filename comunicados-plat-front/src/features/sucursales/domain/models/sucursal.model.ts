export interface Sucursal {
  idSucursal: string;
  nombre: string;
  direccion: string;
}

export const SucursalRules = {
  normalizeNombre(nombre: string): string {
    return nombre.trim();
  },

  normalizeDireccion(direccion: string): string {
    return direccion.trim();
  },

  isValidNombre(nombre: string): boolean {
    const trimmed = nombre.trim();
    return trimmed.length >= 2 && trimmed.length <= 100;
  },

  isValidDireccion(direccion: string): boolean {
    const trimmed = direccion.trim();
    return trimmed.length >= 3 && trimmed.length <= 255;
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

