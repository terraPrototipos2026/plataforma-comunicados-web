import { create } from 'zustand';
import type { Usuario } from '../../domain/models/usuario.model';

interface UsuariosUiState {
  searchTerm: string;
  selectedRolFilter: string;
  selectedDeptFilter: string;
  selectedSucursalFilter: string;
  editingUsuario: Usuario | null;
  deletingUsuario: Usuario | null;
  isEditModalOpen: boolean;

  setSearchTerm: (term: string) => void;
  setSelectedRolFilter: (rol: string) => void;
  setSelectedDeptFilter: (dept: string) => void;
  setSelectedSucursalFilter: (sucursalId: string) => void;
  openEditModal: (usuario: Usuario) => void;
  closeEditModal: () => void;
  openDeleteConfirm: (usuario: Usuario) => void;
  closeDeleteConfirm: () => void;
  resetFilters: () => void;
}

export const useUsuariosUiStore = create<UsuariosUiState>((set) => ({
  searchTerm: '',
  selectedRolFilter: 'all',
  selectedDeptFilter: 'all',
  selectedSucursalFilter: 'all',
  editingUsuario: null,
  deletingUsuario: null,
  isEditModalOpen: false,

  setSearchTerm: (searchTerm) => set({ searchTerm }),
  setSelectedRolFilter: (selectedRolFilter) => set({ selectedRolFilter }),
  setSelectedDeptFilter: (selectedDeptFilter) => set({ selectedDeptFilter }),
  setSelectedSucursalFilter: (selectedSucursalFilter) => set({ selectedSucursalFilter }),
  openEditModal: (usuario) => set({ editingUsuario: usuario, isEditModalOpen: true }),
  closeEditModal: () => set({ editingUsuario: null, isEditModalOpen: false }),
  openDeleteConfirm: (usuario) => set({ deletingUsuario: usuario }),
  closeDeleteConfirm: () => set({ deletingUsuario: null }),
  resetFilters: () =>
    set({
      searchTerm: '',
      selectedRolFilter: 'all',
      selectedDeptFilter: 'all',
      selectedSucursalFilter: 'all',
    }),
}));
