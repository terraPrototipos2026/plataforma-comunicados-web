import type { TipoAlcanceComunicado } from './comunicado.model';

export type RolEmisorSimulado =
  | 'ceo'
  | 'gerente_sucursal'
  | 'encargado_area'
  | 'operario';

export interface EvaluacionRolScope {
  autorizado: boolean;
  tituloBadge: string;
  descripcionPermiso: string;
  advertenciaRestriccion?: string;
  alcancesPermitidos: TipoAlcanceComunicado[];
}

export const JerarquiaAlcanceRules = {
  evaluar(rol: RolEmisorSimulado, alcance: TipoAlcanceComunicado): EvaluacionRolScope {
    switch (rol) {
      case 'ceo':
        return {
          autorizado: true,
          tituloBadge: 'Permiso Total Corporativo — Dirección General / CEO:',
          descripcionPermiso:
            'Tiene autorización completa e irrestricta. Puede emitir comunicados a Toda la Empresa (100% de la dotación), cualquier combinación de sucursales, cualquier departamento, a la red de encargados de área o a trabajadores específicos.',
          alcancesPermitidos: [
            'TODA_EMPRESA',
            'POR_SUCURSAL',
            'ENCARGADOS_AREA',
            'POR_DEPARTAMENTO',
            'NOMINATIVO',
          ],
        };

      case 'gerente_sucursal':
        if (alcance === 'TODA_EMPRESA') {
          return {
            autorizado: false,
            tituloBadge: 'Restricción de Alcance — Gerente de Sucursal:',
            descripcionPermiso:
              'Solo tiene permitido emitir comunicados oficiales hacia su propia sede corporativa y departamentos adscritos a su sucursal.',
            advertenciaRestriccion:
              'La emisión a "Toda la Empresa" requiere autorización de Dirección General.',
            alcancesPermitidos: ['POR_SUCURSAL', 'POR_DEPARTAMENTO', 'NOMINATIVO'],
          };
        }
        return {
          autorizado: true,
          tituloBadge: 'Permiso de Sede — Gerente de Sucursal:',
          descripcionPermiso:
            'Distribución autorizada para las dependencias de su sucursal corporativa.',
          alcancesPermitidos: ['POR_SUCURSAL', 'POR_DEPARTAMENTO', 'NOMINATIVO'],
        };

      case 'encargado_area':
        if (alcance === 'TODA_EMPRESA' || alcance === 'POR_SUCURSAL') {
          return {
            autorizado: false,
            tituloBadge: 'Restricción Departamental — Encargado de Área:',
            descripcionPermiso:
              'Solo puede emitir avisos hacia colaboradores de su propio departamento o a la red de jefaturas / encargados.',
            advertenciaRestriccion:
              'No tiene autorización para despachos a nivel de sucursal o toda la empresa.',
            alcancesPermitidos: ['ENCARGADOS_AREA', 'POR_DEPARTAMENTO', 'NOMINATIVO'],
          };
        }
        return {
          autorizado: true,
          tituloBadge: 'Permiso Departamental — Encargado de Área:',
          descripcionPermiso:
            'Distribución autorizada para los miembros de su departamento.',
          alcancesPermitidos: ['ENCARGADOS_AREA', 'POR_DEPARTAMENTO', 'NOMINATIVO'],
        };

      case 'operario':
      default:
        return {
          autorizado: false,
          tituloBadge: 'Emisión Bloqueada — Operario / Colaborador:',
          descripcionPermiso:
            'El rol actual no cuenta con privilegios para redactar o emitir comunicados oficiales (perfil solo lectura y confirmación de recepción).',
          advertenciaRestriccion: 'Emisión inhabilitada por directiva de seguridad.',
          alcancesPermitidos: [],
        };
    }
  },
};

