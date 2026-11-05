import { useState } from 'react';
import { BellRing, CheckCircle2, Eye, EyeOff, Sparkles, ArrowRightLeft, X } from 'lucide-react';
import {
  SlideFadeTransition,
  type TransitionExitMode,
  type TransitionPreset,
} from './slide-fade-transition';

export function SlideFadeShowcase() {
  const [isVisible, setIsVisible] = useState(true);
  const [exitMode, setExitMode] = useState<TransitionExitMode>('through');
  const [preset, setPreset] = useState<TransitionPreset>('smooth');

  return (
    <section
      aria-labelledby="slide-fade-demo-heading"
      className="py-10 sm:py-12 px-4 sm:px-8 bg-fondo"
    >
      <div className="max-w-7xl mx-auto rounded-terra-modal bg-superficie-1 border-[1.5px] border-borde p-6 sm:p-8 shadow-terra-card text-left">
        {/* Encabezado y Controles de Interacción */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 mb-6 border-b border-borde-suave">
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase font-extrabold tracking-[0.18em] text-primario flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              VISTA PREVIA INTERACTIVA DE AVISO
            </span>
            <h2
              id="slide-fade-demo-heading"
              className="text-xl sm:text-2xl font-extrabold text-texto-principal"
            >
              Transición de Entrada y Salida de Comunicados (Fade + Slide)
            </h2>
            <p className="text-xs sm:text-sm text-texto-suave">
              Prueba la aparición desde la derecha (<code className="font-bold">x: 40px → 0</code>)
              y el desvanecimiento de salida al hacer clic.
            </p>
          </div>

          {/* Barra de Botones / Switches */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Switch de modo de salida */}
            <button
              type="button"
              onClick={() => setExitMode((prev) => (prev === 'through' ? 'reverse' : 'through'))}
              className="min-h-[2.75rem] px-3.5 py-2 rounded-terra-boton bg-superficie-2 hover:bg-superficie-crema border border-borde text-xs font-bold text-texto-principal flex items-center gap-2 transition-colors cursor-pointer"
              title="Cambiar dirección de salida"
            >
              <ArrowRightLeft className="w-4 h-4 text-primario shrink-0" />
              <span>
                Salida: {exitMode === 'through' ? 'Continua (x: -40px)' : 'Reversa (x: +40px)'}
              </span>
            </button>

            {/* Switch de curva de animación */}
            <button
              type="button"
              onClick={() => setPreset((prev) => (prev === 'smooth' ? 'spring' : 'smooth'))}
              className="min-h-[2.75rem] px-3.5 py-2 rounded-terra-boton bg-superficie-2 hover:bg-superficie-crema border border-borde text-xs font-bold text-texto-principal flex items-center gap-2 transition-colors cursor-pointer"
              title="Cambiar curva de animación"
            >
              <span>Curva: {preset === 'smooth' ? 'EaseInOut (280ms)' : 'Spring (300/25)'}</span>
            </button>

            {/* Botón Principal Disparador (Mount / Unmount) */}
            <button
              type="button"
              onClick={() => setIsVisible((prev) => !prev)}
              aria-expanded={isVisible}
              className="min-h-[2.75rem] px-5 py-2 rounded-full bg-primario hover:bg-primario-hover text-sobre-primario font-extrabold text-xs sm:text-sm shadow-terra-flotante flex items-center gap-2 transition-colors cursor-pointer"
            >
              {isVisible ? (
                <>
                  <EyeOff className="w-4 h-4 shrink-0" />
                  <span>Ocultar Comunicado</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 shrink-0" />
                  <span>Mostrar Comunicado</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Escenario con overflow-hidden para observar el desplazamiento limpio */}
        <div className="relative min-h-[11.5rem] rounded-terra-tarjeta bg-superficie-2 border border-borde p-4 sm:p-6 overflow-hidden flex items-center justify-center">
          <SlideFadeTransition
            isVisible={isVisible}
            direction="horizontal"
            exitMode={exitMode}
            offset={40}
            preset={preset}
            duration={0.28}
            className="w-full"
          >
            <article className="rounded-terra-tarjeta bg-superficie-1 border-[1.5px] border-borde p-5 shadow-terra flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-terra-boton bg-primario-claro text-primario flex items-center justify-center shrink-0 mt-0.5">
                  <BellRing className="w-5 h-5" />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-primario text-sobre-primario text-[0.68rem] font-extrabold uppercase tracking-wider">
                      Prioridad Alta
                    </span>
                    <span className="text-xs font-bold text-texto-suave">
                      CIR-2026-089 • Departamento de Sistemas
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-texto-principal">
                    Actualización del Portal Oficial de Comunicados Internos TERRA
                  </h3>
                  <p className="text-xs sm:text-sm text-texto-suave leading-relaxed">
                    Haz clic en &ldquo;Confirmar y Cerrar&rdquo; o en el botón superior para
                    disparar la animación de salida con desvanecimiento y traslación horizontal.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  type="button"
                  onClick={() => setIsVisible(false)}
                  className="min-h-[2.75rem] px-4 py-2 rounded-full bg-primario-claro hover:bg-primario hover:text-sobre-primario text-primario font-extrabold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Confirmar y Cerrar</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsVisible(false)}
                  aria-label="Cerrar tarjeta"
                  className="min-w-[2.75rem] min-h-[2.75rem] w-11 h-11 rounded-full hover:bg-superficie-2 text-texto-suave flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </article>
          </SlideFadeTransition>

          {!isVisible && (
            <div className="text-center flex flex-col items-center gap-2 py-4">
              <p className="text-xs sm:text-sm font-semibold text-texto-suave">
                El comunicado salió con desvanecimiento. Haz clic abajo para volver a montarlo.
              </p>
              <button
                type="button"
                onClick={() => setIsVisible(true)}
                className="min-h-[2.75rem] px-4 py-2 rounded-full bg-superficie-1 border border-primario text-primario hover:bg-primario hover:text-sobre-primario text-xs font-extrabold transition-colors cursor-pointer"
              >
                Volver a Mostrar (x: 40px → 0)
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

