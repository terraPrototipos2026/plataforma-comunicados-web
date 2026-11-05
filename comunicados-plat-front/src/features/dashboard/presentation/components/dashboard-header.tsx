import { useState, useRef, useEffect } from 'react';
import {
  Home,
  Search,
  Bell,
  UserCircle2,
  Menu,
  X,
  CheckCircle2,
  Mail,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '../../../../core/store/use-auth-store';
import { SettingsModalTrigger } from '../../../../shared/components/settings-modal';
import { SlideFadeTransition } from '../../../../shared/components/slide-fade-transition';
import type { DashboardNavKey } from '../../domain/models/dashboard.model';
import { useDashboardUiStore } from '../store/use-dashboard-ui-store';

const NAV_TITLES: Record<DashboardNavKey, string> = {
  dashboard: 'Dashboard',
  usuarios: 'Gestión de Usuarios',
  'roles-permisos': 'Roles y Permisos (RBAC)',
  departamentos: 'Departamentos y Sucursales',
  tables: 'Tablas y Catálogos',
  billing: 'Facturación y Presupuestos',
  notifications: 'Centro de Notificaciones',
  profile: 'Perfil Corporativo',
};

const QUICK_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Nuevo mensaje de Romina Hadid',
    time: 'Hace 13 minutos',
    icon: Mail,
    tone: 'bg-primario-claro text-primario',
  },
  {
    id: 'notif-2',
    title: 'Campaña Daily Sales superó +15%',
    time: 'Hace 1 hora',
    icon: Sparkles,
    tone: 'bg-superficie-crema text-oferta',
  },
  {
    id: 'notif-3',
    title: 'Pago de servidores procesado con éxito',
    time: 'Hace 1 día',
    icon: CheckCircle2,
    tone: 'bg-superficie-2 text-exito',
  },
];

