export type ComunicadoPrioridadNivel = 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE';

export interface LandingFeaturePillar {
  id: string;
  tag: string;
  title: string;
  description: string;
  highlight: string;
  iconKey: 'megaphone' | 'building' | 'check-circle' | 'shield';
}

export interface CorporateDepartmentInfo {
  id: string;
  name: string;
  code: string;
  description: string;
  typicalTopics: string[];
  iconKey: 'store' | 'sparkles' | 'cpu' | 'briefcase';
}

export interface PriorityLevelSpec {
  level: ComunicadoPrioridadNivel;
  label: string;
  slaText: string;
  description: string;
}

export const LANDING_FEATURE_PILLARS: readonly LandingFeaturePillar[] = [
  {
    id: 'difusion-oficial',
    tag: 'CANAL CENTRALIZADO',
    title: 'Difusión Oficial Instantánea',
    description:
      'Publicación estructurada de circulares corporativas, políticas internas y novedades operativas en un único punto de verdad.',
    highlight: '100% libre de ruido informal',
    iconKey: 'megaphone',
  },
  {
    id: 'segmentacion-departamental',
    tag: 'ALCANCE PRECISO',
    title: 'Segmentación por Departamento',
    description:
      'Envía comunicados globales a toda la organización o focalizados exclusivamente para Ventas, Marketing, Sistemas o Administración.',
    highlight: '4 áreas operativas conectadas',
    iconKey: 'building',
  },
  {
    id: 'acuse-lectura',
    tag: 'TRAZABILIDAD REAL',
    title: 'Confirmación y Acuse de Lectura',
    description:
      'Seguimiento transparente de quién ha visualizado cada comunicado crítico y qué avisos permanecen pendientes de revisión.',
    highlight: 'Control de cumplimiento en tiempo real',
    iconKey: 'check-circle',
  },
  {
    id: 'seguridad-roles',
    tag: 'PROTECCIÓN CORPORATIVA',
    title: 'Control de Acceso Basado en Roles',
    description:
      'Autenticación robusta con rotación de sesiones seguras y permisos granulares según el perfil del colaborador en TERRA.',
    highlight: 'Sesiones protegidas con JWT + Argon2',
    iconKey: 'shield',
  },
];

export const CORPORATE_DEPARTMENTS: readonly CorporateDepartmentInfo[] = [
  {
    id: 'ventas',
    name: 'Ventas',
    code: 'DEP-VEN',
    description:
      'Actualizaciones de listas de precios, lanzamientos de líneas de colchones y muebles, metas comerciales y protocolos de atención en sala.',
    typicalTopics: ['Catálogo y Precios', 'Metas Mensuales', 'Protocolo en Tienda'],
    iconKey: 'store',
  },
  {
    id: 'marketing',
    name: 'Marketing',
    code: 'DEP-MKT',
    description:
      'Lineamientos de marca TERRA, campañas promocionales vigentes, material POP para exhibición y calendario de eventos.',
    typicalTopics: ['Campañas Activas', 'Identidad Visual', 'Promociones de Temporada'],
    iconKey: 'sparkles',
  },
  {
    id: 'sistemas',
    name: 'Sistemas',
    code: 'DEP-SIS',
    description:
      'Ventanas de mantenimiento programado, actualizaciones de plataforma, políticas de ciberseguridad y soporte técnico interno.',
    typicalTopics: ['Mantenimiento TI', 'Seguridad Digital', 'Nuevas Herramientas'],
    iconKey: 'cpu',
  },
  {
    id: 'administrativo',
    name: 'Administrativo',
    code: 'DEP-ADM',
    description:
      'Comunicados de Recursos Humanos, normativas internas, calendario de días festivos, bienestar laboral y procedimientos contables.',
    typicalTopics: ['Recursos Humanos', 'Normativa Interna', 'Bienestar y Cultura'],
    iconKey: 'briefcase',
  },
];

export const PRIORITY_LEVEL_SPECS: readonly PriorityLevelSpec[] = [
  {
    level: 'URGENTE',
    label: 'Urgente',
    slaText: 'Lectura inmediata requerida',
    description: 'Avisos críticos de operación, seguridad o cambios inmediatos en sucursales.',
  },
  {
    level: 'ALTA',
    label: 'Alta Prioridad',
    slaText: 'Revisión durante la jornada',
    description: 'Directrices gerenciales, cierres operativos y actualizaciones comerciales clave.',
  },
  {
    level: 'MEDIA',
    label: 'Prioridad Media',
    slaText: 'Revisión en 24–48 horas',
    description: 'Circulares departamentales, capacitaciones programadas y procedimientos.',
  },
  {
    level: 'BAJA',
    label: 'Informativo / Baja',
    slaText: 'Consulta general',
    description: 'Boletines culturales, efemérides, reconocimientos y noticias generales.',
  },
];

