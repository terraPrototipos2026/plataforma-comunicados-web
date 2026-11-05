import { Megaphone, Building, CheckCircle, Shield, AlertTriangle, Clock } from 'lucide-react';
import {
  LANDING_FEATURE_PILLARS,
  PRIORITY_LEVEL_SPECS,
  type ComunicadoPrioridadNivel,
  type LandingFeaturePillar,
} from '../../domain/models/landing-info.model';

function PillarIcon({ iconKey }: { iconKey: LandingFeaturePillar['iconKey'] }) {
  switch (iconKey) {
    case 'megaphone':
      return <Megaphone className="w-5 h-5" />;
    case 'building':
      return <Building className="w-5 h-5" />;
    case 'check-circle':
      return <CheckCircle className="w-5 h-5" />;
    case 'shield':
      return <Shield className="w-5 h-5" />;
  }
}

function getPriorityBadgeStyle(level: ComunicadoPrioridadNivel): string {
  switch (level) {
    case 'URGENTE':
      return 'bg-oferta text-white';
    case 'ALTA':
      return 'bg-primario text-sobre-primario';
    case 'MEDIA':
      return 'bg-primario-claro text-primario border border-primario/30';
    case 'BAJA':
      return 'bg-superficie-2 text-texto-suave border border-borde';
  }
}

export function FeaturesBentoSection() {
  return (
    <section
      id="pilares"
      aria-labelledby="pilares-heading"
      className="py-12 sm:py-16 px-4 sm:px-8 bg-superficie-crema border-y border-borde"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        {/* Cabecera de Sección */}
        <div className="max-w-2xl text-left flex flex-col gap-2">
          <span className="text-xs uppercase font-extrabold tracking-[0.18em] text-primario">
            ARQUITECTURA DE COMUNICACIÓN
          </span>
          <h2
            id="pilares-heading"
            className="text-2xl sm:text-3xl font-extrabold text-texto-principal tracking-tight"
          >
            Todo lo necesario para mantener alineado al equipo TERRA
          </h2>
          <p className="text-sm sm:text-base text-texto-suave">
            Cada comunicado se distribuye con prioridad clara, destinatarios definidos y respaldo
            de lectura para evitar pérdida de información crítica entre sucursales y oficinas.
          </p>
        </div>

        {/* Grid de Pilares (Tarjetas TERRA) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {LANDING_FEATURE_PILLARS.map((pillar) => (
            <article
              key={pillar.id}
              className="group rounded-terra-tarjeta bg-superficie-1 border-[1.5px] border-borde p-5 shadow-terra-card transition-all duration-200 hover:-translate-y-1 hover:shadow-terra motion-reduce:transform-none flex flex-col justify-between text-left"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-[0.7rem] font-extrabold uppercase tracking-wider text-primario">
                    {pillar.tag}
                  </span>
                  <div className="w-10 h-10 rounded-terra-chico bg-primario-claro text-primario flex items-center justify-center shrink-0">
                    <PillarIcon iconKey={pillar.iconKey} />
                  </div>
                </div>

                <h3 className="text-base font-extrabold text-texto-principal mb-2 leading-snug">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-texto-suave leading-relaxed mb-4">
                  {pillar.description}
                </p>
              </div>

              <div className="pt-3 border-t border-borde-suave flex items-center justify-between">
                <span className="text-xs font-bold text-texto-principal">{pillar.highlight}</span>
              </div>
            </article>
          ))}
        </div>

        {/* Clasificación Semántica por Niveles de Prioridad */}
        <div
          id="prioridades"
          className="rounded-terra-modal bg-superficie-1 border-[1.5px] border-borde p-6 sm:p-8 shadow-terra-card text-left"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-borde-suave">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-[0.18em] text-primario block mb-1">
                CLASIFICACIÓN DE MENSAJES
              </span>
              <h3 className="text-xl font-extrabold text-texto-principal">
                Niveles de Prioridad de los Comunicados
              </h3>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-terra-chico bg-superficie-2 border border-borde text-xs font-semibold text-texto-suave">
              <AlertTriangle className="w-4 h-4 text-primario shrink-0" />
              <span>Los comunicados URGENTES destacan al inicio del panel del colaborador</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PRIORITY_LEVEL_SPECS.map((spec) => (
              <div
                key={spec.level}
                className="rounded-terra bg-superficie-2 border border-borde p-4 flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[0.7rem] font-extrabold uppercase tracking-wider ${getPriorityBadgeStyle(spec.level)}`}
                    >
                      {spec.label}
                    </span>
                  </div>
                  <p className="text-xs text-texto-suave leading-relaxed">{spec.description}</p>
                </div>

                <div className="pt-2 border-t border-borde-suave flex items-center gap-1.5 text-[0.72rem] font-bold text-texto-principal">
                  <Clock className="w-3.5 h-3.5 text-primario shrink-0" />
                  <span>{spec.slaText}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

