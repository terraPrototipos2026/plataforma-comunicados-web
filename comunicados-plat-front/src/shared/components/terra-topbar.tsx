import { Link } from 'react-router';
import { LayoutDashboard, LogIn, LogOut, ShieldCheck, UserCheck } from 'lucide-react';
import logoClaroImg from '../../assets/logoclaro.png';
import logoOscuroImg from '../../assets/logooscuro.png';
import { useAuthStore } from '../../core/store/use-auth-store';
import { useThemeStore } from '../../core/store/use-theme-store';
import { useLogoutMutation } from '../../features/auth/presentation/hooks/use-logout-mutation';
import { SettingsModalTrigger } from './settings-modal';

export function TerraBrandLogo() {
  const { theme, highContrast } = useThemeStore();
  const isDarkTheme = theme === 'dark' || highContrast;

  return (
    <Link
      to="/"
      aria-label="Inicio TERRA Colchones & Muebles"
      className="flex items-center min-h-[2.75rem] focus:outline-none rounded-terra-chico"
    >
      <img
        src={isDarkTheme ? logoOscuroImg : logoClaroImg}
        alt="TERRA Colchones & Muebles"
        className="h-16 sm:h-20 w-auto object-contain shrink-0 select-none -my-2"
      />
    </Link>
  );
}

export function TerraTopbar() {
  const { isAuthenticated, user } = useAuthStore();
  const logoutMutation = useLogoutMutation();

  return (
    <header className="sticky top-0 z-50 min-h-[4.5rem] bg-superficie-1/95 backdrop-blur-md border-b border-borde-suave pt-[env(safe-area-inset-top)] px-4 sm:px-8 flex items-center justify-between transition-colors">
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between gap-4">
        {/* Identidad de Marca TERRA con Logo Dinámico por Tema */}
        <TerraBrandLogo />

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

        {/* Controles Táctiles: Tuerca de Configuraciones y Acceso / Sesión */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <SettingsModalTrigger />

          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/dashboard"
                className="min-h-[2.75rem] h-11 px-4 rounded-full bg-primario text-sobre-primario hover:bg-primario-hover font-bold transition-all shadow-terra-flotante flex items-center gap-2 text-sm"
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                <span>Panel</span>
              </Link>

              <div className="hidden lg:flex items-center gap-2 min-h-[2.75rem] px-3.5 py-1 rounded-full bg-superficie-2 border border-borde text-left">
                <UserCheck className="w-4 h-4 text-primario shrink-0" />
                <div className="flex flex-col leading-tight">
                  <span className="text-xs font-extrabold text-texto-principal truncate max-w-[9rem]">
                    {user.nombre}
                  </span>
                  <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-primario">
                    {user.departamento} • {user.rol}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
                aria-label="Cerrar sesión"
                title="Cerrar sesión"
                className="min-h-[2.75rem] h-11 px-4 rounded-full bg-superficie-2 hover:bg-primario-claro border-[1.5px] border-borde hover:border-primario text-texto-principal hover:text-primario font-bold transition-colors flex items-center gap-2 text-sm cursor-pointer disabled:opacity-60"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span className="hidden md:inline">Salir</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="min-h-[2.75rem] h-11 px-5 rounded-full bg-primario text-sobre-primario font-bold hover:bg-primario-hover transition-all shadow-terra-flotante flex items-center gap-2 text-sm"
            >
              <LogIn className="w-4 h-4 shrink-0" />
              <span>Iniciar Sesión</span>
            </Link>
          )}
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
