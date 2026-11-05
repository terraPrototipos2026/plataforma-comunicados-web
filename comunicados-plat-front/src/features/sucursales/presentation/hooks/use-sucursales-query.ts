import { useQuery } from '@tanstack/react-query';
import type { Sucursal } from '../../domain/models/sucursal.model';
import { sucursalesContainer } from '../../infrastructure/container';

export const SUCURSALES_QUERY_KEY = ['sucursales'] as const;

export function useSucursalesQuery() {
  return useQuery<Sucursal[]>({
    queryKey: SUCURSALES_QUERY_KEY,
    queryFn: () => sucursalesContainer.getSucursalesUseCase.execute(),
    staleTime: 1000 * 60 * 5,
  });
}

