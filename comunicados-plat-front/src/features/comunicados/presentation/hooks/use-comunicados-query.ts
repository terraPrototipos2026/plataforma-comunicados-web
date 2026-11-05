import { useQuery } from '@tanstack/react-query';
import type { FilterComunicadosParams, EstimarAlcanceParams } from '../../domain/ports/comunicado.repository';
import { comunicadosContainer } from '../../infrastructure/container';

export const comunicadosKeys = {
  all: ['comunicados'] as const,
  lists: () => [...comunicadosKeys.all, 'list'] as const,
  list: (filters?: FilterComunicadosParams) => [...comunicadosKeys.lists(), filters] as const,
  details: () => [...comunicadosKeys.all, 'detail'] as const,
  detail: (id: string) => [...comunicadosKeys.details(), id] as const,
  estimarAlcance: (params: EstimarAlcanceParams) => [...comunicadosKeys.all, 'estimar-alcance', params] as const,
};

export function useComunicadosQuery(filters?: FilterComunicadosParams) {
  return useQuery({
    queryKey: comunicadosKeys.list(filters),
    queryFn: () => comunicadosContainer.getComunicadosUseCase.execute(filters),
    staleTime: 1000 * 60 * 2,
  });
}

export function useComunicadoDetailQuery(idComunicado?: string | null) {
  return useQuery({
    queryKey: comunicadosKeys.detail(idComunicado ?? ''),
    queryFn: () => comunicadosContainer.repository.findById(idComunicado ?? ''),
    enabled: Boolean(idComunicado),
  });
}

export function useEstimarAlcanceQuery(params: EstimarAlcanceParams, enabled = true) {
  return useQuery({
    queryKey: comunicadosKeys.estimarAlcance(params),
    queryFn: () => comunicadosContainer.estimarAlcanceUseCase.execute(params),
    enabled,
    staleTime: 1000 * 30,
  });
}

