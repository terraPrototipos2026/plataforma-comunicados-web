import { ShieldCheck, Shield, KeyRound, Users, UserPlus, Building2, Store } from 'lucide-react';
import { SlideFadeTransition } from '../../../../shared/components/slide-fade-transition';
import { DepartamentosTableCard } from '../../../departamentos/presentation/components/departamentos-table-card';
import { SucursalesTableCard } from '../../../sucursales/presentation/components/sucursales-table-card';
import { PermisosCatalogCard } from '../../../permisos/presentation/components/permisos-catalog-card';
import { RolesGridCard } from '../../../roles/presentation/components/roles-grid-card';
import { UsuariosTableCard } from '../../../usuarios/presentation/components/usuarios-table-card';
import { UsuarioRegisterCard } from '../../../usuarios/presentation/components/usuario-register-card';
import { UsuarioProfileCard } from '../../../usuarios/presentation/components/usuario-profile-card';
import { ComunicadosManagementSection } from '../../../comunicados/presentation/components/comunicados-management-section';
import { DashboardHeader } from '../components/dashboard-header';
import { DashboardSidebar } from '../components/dashboard-sidebar';
import { KpiCardsRow } from '../components/kpi-cards-row';
import { OrdersOverviewCard } from '../components/orders-overview-card';
import { OverhangingChartsRow } from '../components/overhanging-charts-row';
import { ProjectsTableCard } from '../components/projects-table-card';
import { useDashboardOverviewQuery } from '../hooks/use-dashboard-overview-query';
import { useDashboardUiStore } from '../store/use-dashboard-ui-store';

