import { Link } from 'react-router';
import { ChevronRight, BellRing, CheckCircle2, Building2, LockKeyhole } from 'lucide-react';
import portadaImg from '../../../../assets/portada2k.jpg';
import { SlideFadeTransition } from '../../../../shared/components/slide-fade-transition';

export function HeroPortadaSection() {
  return (
    <section
      id="portada"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden pb-10 sm:pb-14 lg:pb-20"
    >
      {/* Capa Base (z-0): Portada Oficial ajustada al grosor de la pantalla */}
      <div className="relative z-0 w-full bg-superficie-1 border-b border-borde overflow-hidden">
        <img
          src={portadaImg}
          alt="Portada oficial Terra Colchones y Muebles — Sistema de Comunicados, Comunicación Interna"
          className="w-full h-auto max-h-[calc(100svh-4.25rem)] object-cover object-center block select-none"
        />
        {/* Degradado inferior en z-10 para suavizar el encuentro con la capa superpuesta */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16 sm:h-28 lg:h-36 bg-gradient-to-t from-fondo via-fondo/40 to-transparent z-10"
        />
      </div>

      {/* Decoración cálida sutil de fondo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primario/6 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-primario/5 blur-3xl"
      />

      {/* Capa Superior (z-20): Se superpone sobre el sobrante inferior de la portada */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-8 -mt-2 sm:-mt-5 md:-mt-8 lg:-mt-10 xl:-mt-12 flex flex-col gap-6 lg:gap-8">
        {/* Bloque de Acción y Propuesta de Valor flotando sobre la portada */}
        <SlideFadeTransition
          trigger="scroll"
          direction="vertical"
          offset={36}
          preset="smooth"
          duration={0.35}
          transitionKey="hero-card"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center rounded-terra-modal bg-superficie-1/95 backdrop-blur-md border-[1.5px] border-borde p-6 sm:p-8 shadow-terra text-left">
            <div className="lg:col-span-7 flex flex-col gap-3">
              <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-primario-claro text-primario">
                <BellRing className="w-3.5 h-3.5 shrink-0" />
                <span className="text-xs font-extrabold uppercase tracking-[0.16em]">
                  Plataforma Corporativa TERRA
                </span>
              </div>

              <h1
                id="hero-heading"
                className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-texto-principal tracking-tight leading-[1.12]"
              >
                Comunicación interna clara, trazable y al alcance de cada departamento
              </h1>

              <p className="text-sm sm:text-base text-texto-suave leading-relaxed max-w-2xl">
                Consulta circulares oficiales, avisos operativos urgentes y normativas actualizadas de{' '}
                <strong className="font-bold text-texto-principal">
                  Terra Colchones &amp; Muebles
                </strong>
                . Diseñado para ofrecer lectura rápida tanto en estaciones de oficina como en
                terminales táctiles y dispositivos móviles.
              </p>
            </div>

            {/* Botones CTA con ergonomía táctil TERRA */}
            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center justify-end gap-3.5">
              <Link
                to="/login"
                className="group min-h-[3.5rem] px-6 py-2.5 rounded-full bg-primario hover:bg-primario-hover text-sobre-primario shadow-terra-flotante transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 motion-reduce:transform-none flex items-center gap-3.5 text-left"
              >
                <div className="w-9 h-9 rounded-full bg-white/18 flex items-center justify-center shrink-0">
                  <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[0.7rem] font-semibold uppercase tracking-wider opacity-85">
                    Portal Colaboradores
                  </span>
                  <span className="text-sm font-extrabold">Ingresar al Sistema</span>
                </div>
              </Link>

              <a
                href="#pilares"
                className="min-h-[3.5rem] px-5 py-2.5 rounded-full bg-superficie-2 hover:bg-superficie-crema text-texto-principal border-[1.5px] border-borde hover:border-primario font-bold text-sm flex items-center justify-center transition-colors"
              >
                Explorar Funciones
              </a>
            </div>
          </div>
        </SlideFadeTransition>

        {/* Cinta de Indicadores Clave con aparición escalonada al hacer scroll */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SlideFadeTransition
            trigger="scroll"
            direction="horizontal"
            offset={36}
            preset="smooth"
            duration={0.32}
            delay={0}
            transitionKey="hero-indicator-1"
            className="h-full"
          >
            <div className="h-full rounded-terra-tarjeta bg-superficie-1 border border-borde p-4 shadow-terra-card flex items-center gap-3.5 text-left">
              <div className="w-11 h-11 rounded-terra-boton bg-primario-claro text-primario flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-primario block">
                  4 Áreas Operativas
                </span>
                <p className="text-sm font-bold text-texto-principal">
                  Ventas, Marketing, Sistemas y Administración
                </p>
              </div>
            </div>
          </SlideFadeTransition>

          <SlideFadeTransition
            trigger="scroll"
            direction="horizontal"
            offset={36}
            preset="smooth"
            duration={0.32}
            delay={0.08}
            transitionKey="hero-indicator-2"
            className="h-full"
          >
            <div className="h-full rounded-terra-tarjeta bg-superficie-1 border border-borde p-4 shadow-terra-card flex items-center gap-3.5 text-left">
              <div className="w-11 h-11 rounded-terra-boton bg-primario-claro text-primario flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-primario block">
                  Acuse de Recibo
                </span>
                <p className="text-sm font-bold text-texto-principal">
                  Confirmación de lectura por colaborador
                </p>
              </div>
            </div>
          </SlideFadeTransition>

          <SlideFadeTransition
            trigger="scroll"
            direction="horizontal"
            offset={36}
            preset="smooth"
            duration={0.32}
            delay={0.16}
            transitionKey="hero-indicator-3"
            className="h-full"
          >
            <div className="h-full rounded-terra-tarjeta bg-superficie-1 border border-borde p-4 shadow-terra-card flex items-center gap-3.5 text-left">
              <div className="w-11 h-11 rounded-terra-boton bg-primario-claro text-primario flex items-center justify-center shrink-0">
                <LockKeyhole className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-primario block">
                  Acceso Protegido
                </span>
                <p className="text-sm font-bold text-texto-principal">
                  Roles verificados y sesiones cifradas
                </p>
              </div>
            </div>
          </SlideFadeTransition>
        </div>
      </div>
    </section>
  );
}
