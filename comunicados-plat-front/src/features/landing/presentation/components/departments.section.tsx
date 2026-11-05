import { Link } from 'react-router';
import { Store, Sparkles, Cpu, Briefcase, ArrowRight } from 'lucide-react';
import { SlideFadeTransition } from '../../../../shared/components/slide-fade-transition';
import {
  CORPORATE_DEPARTMENTS,
  type CorporateDepartmentInfo,
} from '../../domain/models/landing-info.model';

function DepartmentIcon({ iconKey }: { iconKey: CorporateDepartmentInfo['iconKey'] }) {
  switch (iconKey) {
    case 'store':
      return <Store className="w-5 h-5" />;
    case 'sparkles':
      return <Sparkles className="w-5 h-5" />;
    case 'cpu':
      return <Cpu className="w-5 h-5" />;
    case 'briefcase':
      return <Briefcase className="w-5 h-5" />;
  }
}

export function DepartmentsSection() {
  return (
    <section
      id="departamentos"
      aria-labelledby="departamentos-heading"
      className="py-12 sm:py-16 px-4 sm:px-8 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        {/* Encabezado */}
        <SlideFadeTransition
          trigger="scroll"
          direction="vertical"
          offset={28}
          preset="smooth"
          duration={0.32}
          transitionKey="departamentos-header"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 text-left">
            <div className="max-w-2xl">
              <span className="text-xs uppercase font-extrabold tracking-[0.18em] text-primario block mb-1">
                ESTRUCTURA ORGANIZACIONAL
              </span>
              <h2
                id="departamentos-heading"
                className="text-2xl sm:text-3xl font-extrabold text-texto-principal tracking-tight"
              >
                Departamentos Conectados en TERRA
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-texto-suave max-w-md">
              Cada colaborador recibe automáticamente los comunicados generales de la empresa más los
              específicos de su departamento asignado.
            </p>
          </div>
        </SlideFadeTransition>

        {/* Tarjetas por Departamento con aparición escalonada al hacer scroll */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {CORPORATE_DEPARTMENTS.map((dept, index) => (
            <SlideFadeTransition
              key={dept.id}
              trigger="scroll"
              direction="horizontal"
              offset={40}
              preset="smooth"
              duration={0.32}
              delay={index * 0.08}
              transitionKey={dept.id}
              className="h-full"
            >
              <article className="h-full rounded-terra-tarjeta bg-superficie-1 border-[1.5px] border-borde p-6 shadow-terra-card hover:border-borde-hover transition-all flex flex-col justify-between gap-4 text-left">
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-terra-boton bg-primario text-sobre-primario flex items-center justify-center shadow-terra-sm shrink-0">
                        <DepartmentIcon iconKey={dept.iconKey} />
                      </div>
                      <div>
                        <span className="text-[0.68rem] font-extrabold uppercase tracking-widest text-primario block">
                          {dept.code}
                        </span>
                        <h3 className="text-lg font-extrabold text-texto-principal leading-tight">
                          Departamento de {dept.name}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-texto-suave leading-relaxed">
                    {dept.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-borde-suave flex flex-wrap items-center gap-2">
                  {dept.typicalTopics.map((topic) => (
                    <span
                      key={topic}
                      className="px-2.5 py-1 rounded-terra-chico bg-superficie-2 border border-borde-suave text-xs font-semibold text-texto-principal"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </article>
            </SlideFadeTransition>
          ))}
        </div>

        {/* Banner CTA Final */}
        <SlideFadeTransition
          trigger="scroll"
          direction="vertical"
          offset={36}
          preset="spring"
          transitionKey="departamentos-cta"
        >
          <div className="rounded-terra-modal bg-superficie-crema border-[1.5px] border-borde p-6 sm:p-10 shadow-terra flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 text-left">
            <div className="max-w-xl">
              <span className="text-xs uppercase font-extrabold tracking-[0.18em] text-primario block mb-1">
                PORTAL INTERNO ACTIVO
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-texto-principal mb-2">
                ¿Listo para revisar tus comunicados del día?
              </h3>
              <p className="text-xs sm:text-sm text-texto-suave">
                Inicia sesión con tu correo corporativo TERRA para consultar las circulares de tu
                departamento y confirmar su lectura.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/login"
                className="min-h-[3rem] px-6 py-3 rounded-full bg-primario hover:bg-primario-hover text-sobre-primario font-extrabold text-sm shadow-terra-flotante flex items-center gap-2 transition-colors"
              >
                <span>Ir a Iniciar Sesión</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </SlideFadeTransition>
      </div>
    </section>
  );
}
