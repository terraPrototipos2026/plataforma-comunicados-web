import { type PrismaClient } from '@prisma/client';

export async function seedComunicados(prisma: PrismaClient) {
  console.log('🌱 Sembrando catálogo oficial de comunicados...');

  // Asegurar autores
  const admin = await prisma.usuario.findFirst();
  if (!admin) {
    console.warn('⚠️ No hay usuarios para asignar como autor de comunicados.');
    return;
  }

  const sampleUsers = await prisma.usuario.findMany({ take: 200 });

  const comunicadosData = [
    {
      codigo: 'COM-2026-089',
      titulo: 'ALERTA URGENTE: Protocolo de Seguridad Ocupacional y Cambio de EPP en Planta...',
      extracto: 'Revisión obligatoria inmediata de protocolos de bioseguridad y renovación de cascos normados.',
      medioPublicacion: 'AVANZADO',
      prioridad: 'URGENTE',
      estado: 'PUBLICADO',
      tipoAlcance: 'TODA_EMPRESA',
      fechaPublicacion: new Date('2026-10-30T09:00:00Z'),
      contenido: '<p>Por medio del presente comunicado oficial se informa a todos los colaboradores del Grupo Terra el nuevo protocolo de uso estricto de EPP en plantas de producción y centros de distribución.</p>',
      urlArchivo: '/uploads/circular-seguridad-ocupacional.pdf',
      nombreArchivo: 'Circular_Oficial_Seguridad_2026.pdf',
      tamanoBytes: 2400000,
      numeroPaginas: 4,
      totalDestinatarios: 149,
      totalConfirmados: 122,
      imagenes: [
        {
          urlImagen: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80',
          nombreArchivo: 'afiche_seguridad.jpg',
          esPortada: true,
          orden: 0,
        },
      ],
    },
    {
      codigo: 'COM-2026-088',
      titulo: 'Calendario Oficial de Feriados y Turnos Rotativos de Fin de Año...',
      extracto: 'Programación de guardias, horarios especiales y feriados de fin de gestión.',
      medioPublicacion: 'AVANZADO',
      prioridad: 'IMPORTANTE',
      estado: 'PUBLICADO',
      tipoAlcance: 'TODA_EMPRESA',
      fechaPublicacion: new Date('2026-10-28T15:30:00Z'),
      contenido: '<p>Estimado equipo, adjuntamos la nómina de turnos rotativos y cronograma de atención en salas de exposición y centros logísticos para las fiestas de fin de año.</p>',
      urlArchivo: '/uploads/calendario-feriados-turnos.pdf',
      nombreArchivo: 'Calendario_Feriados_2026.pdf',
      tamanoBytes: 1800000,
      numeroPaginas: 3,
      totalDestinatarios: 191,
      totalConfirmados: 168,
      imagenes: [
        {
          urlImagen: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80',
          nombreArchivo: 'calendario_portada.jpg',
          esPortada: true,
          orden: 0,
        },
      ],
    },
    {
      codigo: 'COM-2026-087',
      titulo: 'Mantenimiento Preventivo de Servidores Centrales y Plataformas Web...',
      extracto: 'Interrupción momentánea de servicios entre las 23:00 y las 04:00 del domingo.',
      medioPublicacion: 'EXPRESS',
      prioridad: 'NORMAL',
      estado: 'PUBLICADO',
      tipoAlcance: 'TODA_EMPRESA',
      fechaPublicacion: new Date('2026-10-25T11:00:00Z'),
      contenido: '<p>Se realizarán tareas de mantenimiento preventivo y optimización de base de datos en los servidores corporativos centrales.</p>',
      totalDestinatarios: 191,
      totalConfirmados: 154,
      imagenes: [],
    },
    {
      codigo: 'COM-2026-086',
      titulo: 'Auditoría de Procesos Sanitarios y Certificación ISO 14001 en Sede...',
      extracto: 'Fechas de inspección externa y requerimientos documentales para las jefaturas.',
      medioPublicacion: 'AVANZADO',
      prioridad: 'IMPORTANTE',
      estado: 'PUBLICADO',
      tipoAlcance: 'POR_SUCURSAL',
      fechaPublicacion: new Date('2026-10-24T17:00:00Z'),
      contenido: '<p>La próxima semana se llevará a cabo la auditoría técnica de certificación ambiental en Casa Central y Planta Industrial.</p>',
      urlArchivo: '/uploads/guia-auditoria-iso.pdf',
      nombreArchivo: 'Guia_Auditoria_ISO14001.pdf',
      tamanoBytes: 3100000,
      numeroPaginas: 6,
      totalDestinatarios: 62,
      totalConfirmados: 54,
      imagenes: [
        {
          urlImagen: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=400&q=80',
          nombreArchivo: 'auditoria_iso.jpg',
          esPortada: true,
          orden: 0,
        },
      ],
    },
    {
      codigo: 'COM-2026-085',
      titulo: 'Borrador: Políticas de Compensación por Trabajo en Días Festivos...',
      extracto: 'Documento en revisión preliminar con gerencias de área.',
      medioPublicacion: 'AVANZADO',
      prioridad: 'NORMAL',
      estado: 'BORRADOR',
      tipoAlcance: 'POR_DEPARTAMENTO',
      fechaPublicacion: new Date('2026-10-31T09:10:00Z'),
      contenido: '<p>Borrador interno sobre directrices de horas extras, viáticos y compensación laboral en feriados nacionales.</p>',
      totalDestinatarios: 42,
      totalConfirmados: 0,
      imagenes: [],
    },
    {
      codigo: 'COM-2026-084',
      titulo: 'Programado: Lanzamiento de la Nueva Tarjeta de Beneficios TERRA Club...',
      extracto: 'Beneficios y convenios de descuento exclusivos para colaboradores y familias.',
      medioPublicacion: 'AVANZADO',
      prioridad: 'IMPORTANTE',
      estado: 'PROGRAMADO',
      tipoAlcance: 'TODA_EMPRESA',
      fechaPublicacion: new Date('2026-11-03T08:00:00Z'),
      fechaProgramada: new Date('2026-11-15T08:00:00Z'),
      contenido: '<p>Presentamos la nueva tarjeta digital TERRA Club con acceso a más de 50 comercios asociados y descuentos en farmacias y salud.</p>',
      urlArchivo: '/uploads/beneficios-terra-club.pdf',
      nombreArchivo: 'Brochure_Terra_Club_2026.pdf',
      tamanoBytes: 4200000,
      numeroPaginas: 8,
      totalDestinatarios: 191,
      totalConfirmados: 0,
      imagenes: [
        {
          urlImagen: 'https://images.unsplash.com/photo-1556742049-0a67e557229b?auto=format&fit=crop&w=400&q=80',
          nombreArchivo: 'portada_terra_club.jpg',
          esPortada: true,
          orden: 0,
        },
      ],
    },
  ];

  for (const c of comunicadosData) {
    const existing = await prisma.comunicado.findUnique({ where: { codigo: c.codigo } });
    if (existing) continue;

    const created = await prisma.comunicado.create({
      data: {
        codigo: c.codigo,
        titulo: c.titulo,
        extracto: c.extracto,
        medioPublicacion: c.medioPublicacion,
        prioridad: c.prioridad,
        estado: c.estado,
        tipoAlcance: c.tipoAlcance,
        fechaPublicacion: c.fechaPublicacion,
        fechaProgramada: c.fechaProgramada,
        idUsuario: admin.idUsuario,
        cuerpo: {
          create: {
            contenido: c.contenido,
            urlArchivo: c.urlArchivo,
            nombreArchivo: c.nombreArchivo,
            tamanoBytes: c.tamanoBytes,
            numeroPaginas: c.numeroPaginas,
          },
        },
        imagenes: {
          create: c.imagenes.map((img) => ({
            urlImagen: img.urlImagen,
            nombreArchivo: img.nombreArchivo,
            esPortada: img.esPortada,
            orden: img.orden,
          })),
        },
        notificaciones: {
          create: {
            tipo: 'PUSH_MOVIL',
            estado: c.estado === 'PUBLICADO' ? 'ENVIADA' : 'PENDIENTE',
          },
        },
      },
    });

    // Simular destinatarios si hay usuarios
    const targetCount = Math.min(c.totalDestinatarios, sampleUsers.length);
    const confirmedCount = Math.min(c.totalConfirmados, targetCount);

    for (let i = 0; i < targetCount; i++) {
      const u = sampleUsers[i];
      const isConfirmed = i < confirmedCount;
      await prisma.comunicadoDestinatario.create({
        data: {
          idComunicado: created.idComunicado,
          idUsuario: u.idUsuario,
          estadoLectura: isConfirmed ? 'CONFIRMADO' : 'PENDIENTE',
          fechaVisualizacion: isConfirmed ? new Date() : null,
          fechaConfirmacion: isConfirmed ? new Date() : null,
        },
      });
    }
  }

  console.log('  ✓ 6 Comunicados oficiales sembrados exitosamente.');
}