export function DashboardHeader() {
  const activeNav = useDashboardUiStore((state) => state.activeNav);
  const searchQuery = useDashboardUiStore((state) => state.searchQuery);
  const setSearchQuery = useDashboardUiStore((state) => state.setSearchQuery);
  const setActiveNav = useDashboardUiStore((state) => state.setActiveNav);
  const toggleMobileSidebar = useDashboardUiStore((state) => state.toggleMobileSidebar);

  const user = useAuthStore((state) => state.user);

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isNotifOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        notifContainerRef.current &&
        !notifContainerRef.current.contains(event.target as Node)
      ) {
        setIsNotifOpen(false);
      }
    };

    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [isNotifOpen]);

  const currentSectionTitle = NAV_TITLES[activeNav];

  return (
    <header className="sticky top-3 z-30 mx-3 sm:mx-6 mt-3 rounded-terra-tarjeta bg-superficie-1/85 backdrop-blur-md border border-borde-suave px-4 sm:px-5 py-3 shadow-terra-card transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5">
        {/* Izquierda: Botón Menú Móvil + Breadcrumbs ("Pages / Dashboard") */}
        <div className="flex items-center justify-between md:justify-start gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleMobileSidebar}
              aria-label="Abrir o cerrar menú lateral"
              className="xl:hidden min-w-[2.75rem] min-h-[2.75rem] w-11 h-11 rounded-terra-boton bg-superficie-2 hover:bg-primario-claro border border-borde text-texto-principal hover:text-primario flex items-center justify-center transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex flex-col text-left">
              <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveNav('dashboard')}
                  aria-label="Ir a inicio del panel"
                  className="text-texto-suave hover:text-primario transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Pages</span>
                </button>
                <span aria-hidden="true" className="text-texto-placeholder select-none">
                  /
                </span>
                <span className="font-bold text-texto-principal">{currentSectionTitle}</span>
              </nav>

              <h1 className="text-base sm:text-lg font-extrabold text-texto-principal tracking-tight leading-snug">
                {currentSectionTitle}
              </h1>
            </div>
          </div>

          {/* Controles rápidos visibles en móvil en la fila superior */}
          <div className="flex md:hidden items-center gap-1.5">
            <SettingsModalTrigger />
          </div>
        </div>

        {/* Derecha: Barra de Búsqueda Material + Perfil + Ajustes + Notificaciones */}
        <div className="flex items-center justify-between md:justify-end gap-2.5 sm:gap-3">
          {/* Input estilizado tipo Material */}
          <div className="relative flex-1 md:w-64 lg:w-72 flex items-center">
            <Search
              aria-hidden="true"
              className="w-4 h-4 text-texto-suave absolute left-3.5 pointer-events-none"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar proyecto, miembro..."
              aria-label="Buscar en el dashboard"
              className="w-full min-h-[2.75rem] pl-9 pr-9 py-2 rounded-terra-campo bg-superficie-2/90 border-[1.5px] border-borde hover:border-borde-hover focus:border-primario focus:bg-superficie-1 focus:shadow-terra-anillo focus:outline-none text-xs sm:text-sm font-medium text-texto-principal placeholder:text-texto-placeholder transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Limpiar búsqueda"
                className="absolute right-1.5 w-7 h-7 rounded-full hover:bg-superficie-2 text-texto-suave hover:text-primario flex items-center justify-center cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Botón de Perfil */}
          <button
            type="button"
            onClick={() => setActiveNav('profile')}
            title="Ver perfil de usuario"
            className="min-h-[2.75rem] px-3 py-1.5 rounded-full bg-superficie-2 hover:bg-primario-claro border border-borde hover:border-primario text-texto-principal hover:text-primario transition-colors flex items-center gap-2 text-xs font-extrabold cursor-pointer shrink-0"
          >
            <UserCircle2 className="w-4 h-4 text-primario shrink-0" />
            <span className="hidden sm:inline max-w-[8.5rem] truncate">
              {user?.nombre ?? 'Colaborador TERRA'}
            </span>
          </button>

          {/* Tuerca de Accesibilidad y Tema (Desktop) */}
          <div className="hidden md:block">
            <SettingsModalTrigger />
          </div>

          {/* Campana de Notificaciones con Popover */}
          <div ref={notifContainerRef} className="relative">
            <button
              type="button"
              onClick={() => setIsNotifOpen((prev) => !prev)}
              aria-label="Ver notificaciones recientes"
              aria-expanded={isNotifOpen}
              className="relative min-w-[2.75rem] min-h-[2.75rem] w-11 h-11 rounded-full bg-superficie-2 hover:bg-primario-claro border border-borde hover:border-primario text-texto-principal hover:text-primario flex items-center justify-center transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-oferta text-sobre-primario text-[0.62rem] font-extrabold flex items-center justify-center">
                3
              </span>
            </button>

            <SlideFadeTransition
              isVisible={isNotifOpen}
              direction="vertical"
              exitMode="reverse"
              offset={-10}
              preset="spring"
              transitionKey="dashboard-notifications-popover"
              className="absolute right-0 mt-2.5 w-72 sm:w-80 z-50 origin-top-right"
            >
              <div
                role="region"
                aria-label="Notificaciones recientes"
                className="rounded-terra-tarjeta bg-superficie-1 border-[1.5px] border-borde p-3.5 shadow-terra text-left flex flex-col gap-2"
              >
                <div className="flex items-center justify-between pb-2 border-b border-borde-suave px-1">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-primario">
                    Notificaciones
                  </span>
                  <span className="text-[0.68rem] font-bold text-texto-suave">3 nuevas</span>
                </div>

                {QUICK_NOTIFICATIONS.map((notif) => {
                  const NotifIcon = notif.icon;
                  return (
                    <button
                      key={notif.id}
                      type="button"
                      onClick={() => {
                        setIsNotifOpen(false);
                        setActiveNav('notifications');
                      }}
                      className="w-full min-h-[2.85rem] p-2 rounded-terra-boton hover:bg-superficie-2 flex items-center gap-3 text-left transition-colors cursor-pointer"
                    >
                      <div
                        className={`w-9 h-9 rounded-terra-chico flex items-center justify-center shrink-0 ${notif.tone}`}
                      >
                        <NotifIcon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-texto-principal truncate">
                          {notif.title}
                        </p>
                        <p className="text-[0.68rem] text-texto-suave">{notif.time}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </SlideFadeTransition>
          </div>
        </div>
      </div>
    </header>
  );
}

