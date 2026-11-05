import { create } from 'zustand';
import type { DashboardNavKey, ProjectFilterStatus } from '../../domain/models/dashboard.model';

export type RbacActiveTab = 'roles' | 'permisos';
export type UsuariosActiveTab = 'listado' | 'registro';
export type DepartamentosActiveTab = 'departamentos' | 'sucursales';

const SIDEBAR_COLLAPSED_STORAGE_KEY = 'terra_sidebar_collapsed';

interface DashboardUiState {
  activeNav: DashboardNavKey;
  rbacTab: RbacActiveTab;
  usuariosTab: UsuariosActiveTab;
  departamentosTab: DepartamentosActiveTab;
  isMobileSidebarOpen: boolean;
  isSidebarCollapsed: boolean;
  searchQuery: string;
  projectStatusFilter: ProjectFilterStatus;
  setActiveNav: (nav: DashboardNavKey) => void;
  setRbacTab: (tab: RbacActiveTab) => void;
  setUsuariosTab: (tab: UsuariosActiveTab) => void;
  setDepartamentosTab: (tab: DepartamentosActiveTab) => void;
  openMobileSidebar: () => void;
  closeMobileSidebar: () => void;
  toggleMobileSidebar: () => void;
  toggleSidebarCollapse: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSearchQuery: (query: string) => void;
  setProjectStatusFilter: (status: ProjectFilterStatus) => void;
}

const getInitialSidebarCollapsed = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
};

export const useDashboardUiStore = create<DashboardUiState>((set) => ({
  activeNav: 'dashboard',
  rbacTab: 'roles',
  usuariosTab: 'listado',
  departamentosTab: 'departamentos',
  isMobileSidebarOpen: false,
  isSidebarCollapsed: getInitialSidebarCollapsed(),
  searchQuery: '',
  projectStatusFilter: 'all',

  setActiveNav: (activeNav) => set({ activeNav, isMobileSidebarOpen: false }),
  setRbacTab: (rbacTab) => set({ rbacTab }),
  setUsuariosTab: (usuariosTab) => set({ usuariosTab }),
  setDepartamentosTab: (departamentosTab) => set({ departamentosTab }),
  openMobileSidebar: () => set({ isMobileSidebarOpen: true }),
  closeMobileSidebar: () => set({ isMobileSidebarOpen: false }),
  toggleMobileSidebar: () =>
    set((state) => ({ isMobileSidebarOpen: !state.isMobileSidebarOpen })),
  toggleSidebarCollapse: () =>
    set((state) => {
      const nextCollapsed = !state.isSidebarCollapsed;
      try {
        localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, String(nextCollapsed));
      } catch {
        // Ignora fallos de storage si cookies/storage están restringidos
      }
      return { isSidebarCollapsed: nextCollapsed };
    }),
  setSidebarCollapsed: (isSidebarCollapsed) => {
    try {
      localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, String(isSidebarCollapsed));
    } catch {
      // Ignora fallos de storage
    }
    set({ isSidebarCollapsed });
  },
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setProjectStatusFilter: (projectStatusFilter) => set({ projectStatusFilter }),
}));

