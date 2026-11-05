export interface ValidacionAlcanceInput {
  rolEmisor: string;
  tipoAlcance: string;
}

export interface ValidacionAlcanceOutput {
  autorizado: boolean;
  mensaje: string;
}

export class JerarquiaEmisorPolicy {
  public static evaluar(input: ValidacionAlcanceInput): ValidacionAlcanceOutput {
    const rol = (input.rolEmisor ?? '').toLowerCase().trim();
    const alcance = input.tipoAlcance;

    // 1. CEO / Administrador General: Acceso irrestricto
    if (rol.includes('admin') || rol.includes('ceo') || rol.includes('director')) {
      return {
        autorizado: true,
        mensaje: 'Permiso Total Corporativo — Dirección General / CEO: Puede emitir a Toda la Empresa, cualquier sucursal o departamento.',
      };
    }

    // 2. Gerente de Sucursal
    if (rol.includes('gerente')) {
      if (alcance === 'TODA_EMPRESA') {
        return {
          autorizado: false,
          mensaje: 'Restricción de Gerencia: Solo tiene permitido emitir comunicados hacia su propia sede y departamentos dependientes.',
        };
      }
      return {
        autorizado: true,
        mensaje: 'Permiso de Sede — Gerente de Sucursal: Distribución autorizada para su sede corporativa.',
      };
    }

    // 3. Encargado de Área / Jefatura
    if (rol.includes('encargado') || rol.includes('jefe') || rol.includes('lider')) {
      if (alcance === 'TODA_EMPRESA' || alcance === 'POR_SUCURSAL') {
        return {
          autorizado: false,
          mensaje: 'Restricción de Jefatura: Solo puede emitir comunicados internos de su departamento o a la red de encargados.',
        };
      }
      return {
        autorizado: true,
        mensaje: 'Permiso Departamental — Encargado de Área: Distribución autorizada para su departamento.',
      };
    }

    // 4. Operario / Colaborador base
    return {
      autorizado: false,
      mensaje: 'Acceso Restringido: El rol actual no cuenta con privilegios para emitir comunicados oficiales.',
    };
  }
}

