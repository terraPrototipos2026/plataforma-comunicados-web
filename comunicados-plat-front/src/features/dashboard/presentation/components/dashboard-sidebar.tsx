import { useEffect } from 'react';
import { Link } from 'react-router';
import {
  LayoutDashboard,
  Megaphone,
  Users,
  Shield,
  Building2,
  Bell,
  UserCircle2,
  LogOut,
  X,
  ShieldCheck,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import logoClaroImg from '../../../../assets/logoclaro.png';
import logoOscuroImg from '../../../../assets/logooscuro.png';
import { useAuthStore } from '../../../../core/store/use-auth-store';
import { useThemeStore } from '../../../../core/store/use-theme-store';
import { useLogoutMutation } from '../../../auth/presentation/hooks/use-logout-mutation';
import type { DashboardNavKey } from '../../domain/models/dashboard.model';
import { useDashboardUiStore } from '../store/use-dashboard-ui-store';

interface NavItemConfig {
  key: DashboardNavKey;
  label: string;
  badge?: string;
  icon: typeof LayoutDashboard;
}

const MAIN_NAV_ITEMS: readonly NavItemConfig[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'comunicados', label: 'Comunicados', icon: Megaphone },
  { key: 'usuarios', label: 'Usuarios', icon: Users },
  { key: 'roles-permisos', label: 'Roles y Permisos', icon: Shield },
  { key: 'departamentos', label: 'Departamentos', icon: Building2 },
  { key: 'notifications', label: 'Notificaciones', badge: '4', icon: Bell },
  { key: 'profile', label: 'Perfil', icon: UserCircle2 },
];

