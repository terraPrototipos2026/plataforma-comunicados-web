import { create } from 'zustand';
import type { Departamento } from '../../domain/models/departamento.model';

interface DepartamentosUiState {
  searchTerm: string;
  isFormModalOpen: boolean;
  editingDepartamento: Departamento | null;
  deletingDepartamento: Departamento | null;
  setSearchTerm: (term: string) => void;
  openCreateModal: () => void;
  openEditModal: (departamento: Departamento) => void;
  closeFormModal: () => void;
  openDeleteConfirm: (departamento: Departamento) => void;
  closeDeleteConfirm: () => void;
}

export const useDepartamentosUiStore = create<DepartamentosUiState>((set) => ({
  searchTerm: '',
  isFormModalOpen: false,
  editingDepartamento: null,
  deletingDepartamento: null,

  setSearchTerm: (searchTerm) => set({ searchTerm }),
  openCreateModal: () => set({ isFormModalOpen: true, editingDepartamento: null }),
  openEditModal: (departamento) =>
    set({ isFormModalOpen: true, editingDepartamento: departamento }),
  closeFormModal: () => set({ isFormModalOpen: false, editingDepartamento: null }),
  openDeleteConfirm: (departamento) => set({ deletingDepartamento: departamento }),
  closeDeleteConfirm: () => set({ deletingDepartamento: null }),
}));

