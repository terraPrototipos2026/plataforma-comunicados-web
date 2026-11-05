import { useState } from 'react';
import { Accessibility, Type, Contrast, Eye, RotateCcw, X } from 'lucide-react';
import { useThemeStore } from '../../core/store/use-theme-store';

export function AccessibilityFab() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    highContrast,
    dyslexicFont,
    fontScale,
    toggleHighContrast,
    toggleDyslexicFont,
    toggleFontScale,
    resetAccessibility,
  } = useThemeStore();

  return (
    <aside
      aria-label="Herramientas de accesibilidad"
      className="fixed left-4 bottom-[calc(1.25rem+env(safe-area-inset-bottom))] z-40"
    >
      {isOpen && (
        <div className="mb-3 w-72 rounded-terra-modal bg-superficie-1 border-[1.5px] border-borde p-4 shadow-terra text-left">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-borde-suave">
            <div>
              <span className="text-[0.7rem] font-extrabold uppercase tracking-wider text-primario block">
                Inclusión TERRA
              </span>
              <h3 className="text-sm font-bold text-texto-principal">Opciones de Accesibilidad</h3>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar menú de accesibilidad"
              className="min-w-[2.75rem] min-h-[2.75rem] w-11 h-11 rounded-full hover:bg-superficie-2 flex items-center justify-center text-texto-suave cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={toggleHighContrast}
              className={`min-h-[2.75rem] px-3 py-2 rounded-terra-boton border text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                highContrast
                  ? 'bg-primario text-sobre-primario border-primario'
                  : 'bg-superficie-2 text-texto-principal border-borde hover:border-primario'
              }`}
            >
              <span className="flex items-center gap-2">
                <Contrast className="w-4 h-4" />
                Alto Contraste
              </span>
              <span>{highContrast ? 'Activo' : 'Inactivo'}</span>
            </button>

            <button
              type="button"
              onClick={toggleFontScale}
              className={`min-h-[2.75rem] px-3 py-2 rounded-terra-boton border text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                fontScale === 'large'
                  ? 'bg-primario text-sobre-primario border-primario'
                  : 'bg-superficie-2 text-texto-principal border-borde hover:border-primario'
              }`}
            >
              <span className="flex items-center gap-2">
                <Type className="w-4 h-4" />
                Texto Ampliado (115%)
              </span>
              <span>{fontScale === 'large' ? '115%' : '100%'}</span>
            </button>

            <button
              type="button"
              onClick={toggleDyslexicFont}
              className={`min-h-[2.75rem] px-3 py-2 rounded-terra-boton border text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                dyslexicFont
                  ? 'bg-primario text-sobre-primario border-primario'
                  : 'bg-superficie-2 text-texto-principal border-borde hover:border-primario'
              }`}
            >
              <span className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Fuente Hiperlegible
              </span>
              <span>{dyslexicFont ? 'Atkinson' : 'Manrope'}</span>
            </button>

            <button
              type="button"
              onClick={resetAccessibility}
              className="min-h-[2.75rem] mt-1 px-3 py-2 rounded-terra-boton border border-borde-suave text-xs font-semibold text-texto-suave hover:text-texto-principal hover:bg-superficie-2 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restablecer valores
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Opciones de accesibilidad"
        aria-expanded={isOpen}
        className="min-w-[3.5rem] min-h-[3.5rem] w-14 h-14 rounded-full bg-superficie-1 border-2 border-primario text-primario shadow-terra flex items-center justify-center hover:scale-105 transition-transform motion-reduce:transition-none cursor-pointer"
      >
        <Accessibility className="w-6 h-6" />
      </button>
    </aside>
  );
}