export default function DashboardPage() {
  const { data, isLoading } = useDashboardOverviewQuery();
  const activeNav = useDashboardUiStore((state) => state.activeNav);
  const rbacTab = useDashboardUiStore((state) => state.rbacTab);
  const setRbacTab = useDashboardUiStore((state) => state.setRbacTab);
  const usuariosTab = useDashboardUiStore((state) => state.usuariosTab);
  const setUsuariosTab = useDashboardUiStore((state) => state.setUsuariosTab);
  const departamentosTab = useDashboardUiStore((state) => state.departamentosTab);
  const setDepartamentosTab = useDashboardUiStore((state) => state.setDepartamentosTab);
  const isSidebarCollapsed = useDashboardUiStore((state) => state.isSidebarCollapsed);

  const showOverviewSection =
    activeNav === 'dashboard' ||
    activeNav === 'notifications';

  const showComunicadosSection = activeNav === 'comunicados';

  const showProfileSection = activeNav === 'profile';

  const showUsuariosSection = activeNav === 'usuarios';

  const showRolesAndPermisosSection = activeNav === 'roles-permisos';

  const showDepartamentosSection = activeNav === 'departamentos';

  return (
    <div className="min-h-svh bg-fondo text-texto-principal flex flex-col selection:bg-primario selection:text-sobre-primario">
      {/* Sidebar Flotante Izquierdo (Material Dashboard 2 + TERRA Dark Graphite) */}
      <DashboardSidebar />

      {/* Contenedor Principal desplazado a la derecha del Floating Sidebar en pantallas XL */}
      <div
        className={`flex-1 flex flex-col ${
          isSidebarCollapsed ? 'xl:pl-[7.25rem]' : 'xl:pl-[18.25rem]'
        } transition-all duration-300 ease-out`}
      >
        {/* Header Minimalista con Breadcrumbs, Buscador Material, Perfil y Notificaciones */}
        <DashboardHeader />

        {/* Main Canvas */}
        <main className="flex-1 px-3 sm:px-6 pt-5 pb-10 max-w-[96rem] w-full mx-auto flex flex-col gap-7">
          {/* Vista de Usuarios separada por Pestañas (Directorio vs Registro) */}
          {showUsuariosSection && (
            <section
              aria-label="Gestión de Usuarios y Registro"
              className="flex flex-col gap-4"
            >
              {/* Barra de Pestañas estilo Material Dashboard 2 + TERRA */}
              <div
                role="tablist"
                aria-label="Pestañas de Usuarios"
                className="inline-flex self-start p-1.5 rounded-full bg-superficie-1 border-[1.5px] border-borde shadow-terra-card gap-1.5"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={usuariosTab === 'listado'}
                  onClick={() => setUsuariosTab('listado')}
                  className={`min-h-[2.75rem] px-5 py-2 rounded-full text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all cursor-pointer ${usuariosTab === 'listado'
                    ? 'bg-gradient-to-r from-oferta to-primario text-sobre-primario shadow-terra-flotante'
                    : 'text-texto-suave hover:text-texto-principal hover:bg-superficie-2'
                    }`}
                >
                  <Users className="w-4 h-4 shrink-0" />
                  <span>Directorio de Usuarios</span>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={usuariosTab === 'registro'}
                  onClick={() => setUsuariosTab('registro')}
                  className={`min-h-[2.75rem] px-5 py-2 rounded-full text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all cursor-pointer ${usuariosTab === 'registro'
                    ? 'bg-gradient-to-r from-oferta to-primario text-sobre-primario shadow-terra-flotante'
                    : 'text-texto-suave hover:text-texto-principal hover:bg-superficie-2'
                    }`}
                >
                  <UserPlus className="w-4 h-4 shrink-0" />
                  <span>Registro de Usuario</span>
                </button>
              </div>

              {/* Contenido de la Pestaña Activa con Transición Suave */}
              <SlideFadeTransition
                direction="horizontal"
                offset={24}
                preset="smooth"
                transitionKey={`usuarios-tab-${usuariosTab}`}
              >
                <div role="tabpanel">
                  {usuariosTab === 'listado' ? (
                    <UsuariosTableCard onGoToRegister={() => setUsuariosTab('registro')} />
                  ) : (
                    <UsuarioRegisterCard onGoToListado={() => setUsuariosTab('listado')} />
                  )}
                </div>
              </SlideFadeTransition>
            </section>
          )}

          {/* Vista de Roles y Permisos separada por Pestañas (Tabs) */}
          {showRolesAndPermisosSection && (
            <section
              aria-label="Gestión de Roles y Permisos"
              className="flex flex-col gap-4"
            >
              {/* Barra de Pestañas estilo Material Dashboard 2 + TERRA */}
              <div
                role="tablist"
                aria-label="Pestañas de Roles y Permisos"
                className="inline-flex self-start p-1.5 rounded-full bg-superficie-1 border-[1.5px] border-borde shadow-terra-card gap-1.5"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={rbacTab === 'roles'}
                  onClick={() => setRbacTab('roles')}
                  className={`min-h-[2.75rem] px-5 py-2 rounded-full text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all cursor-pointer ${rbacTab === 'roles'
                    ? 'bg-gradient-to-r from-oferta to-primario text-sobre-primario shadow-terra-flotante'
                    : 'text-texto-suave hover:text-texto-principal hover:bg-superficie-2'
                    }`}
                >
                  <Shield className="w-4 h-4 shrink-0" />
                  <span>Roles y Asignación</span>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={rbacTab === 'permisos'}
                  onClick={() => setRbacTab('permisos')}
                  className={`min-h-[2.75rem] px-5 py-2 rounded-full text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all cursor-pointer ${rbacTab === 'permisos'
                    ? 'bg-gradient-to-r from-[#28a45a] to-[#1e7e46] text-white shadow-[0_8px_20px_-4px_rgba(30,126,70,0.45)]'
                    : 'text-texto-suave hover:text-texto-principal hover:bg-superficie-2'
                    }`}
                >
                  <KeyRound className="w-4 h-4 shrink-0" />
                  <span>Catálogo de Permisos</span>
                </button>
              </div>

              {/* Contenido de la Pestaña Activa con Transición */}
              <SlideFadeTransition
                direction="horizontal"
                offset={24}
                preset="smooth"
                transitionKey={`rbac-tab-${rbacTab}`}
              >
                <div role="tabpanel">
                  {rbacTab === 'roles' ? <RolesGridCard /> : <PermisosCatalogCard />}
                </div>
              </SlideFadeTransition>
            </section>
          )}

          {/* Vista de Departamentos y Sucursales separada por Pestañas (Tabs) */}
          {showDepartamentosSection && (
            <section
              aria-label="Gestión de Departamentos y Sucursales"
              className="flex flex-col gap-4"
            >
              {/* Barra de Pestañas estilo Material Dashboard 2 + TERRA */}
              <div
                role="tablist"
                aria-label="Pestañas de Departamentos y Sucursales"
                className="inline-flex self-start p-1.5 rounded-full bg-superficie-1 border-[1.5px] border-borde shadow-terra-card gap-1.5"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={departamentosTab === 'departamentos'}
                  onClick={() => setDepartamentosTab('departamentos')}
                  className={`min-h-[2.75rem] px-5 py-2 rounded-full text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all cursor-pointer ${departamentosTab === 'departamentos'
                    ? 'bg-gradient-to-r from-oferta to-primario text-sobre-primario shadow-terra-flotante'
                    : 'text-texto-suave hover:text-texto-principal hover:bg-superficie-2'
                    }`}
                >
                  <Building2 className="w-4 h-4 shrink-0" />
                  <span>Departamentos Corporativos</span>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={departamentosTab === 'sucursales'}
                  onClick={() => setDepartamentosTab('sucursales')}
                  className={`min-h-[2.75rem] px-5 py-2 rounded-full text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all cursor-pointer ${departamentosTab === 'sucursales'
                    ? 'bg-gradient-to-r from-oferta to-primario text-sobre-primario shadow-terra-flotante'
                    : 'text-texto-suave hover:text-texto-principal hover:bg-superficie-2'
                    }`}
                >
                  <Store className="w-4 h-4 shrink-0" />
                  <span>Sucursales y Sedes</span>
                </button>
              </div>

              {/* Contenido de la Pestaña Activa con Transición */}
              <SlideFadeTransition
                direction="horizontal"
                offset={24}
                preset="smooth"
                transitionKey={`departamentos-tab-${departamentosTab}`}
              >
                <div role="tabpanel">
                  {departamentosTab === 'departamentos' ? (
                    <DepartamentosTableCard />
                  ) : (
                    <SucursalesTableCard />
                  )}
                </div>
              </SlideFadeTransition>
            </section>
          )}

          {/* Vista Oficial de Gestión de Comunicados */}
          {showComunicadosSection && (
            <SlideFadeTransition
              direction="vertical"
              offset={24}
              preset="smooth"
              transitionKey="dashboard-comunicados-view"
            >
              <ComunicadosManagementSection />
            </SlideFadeTransition>
          )}

          {/* Vista de Perfil Corporativo del Usuario Autenticado (Edición sin contraseña) */}
          {showProfileSection && (
            <SlideFadeTransition
              direction="vertical"
              offset={24}
              preset="smooth"
              transitionKey="usuario-profile-view"
            >
              <UsuarioProfileCard />
            </SlideFadeTransition>
          )}

          {/* Vista General Material Dashboard 2 (KPIs, Overhanging Charts, Projects & Orders) */}
          {showOverviewSection && (
            <>
              {isLoading || !data ? (
                <div className="py-20 flex flex-col items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-full border-3 border-primario border-t-transparent animate-spin" />
                  <span className="text-xs font-extrabold uppercase tracking-widest text-primario">
                    Cargando métricas del panel...
                  </span>
                </div>
              ) : (
                <>
                  {/* 1. Fila de 4 KPI Cards con Iconos Flotantes en Gradiente */}
                  <SlideFadeTransition
                    direction="vertical"
                    offset={24}
                    preset="smooth"
                    transitionKey="dashboard-kpi-row"
                  >
                    <KpiCardsRow metrics={data.kpis} />
                  </SlideFadeTransition>

                  {/* 2. Fila de 3 Tarjetas de Gráficos con Cabecera Flotante ("Overhanging Cards") */}
                  <SlideFadeTransition
                    direction="vertical"
                    offset={28}
                    preset="smooth"
                    delay={0.05}
                    transitionKey="dashboard-charts-row"
                  >
                    <OverhangingChartsRow charts={data.charts} />
                  </SlideFadeTransition>

                  {/* 3. Fila Inferior: Tabla de Proyectos (8 cols) y Orders Overview Timeline (4 cols) */}
                  <SlideFadeTransition
                    direction="vertical"
                    offset={32}
                    preset="smooth"
                    delay={0.1}
                    transitionKey="dashboard-bottom-row"
                  >
                    <section
                      aria-label="Proyectos activos y resumen de actividad reciente"
                      className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
                    >
                      <div className="lg:col-span-8">
                        <ProjectsTableCard
                          projects={data.projects}
                          doneThisMonth={data.projectsDoneThisMonth}
                        />
                      </div>
                      <div className="lg:col-span-4">
                        <OrdersOverviewCard
                          events={data.ordersOverview}
                          growthPercent={data.ordersGrowthPercent}
                        />
                      </div>
                    </section>
                  </SlideFadeTransition>
                </>
              )}
            </>
          )}
        </main>

        {/* Pie Minimalista del Panel */}
        <footer className="px-4 sm:px-6 py-4 mt-auto border-t border-borde-suave text-xs text-texto-suave">
          <div className="max-w-[96rem] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-semibold text-texto-principal">
              <ShieldCheck className="w-4 h-4 text-primario shrink-0" />
              <span>
                © {new Date().getFullYear()} TERRA Colchones &amp; Muebles — Material
                Dashboard 2 Edition
              </span>
            </div>
            <span className="text-texto-suave">
              Sistema de Comunicados e Inteligencia Operativa
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
