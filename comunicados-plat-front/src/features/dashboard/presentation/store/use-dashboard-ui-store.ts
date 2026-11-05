import { create } from 'zustand';
import type { DashboardNavKey, ProjectFilterStatus } from '../../domain/models/dashboard.model';

export type RbacActiveTab = 'roles' | 'permisos';
export type UsuariosActiveTab = 'listado' | 'registro';
export type DepartamentosActiveTab = 'departamentos' | 'sucursales';

interface DashboardUiState {
  activeNav: DashboardNavKey;
  rbacTab: RbacActiveTab;
  usuariosTab: UsuariosActiveTab;
  departamentosTab: DepartamentosActiveTab;
  isMobileSidebarOpen: boolean;
  searchQuery: string;
  projectStatusFilter: ProjectFilterStatus;
  setActiveNav: (nav: DashboardNavKey) => void;
  setRbacTab: (tab: RbacActiveTab) => void;
  setUsuariosTab: (tab: UsuariosActiveTab) => void;
  setDepartamentosTab: (tab: DepartamentosActiveTab) => void;
  openMobileSidebar: () => void;
  closeMobileSidebar: () => void;
  toggleMobileSidebar: () => void;
  setSearchQuery: (query: string) => void;
  setProjectStatusFilter: (status: ProjectFilterStatus) => void;
}

export const useDashboardUiStore = create<DashboardUiState>((set) => ({
  activeNav: 'dashboard',
  rbacTab: 'roles',
  usuariosTab: 'listado',
  departamentosTab: 'departamentos',
  isMobileSidebarOpen: false,
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
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setProjectStatusFilter: (projectStatusFilter) => set({ projectStatusFilter }),
}));

