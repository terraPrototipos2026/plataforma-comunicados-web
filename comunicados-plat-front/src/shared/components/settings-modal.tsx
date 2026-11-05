import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Settings, Sun, Moon, Contrast, Type, Eye, RotateCcw, X } from 'lucide-react';
import { useThemeStore } from '../../core/store/use-theme-store';
import { SlideFadeTransition } from './slide-fade-transition';

export function SettingsModalTrigger() {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [anchorStyle, setAnchorStyle] = useState<{ top: number; right: number }>({
    top: 72,
    right: 16,
  });

  const {
    theme,
    highContrast,
    dyslexicFont,
    fontScale,
    toggleTheme,
    toggleHighContrast,
    toggleDyslexicFont,
    toggleFontScale,
    resetAccessibility,
  } = useThemeStore();

  const updateAnchorPosition = useCallback(() => {
    if (!triggerRef.current || typeof window === 'undefined') return;
    const rect = triggerRef.current.getBoundingClientRect();
    const rightOffset = Math.max(16, window.innerWidth - rect.right);
    const topOffset = rect.bottom + 10;

    setAnchorStyle({
      top: topOffset,
      right: rightOffset,
    });
  }, []);

  const handleToggle = () => {
    if (!isOpen) {
      updateAnchorPosition();
    }
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!isOpen) return;

    updateAnchorPosition();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', updateAnchorPosition);
    window.addEventListener('scroll', updateAnchorPosition, { passive: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', updateAnchorPosition);
      window.removeEventListener('scroll', updateAnchorPosition);
    };
  }, [isOpen, updateAnchorPosition]);

  const hasCustomSettings =
    theme === 'dark' || highContrast || dyslexicFont || fontScale === 'large';

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        aria-label="Abrir configuraciones de visualización y accesibilidad"
        title="Configuraciones"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className={`relative min-w-[2.75rem] min-h-[2.75rem] w-11 h-11 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
          isOpen || highContrast
            ? 'bg-primario text-sobre-primario border-primario'
            : 'border-borde bg-superficie-2 text-texto-principal hover:border-primario hover:text-primario'
        }`}
      >
        <Settings className="w-5 h-5" />
        {hasCustomSettings && !highContrast && (
          <span
            aria-hidden="true"
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primario"
          />
        )}
      </button>

      {typeof document !== 'undefined' &&
        createPortal(
          <>
            {/* Fondo clicable para cerrar al tocar fuera */}
            {isOpen && (
              <div
                aria-hidden="true"
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 z-[100] bg-black/45 backdrop-blur-xs transition-opacity"
              />
            )}

            <div
              style={{
                top: `${anchorStyle.top}px`,
                right: `${anchorStyle.right}px`,
              }}
              className="fixed z-[101] w-[calc(100vw-2rem)] max-w-[21.5rem] pointer-events-none"
            >
              <SlideFadeTransition
                isVisible={isOpen}
                direction="vertical"
                exitMode="reverse"
                offset={-16}
                preset="spring"
                transitionKey="settings-modal"
                className="pointer-events-auto origin-top-right"
              >
                {/* Contenedor del Modal anclado a la tuerca */}
                <div
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="settings-modal-title"
                  className="w-full rounded-terra-modal bg-superficie-1 border-[1.5px] border-borde p-5 shadow-terra text-left"
                >
              <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-borde-suave">
                <div>
                  <span className="text-[0.68rem] font-extrabold uppercase tracking-wider text-primario block">
                    Preferencias y Accesibilidad
                  </span>
                  <h2
                    id="settings-modal-title"
                    className="text-base sm:text-lg font-extrabold text-texto-principal"
                  >
                    Configuraciones
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Cerrar modal de configuraciones"
                  className="min-w-[2.75rem] min-h-[2.75rem] w-11 h-11 rounded-full hover:bg-superficie-2 flex items-center justify-center text-texto-suave hover:text-texto-principal transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col gap-2.5">
                {/* Opción 1: Tema Claro / Oscuro */}
                <button
                  type="button"
                  onClick={toggleTheme}
                  className={`min-h-[2.85rem] px-3.5 py-2.5 rounded-terra-boton border text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-primario text-sobre-primario border-primario'
                      : 'bg-superficie-2 text-texto-principal border-borde hover:border-primario'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    {theme === 'dark' ? (
                      <Moon className="w-4 h-4 shrink-0" />
                    ) : (
                      <Sun className="w-4 h-4 shrink-0" />
                    )}
                    Tema Visual
                  </span>
                  <span>{theme === 'dark' ? 'Oscuro Cálido' : 'Claro'}</span>
                </button>

                {/* Opción 2: Alto Contraste */}
                <button
                  type="button"
                  onClick={toggleHighContrast}
                  className={`min-h-[2.85rem] px-3.5 py-2.5 rounded-terra-boton border text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                    highContrast
                      ? 'bg-primario text-sobre-primario border-primario'
                      : 'bg-superficie-2 text-texto-principal border-borde hover:border-primario'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Contrast className="w-4 h-4 shrink-0" />
                    Alto Contraste
                  </span>
                  <span>{highContrast ? 'Activo' : 'Inactivo'}</span>
                </button>

                {/* Opción 3: Texto Ampliado */}
                <button
                  type="button"
                  onClick={toggleFontScale}
                  className={`min-h-[2.85rem] px-3.5 py-2.5 rounded-terra-boton border text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                    fontScale === 'large'
                      ? 'bg-primario text-sobre-primario border-primario'
                      : 'bg-superficie-2 text-texto-principal border-borde hover:border-primario'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Type className="w-4 h-4 shrink-0" />
                    Texto Ampliado (115%)
                  </span>
                  <span>{fontScale === 'large' ? '115%' : '100%'}</span>
                </button>

                {/* Opción 4: Fuente Hiperlegible */}
                <button
                  type="button"
                  onClick={toggleDyslexicFont}
                  className={`min-h-[2.85rem] px-3.5 py-2.5 rounded-terra-boton border text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                    dyslexicFont
                      ? 'bg-primario text-sobre-primario border-primario'
                      : 'bg-superficie-2 text-texto-principal border-borde hover:border-primario'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Eye className="w-4 h-4 shrink-0" />
                    Fuente Hiperlegible
                  </span>
                  <span>{dyslexicFont ? 'Atkinson' : 'Manrope'}</span>
                </button>

                {/* Botón Restablecer */}
                <button
                  type="button"
                  onClick={resetAccessibility}
                  className="min-h-[2.75rem] mt-1.5 px-3.5 py-2 rounded-terra-boton border border-borde-suave text-xs font-semibold text-texto-suave hover:text-texto-principal hover:bg-superficie-2 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Restablecer valores
                </button>
              </div>
                </div>
              </SlideFadeTransition>
            </div>
          </>,
          document.body,
        )}
    </>
  );
}
