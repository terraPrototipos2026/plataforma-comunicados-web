import { create } from 'zustand';
import type { ModalidadComunicado } from '../../domain/models/comunicado.model';

export type ComunicadosSubTab = 'listado' | 'redactar';

interface ComunicadosUiState {
  activeTab: ComunicadosSubTab;
  composerMode: ModalidadComunicado;
  searchQuery: string;
  selectedEstado: string;
  selectedPrioridad: string;
  viewerComunicadoId: string | null;
  statsComunicadoId: string | null;

  setActiveTab: (tab: ComunicadosSubTab) => void;
  setComposerMode: (mode: ModalidadComunicado) => void;
  setSearchQuery: (query: string) => void;
  setSelectedEstado: (estado: string) => void;
  setSelectedPrioridad: (prioridad: string) => void;
  openViewer: (id: string) => void;
  closeViewer: () => void;
  openStats: (id: string) => void;
  closeStats: () => void;
}

export const useComunicadosUiStore = create<ComunicadosUiState>((set) => ({
  activeTab: 'listado',
  composerMode: 'EXPRESS',
  searchQuery: '',
  selectedEstado: 'TODOS',
  selectedPrioridad: 'TODAS',
  viewerComunicadoId: null,
  statsComunicadoId: null,

  setActiveTab: (activeTab) => set({ activeTab }),
  setComposerMode: (composerMode) => set({ composerMode }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedEstado: (selectedEstado) => set({ selectedEstado }),
  setSelectedPrioridad: (selectedPrioridad) => set({ selectedPrioridad }),
  openViewer: (viewerComunicadoId) => set({ viewerComunicadoId }),
  closeViewer: () => set({ viewerComunicadoId: null }),
  openStats: (statsComunicadoId) => set({ statsComunicadoId }),
  closeStats: () => set({ statsComunicadoId: null }),
}));

