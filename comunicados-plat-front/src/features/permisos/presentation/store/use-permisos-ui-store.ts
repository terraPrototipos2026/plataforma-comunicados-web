import { create } from 'zustand';
import type { Permiso } from '../../domain/models/permiso.model';

interface PermisosUiState {
  searchTerm: string;
  isFormModalOpen: boolean;
  editingPermiso: Permiso | null;
  deletingPermiso: Permiso | null;
  setSearchTerm: (term: string) => void;
  openCreateModal: () => void;
  openEditModal: (permiso: Permiso) => void;
  closeFormModal: () => void;
  openDeleteConfirm: (permiso: Permiso) => void;
  closeDeleteConfirm: () => void;
}

export const usePermisosUiStore = create<PermisosUiState>((set) => ({
  searchTerm: '',
  isFormModalOpen: false,
  editingPermiso: null,
  deletingPermiso: null,

  setSearchTerm: (searchTerm) => set({ searchTerm }),
  openCreateModal: () => set({ isFormModalOpen: true, editingPermiso: null }),
  openEditModal: (permiso) => set({ isFormModalOpen: true, editingPermiso: permiso }),
  closeFormModal: () => set({ isFormModalOpen: false, editingPermiso: null }),
  openDeleteConfirm: (permiso) => set({ deletingPermiso: permiso }),
  closeDeleteConfirm: () => set({ deletingPermiso: null }),
}));