export function DashboardSidebar() {
  const activeNav = useDashboardUiStore((state) => state.activeNav);
  const isMobileSidebarOpen = useDashboardUiStore((state) => state.isMobileSidebarOpen);
  const isSidebarCollapsed = useDashboardUiStore((state) => state.isSidebarCollapsed);
  const setActiveNav = useDashboardUiStore((state) => state.setActiveNav);
  const closeMobileSidebar = useDashboardUiStore((state) => state.closeMobileSidebar);
  const toggleSidebarCollapse = useDashboardUiStore((state) => state.toggleSidebarCollapse);

  const user = useAuthStore((state) => state.user);
  const theme = useThemeStore((state) => state.theme);
  const highContrast = useThemeStore((state) => state.highContrast);
  const logoutMutation = useLogoutMutation();

  const currentLogo = theme === 'dark' || highContrast ? logoOscuroImg : logoClaroImg;

  useEffect(() => {
    if (!isMobileSidebarOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMobileSidebar();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileSidebarOpen, closeMobileSidebar]);

  return (
    <>
      {/* Backdrop para móvil / tablet cuando el sidebar está desplegado */}
      {isMobileSidebarOpen && (
        <div
          aria-hidden="true"
          onClick={closeMobileSidebar}
          className="fixed inset-0 z-40 bg-black/55 backdrop-blur-xs xl:hidden transition-opacity motion-reduce:transition-none"
        />
      )}

      {/* Floating Sidebar Retráctil con Tokens de Superficie TERRA (Warm Modern Retail) */}
      <aside
        aria-label="Menú lateral de administración"
        className={`fixed top-0 left-0 bottom-0 z-50 w-[16.25rem] ${
          isSidebarCollapsed ? 'xl:w-[5.25rem]' : 'xl:w-[16.25rem]'
        } m-3 sm:m-4 rounded-terra-modal bg-superficie-1 text-texto-principal border-[1.5px] border-borde shadow-terra-card flex flex-col justify-between overflow-hidden transition-all duration-300 ease-out motion-reduce:transition-none ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-[115%] xl:translate-x-0'
        }`}
      >
        {/* Cabecera Superior con Logo TERRA y Botón Retráctil */}
        <div className="p-3.5 pb-2">
          <div
            className={`flex items-center ${
              isSidebarCollapsed ? 'xl:flex-col xl:justify-center xl:gap-2' : 'justify-between gap-2'
            } px-1.5 py-1`}
          >
            <Link
              to="/dashboard"
              onClick={() => setActiveNav('dashboard')}
              title="Material TERRA — Admin Console 2.0"
              className={`flex items-center gap-3 min-h-[2.75rem] focus:outline-none rounded-terra-chico group ${
                isSidebarCollapsed ? 'xl:justify-center' : ''
              }`}
            >
              <img
                src={currentLogo}
                alt="TERRA Colchones & Muebles"
                className={`${
                  isSidebarCollapsed ? 'xl:h-9' : 'h-11'
                } h-11 w-auto object-contain shrink-0 select-none transition-all`}
              />
              <div
                className={`flex flex-col text-left ${
                  isSidebarCollapsed ? 'xl:hidden' : ''
                }`}
              >
                <span className="text-xs font-extrabold tracking-tight text-texto-principal leading-tight">
                  Material TERRA
                </span>
                <span className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-texto-suave">
                  Admin Console 2.0
                </span>
              </div>
            </Link>

            {/* Botón para contraer / expandir en Desktop (XL) */}
            <button
              type="button"
              onClick={toggleSidebarCollapse}
              aria-label={isSidebarCollapsed ? 'Expandir menú lateral' : 'Contraer menú lateral'}
              title={isSidebarCollapsed ? 'Expandir menú lateral' : 'Contraer menú lateral'}
              className="hidden xl:flex min-w-[2.25rem] min-h-[2.25rem] w-9 h-9 rounded-terra-chico bg-superficie-2 hover:bg-primario-claro border border-borde text-texto-suave hover:text-primario items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              {isSidebarCollapsed ? (
                <PanelLeftOpen className="w-4 h-4" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </button>

            {/* Botón cerrar en Móvil */}
            <button
              type="button"
              onClick={closeMobileSidebar}
              aria-label="Cerrar menú lateral"
              className="xl:hidden min-w-[2.75rem] min-h-[2.75rem] w-11 h-11 rounded-full text-texto-suave hover:text-texto-principal hover:bg-superficie-2 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Divisor degradado sutil */}
          <div
            aria-hidden="true"
            className="mt-3 mb-2 h-px w-full bg-gradient-to-r from-transparent via-borde to-transparent"
          />
        </div>

        {/* Navegación Principal */}
        <nav
          aria-label="Secciones del panel"
          className={`flex-1 overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
            isSidebarCollapsed ? 'xl:px-2' : 'px-3.5'
          } px-3.5 py-1 flex flex-col gap-1.5`}
        >
          <span
            className={`px-3 py-1 text-[0.65rem] font-extrabold uppercase tracking-[0.18em] text-texto-suave ${
              isSidebarCollapsed ? 'xl:hidden' : ''
            }`}
          >
            Módulos Principales
          </span>

          {MAIN_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.key;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveNav(item.key)}
                title={item.label}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
                className={`relative group w-full min-h-[2.95rem] ${
                  isSidebarCollapsed ? 'xl:px-0 xl:justify-center' : 'px-3.5 justify-between'
                } px-3.5 py-2.5 rounded-terra-boton flex items-center gap-3 text-left text-sm font-bold transition-all duration-200 motion-reduce:transition-none cursor-pointer ${
                  isActive
                    ? highContrast
                      ? 'bg-primario text-sobre-primario border border-white'
                      : 'bg-primario-claro text-primario border border-primario/25 shadow-2xs'
                    : 'text-texto-suave hover:text-texto-principal hover:bg-superficie-2'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon
                    className={`w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-105 motion-reduce:transform-none ${
                      isActive
                        ? highContrast
                          ? 'text-sobre-primario'
                          : 'text-primario'
                        : 'text-texto-suave group-hover:text-primario'
                    }`}
                  />
                  <span className={isSidebarCollapsed ? 'xl:hidden' : ''}>{item.label}</span>
                </span>

                {item.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[0.68rem] font-extrabold ${
                      isSidebarCollapsed
                        ? 'xl:absolute xl:top-1 xl:right-1 xl:px-1.5 xl:py-0 xl:text-[0.6rem]'
                        : ''
                    } ${
                      item.badge.includes('urgente')
                        ? 'bg-rojo-urgente text-white shadow-sm'
                        : isActive
                        ? 'bg-primario text-sobre-primario'
                        : 'bg-primario-suave text-primario'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Tarjeta Inferior de Sesión Activa y Botón de Cierre */}
        <div className={`${isSidebarCollapsed ? 'xl:p-2' : 'p-3.5'} p-3.5 pt-2 flex flex-col gap-2.5`}>
          <div
            className={`rounded-terra bg-superficie-crema border border-borde ${
              isSidebarCollapsed ? 'xl:p-2 xl:items-center' : 'p-3'
            } p-3 flex flex-col gap-2 text-left`}
          >
            <div
              className={`flex items-center ${
                isSidebarCollapsed ? 'xl:justify-center' : 'gap-2.5'
              } gap-2.5`}
            >
              <div
                title={user?.nombre ?? 'Administrador TERRA'}
                className="w-9 h-9 rounded-full bg-primario text-sobre-primario font-extrabold text-xs flex items-center justify-center shrink-0 shadow-terra-sm"
              >
                {user?.nombre
                  ? user.nombre
                      .split(' ')
                      .slice(0, 2)
                      .map((part) => part[0])
                      .join('')
                      .toUpperCase()
                  : 'TR'}
              </div>
              <div className={`min-w-0 flex-1 ${isSidebarCollapsed ? 'xl:hidden' : ''}`}>
                <p className="text-xs font-extrabold text-texto-principal truncate">
                  {user?.nombre ?? 'Administrador TERRA'}
                </p>
                <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-texto-suave truncate">
                  {user ? `${user.departamento} • ${user.rol}` : 'Sistemas • Admin'}
                </p>
              </div>
            </div>

            <div
              className={`flex items-center gap-1.5 text-[0.65rem] font-semibold text-texto-suave ${
                isSidebarCollapsed ? 'xl:hidden' : ''
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-exito shrink-0" />
              <span className="truncate">Sesión verificada en tiempo real</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            title="Cerrar Sesión"
            aria-label="Cerrar Sesión"
            className={`w-full min-h-[2.85rem] ${
              isSidebarCollapsed ? 'xl:px-0' : 'px-4'
            } px-4 py-2 rounded-terra-boton bg-superficie-2 hover:bg-primario-claro border border-borde hover:border-primario/30 text-texto-principal hover:text-primario font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60`}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span className={isSidebarCollapsed ? 'xl:hidden' : ''}>
              {logoutMutation.isPending ? 'Cerrando sesión...' : 'Cerrar Sesión'}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
