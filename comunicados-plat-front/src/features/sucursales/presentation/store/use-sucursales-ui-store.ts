import { create } from 'zustand';
import type { Sucursal } from '../../domain/models/sucursal.model';

interface SucursalesUiState {
  isFormModalOpen: boolean;
  editingSucursal: Sucursal | null;
  searchFilter: string;
  openCreateModal: () => void;
  openEditModal: (sucursal: Sucursal) => void;
  closeFormModal: () => void;
  setSearchFilter: (query: string) => void;
}

export const useSucursalesUiStore = create<SucursalesUiState>((set) => ({
  isFormModalOpen: false,
  editingSucursal: null,
  searchFilter: '',

  openCreateModal: () => set({ isFormModalOpen: true, editingSucursal: null }),
  openEditModal: (sucursal) => set({ isFormModalOpen: true, editingSucursal: sucursal }),
  closeFormModal: () => set({ isFormModalOpen: false, editingSucursal: null }),
  setSearchFilter: (query) => set({ searchFilter: query }),
}));

