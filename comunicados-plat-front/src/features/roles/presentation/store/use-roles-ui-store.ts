import { create } from 'zustand';
import type { Rol } from '../../domain/models/rol.model';

interface RolesUiState {
  searchTerm: string;
  isFormModalOpen: boolean;
  editingRol: Rol | null;
  deletingRol: Rol | null;
  permissionsTargetRol: Rol | null;
  setSearchTerm: (term: string) => void;
  openCreateModal: () => void;
  openEditModal: (rol: Rol) => void;
  closeFormModal: () => void;
  openDeleteConfirm: (rol: Rol) => void;
  closeDeleteConfirm: () => void;
  openPermissionsDrawer: (rol: Rol) => void;
  closePermissionsDrawer: () => void;
}

export const useRolesUiStore = create<RolesUiState>((set) => ({
  searchTerm: '',
  isFormModalOpen: false,
  editingRol: null,
  deletingRol: null,
  permissionsTargetRol: null,

  setSearchTerm: (searchTerm) => set({ searchTerm }),
  openCreateModal: () => set({ isFormModalOpen: true, editingRol: null }),
  openEditModal: (rol) => set({ isFormModalOpen: true, editingRol: rol }),
  closeFormModal: () => set({ isFormModalOpen: false, editingRol: null }),
  openDeleteConfirm: (rol) => set({ deletingRol: rol }),
  closeDeleteConfirm: () => set({ deletingRol: null }),
  openPermissionsDrawer: (rol) => set({ permissionsTargetRol: rol }),
  closePermissionsDrawer: () => set({ permissionsTargetRol: null }),
}));

