import { Link } from 'react-router';
import { Moon, Sun, Contrast, LogIn, ShieldCheck } from 'lucide-react';
import { useThemeStore } from '../../core/store/use-theme-store';

export function TerraTopbar() {
  const { theme, highContrast, toggleTheme, toggleHighContrast } = useThemeStore();

  return (
    <header className="sticky top-0 z-50 min-h-[4.25rem] bg-superficie-1/95 backdrop-blur-md border-b border-borde-suave pt-[env(safe-area-inset-top)] px-4 sm:px-8 flex items-center justify-between transition-colors">
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between gap-4">
        {/* Identidad de Marca TERRA */}
        <Link
          to="/"
          className="flex items-center gap-3 min-h-[2.75rem] focus:outline-none rounded-terra-chico"
        >
          <div className="w-10 h-10 rounded-terra-boton bg-primario text-sobre-primario flex items-center justify-center font-extrabold text-lg shadow-terra-sm shrink-0">
            T
          </div>
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-extrabold tracking-tight text-texto-principal leading-none">
                TERRA
              </span>
              <span className="text-[0.65rem] font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-primario-claro text-primario">
                Interno
              </span>
            </div>
            <span className="text-xs text-texto-suave font-medium leading-tight">
              Colchones &amp; Muebles
            </span>
          </div>
        </Link>

        {/* Navegación Rápida (Desktop) */}
        <nav aria-label="Navegación principal" className="hidden md:flex items-center gap-6">
          <a
            href="#portada"
            className="min-h-[2.75rem] px-2 inline-flex items-center text-sm font-semibold text-texto-suave hover:text-primario transition-colors"
          >
            Portada
          </a>
          <a
            href="#pilares"
            className="min-h-[2.75rem] px-2 inline-flex items-center text-sm font-semibold text-texto-suave hover:text-primario transition-colors"
          >
            Funcionalidades
          </a>
          <a
            href="#departamentos"
            className="min-h-[2.75rem] px-2 inline-flex items-center text-sm font-semibold text-texto-suave hover:text-primario transition-colors"
          >
            Departamentos
          </a>
          <a
            href="#prioridades"
            className="min-h-[2.75rem] px-2 inline-flex items-center text-sm font-semibold text-texto-suave hover:text-primario transition-colors"
          >
            Niveles de Aviso
          </a>
        </nav>

        {/* Controles Táctiles: Tema, Alto Contraste y Acceso */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Activar modo oscuro cálido' : 'Activar modo claro'}
            title={theme === 'light' ? 'Modo oscuro cálido' : 'Modo claro'}
            className="min-w-[2.75rem] min-h-[2.75rem] w-11 h-11 rounded-full border border-borde bg-superficie-2 text-texto-principal flex items-center justify-center hover:border-primario hover:text-primario transition-colors cursor-pointer"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>

          <button
            type="button"
            onClick={toggleHighContrast}
            aria-label="Alternar modo de alto contraste accesible"
            title="Alto contraste accesible"
            aria-pressed={highContrast}
            className={`min-w-[2.75rem] min-h-[2.75rem] w-11 h-11 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
              highContrast
                ? 'bg-primario text-sobre-primario border-primario'
                : 'border-borde bg-superficie-2 text-texto-principal hover:border-primario hover:text-primario'
            }`}
          >
            <Contrast className="w-5 h-5" />
          </button>

          <Link
            to="/login"
            className="min-h-[2.75rem] h-11 px-5 rounded-full bg-primario text-sobre-primario font-bold hover:bg-primario-hover transition-all shadow-terra-flotante flex items-center gap-2 text-sm"
          >
            <LogIn className="w-4 h-4 shrink-0" />
            <span>Iniciar Sesión</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

export function TopInstitutionalBanner() {
  return (
    <div className="bg-superficie-crema border-b border-borde px-4 py-2 text-xs text-texto-suave">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-semibold text-texto-principal">
          <ShieldCheck className="w-4 h-4 text-primario shrink-0" />
          <span>Canal Oficial de Comunicación Interna — Terra Colchones &amp; Muebles</span>
        </div>
        <span className="hidden sm:inline text-texto-suave">
          Acceso exclusivo para personal autorizado • Ventas, Marketing, Sistemas y Administración
        </span>
      </div>
    </div>
  );
}

