import { useEffect } from 'react';
import { Link } from 'react-router';
import {
  LayoutDashboard,
  Users,
  Shield,
  Building2,
  Table2,
  ReceiptText,
  Bell,
  UserCircle2,
  LogIn,
  UserPlus,
  LogOut,
  X,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
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
  { key: 'usuarios', label: 'Usuarios', icon: Users },
  { key: 'roles-permisos', label: 'Roles y Permisos', icon: Shield },
  { key: 'departamentos', label: 'Departamentos', icon: Building2 },
  { key: 'tables', label: 'Tablas', icon: Table2 },
  { key: 'billing', label: 'Facturación', icon: ReceiptText },
  { key: 'notifications', label: 'Notificaciones', badge: '4', icon: Bell },
  { key: 'profile', label: 'Perfil', icon: UserCircle2 },
];

export function DashboardSidebar() {
  const activeNav = useDashboardUiStore((state) => state.activeNav);
  const isMobileSidebarOpen = useDashboardUiStore((state) => state.isMobileSidebarOpen);
  const setActiveNav = useDashboardUiStore((state) => state.setActiveNav);
  const setUsuariosTab = useDashboardUiStore((state) => state.setUsuariosTab);
  const closeMobileSidebar = useDashboardUiStore((state) => state.closeMobileSidebar);

  const user = useAuthStore((state) => state.user);
  const highContrast = useThemeStore((state) => state.highContrast);
  const logoutMutation = useLogoutMutation();

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

      {/* Floating Sidebar inspirado en Material Dashboard 2 + Tokens TERRA */}
      <aside
        aria-label="Menú lateral de administración"
        className={`fixed top-0 left-0 bottom-0 z-50 w-[16.25rem] m-3 sm:m-4 rounded-terra-modal bg-footer-fondo text-footer-texto border-[1.5px] border-footer-borde shadow-terra flex flex-col justify-between overflow-hidden transition-transform duration-300 ease-out motion-reduce:transition-none ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-[115%] xl:translate-x-0'
        }`}
      >
        {/* Cabecera Superior con Logo TERRA */}
        <div className="p-4 pb-2">
          <div className="flex items-center justify-between gap-2 px-2 py-1.5">
            <Link
              to="/dashboard"
              onClick={() => setActiveNav('dashboard')}
              className="flex items-center gap-3 min-h-[2.75rem] focus:outline-none rounded-terra-chico group"
            >
              <img
                src={logoOscuroImg}
                alt="TERRA Colchones & Muebles"
                className="h-11 w-auto object-contain shrink-0 select-none"
              />
              <div className="flex flex-col text-left">
                <span className="text-xs font-extrabold tracking-tight text-footer-texto leading-tight">
                  Material TERRA
                </span>
                <span className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-footer-texto-suave">
                  Admin Console 2.0
                </span>
              </div>
            </Link>

            <button
              type="button"
              onClick={closeMobileSidebar}
              aria-label="Cerrar menú lateral"
              className="xl:hidden min-w-[2.75rem] min-h-[2.75rem] w-11 h-11 rounded-full text-footer-texto-suave hover:text-footer-texto hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Divisor degradado estilo Material Dashboard 2 */}
          <div
            aria-hidden="true"
            className="mt-3 mb-2 h-px w-full bg-gradient-to-r from-transparent via-footer-borde to-transparent"
          />
        </div>

        {/* Navegación Principal */}
        <nav
          aria-label="Secciones del panel"
          className="flex-1 overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden px-3.5 py-1 flex flex-col gap-1.5"
        >
          <span className="px-3 py-1 text-[0.65rem] font-extrabold uppercase tracking-[0.18em] text-footer-texto-suave">
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
                aria-current={isActive ? 'page' : undefined}
                className={`group w-full min-h-[2.95rem] px-3.5 py-2.5 rounded-terra-boton flex items-center justify-between gap-3 text-left text-sm font-bold transition-all duration-200 motion-reduce:transition-none cursor-pointer ${
                  isActive
                    ? highContrast
                      ? 'bg-primario text-sobre-primario border border-white'
                      : 'bg-gradient-to-r from-oferta to-primario text-sobre-primario shadow-terra-flotante'
                    : 'text-footer-texto-suave hover:text-footer-texto hover:bg-white/8'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon
                    className={`w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-105 motion-reduce:transform-none ${
                      isActive
                        ? 'text-sobre-primario'
                        : 'text-footer-texto-suave group-hover:text-footer-texto'
                    }`}
                  />
                  <span>{item.label}</span>
                </span>

                {item.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[0.68rem] font-extrabold ${
                      isActive
                        ? 'bg-white/22 text-sobre-primario'
                        : 'bg-primario text-sobre-primario'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Sección Inferior: Account Pages (Login / Registro / Sesión) */}
          <div
            aria-hidden="true"
            className="my-2.5 h-px w-full bg-gradient-to-r from-transparent via-footer-borde to-transparent"
          />

          <span className="px-3 py-1 text-[0.65rem] font-extrabold uppercase tracking-[0.18em] text-footer-texto-suave">
            Páginas de Cuenta
          </span>

          <Link
            to="/"
            className="group w-full min-h-[2.85rem] px-3.5 py-2 rounded-terra-boton flex items-center justify-between gap-3 text-left text-xs font-bold text-footer-texto-suave hover:text-footer-texto hover:bg-white/8 transition-colors"
          >
            <span className="flex items-center gap-3">
              <LogIn className="w-4 h-4 shrink-0 text-footer-texto-suave group-hover:text-footer-texto" />
              <span>Acceso / Portada</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </Link>

          <button
            type="button"
            onClick={() => {
              setActiveNav('usuarios');
              setUsuariosTab('registro');
            }}
            className="group w-full min-h-[2.85rem] px-3.5 py-2 rounded-terra-boton flex items-center gap-3 text-left text-xs font-bold text-footer-texto-suave hover:text-footer-texto hover:bg-white/8 transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4 shrink-0 text-footer-texto-suave group-hover:text-footer-texto" />
            <span>Registro Corporativo</span>
          </button>
        </nav>

        {/* Tarjeta Inferior de Sesión Activa y Botón de Cierre */}
        <div className="p-3.5 pt-2 flex flex-col gap-2.5">
          <div className="rounded-terra bg-white/6 border border-footer-borde p-3 flex flex-col gap-2 text-left">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-primario text-sobre-primario font-extrabold text-xs flex items-center justify-center shrink-0 shadow-terra-sm">
                {user?.nombre
                  ? user.nombre
                      .split(' ')
                      .slice(0, 2)
                      .map((part) => part[0])
                      .join('')
                      .toUpperCase()
                  : 'TR'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-extrabold text-footer-texto truncate">
                  {user?.nombre ?? 'Administrador TERRA'}
                </p>
                <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-footer-texto-suave truncate">
                  {user ? `${user.departamento} • ${user.rol}` : 'Sistemas • Admin'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[0.65rem] font-semibold text-footer-texto-suave">
              <ShieldCheck className="w-3.5 h-3.5 text-exito shrink-0" />
              <span className="truncate">Sesión verificada en tiempo real</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            className="w-full min-h-[2.85rem] px-4 py-2 rounded-terra-boton bg-gradient-to-r from-primario to-primario-hover hover:opacity-95 text-sobre-primario font-extrabold text-xs uppercase tracking-wider shadow-terra-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>{logoutMutation.isPending ? 'Cerrando sesión...' : 'Cerrar Sesión'}</span>
          </button>
        </div>
      </aside>
    </>
  );
}

