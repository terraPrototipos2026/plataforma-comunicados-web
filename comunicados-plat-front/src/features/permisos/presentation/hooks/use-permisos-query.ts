import { useQuery } from '@tanstack/react-query';
import { permisosContainer } from '../../infrastructure/container';

export const permisosKeys = {
  all: ['permisos'] as const,
  lists: () => [...permisosKeys.all, 'list'] as const,
  details: () => [...permisosKeys.all, 'detail'] as const,
  detail: (id: string) => [...permisosKeys.details(), id] as const,
};

export function usePermisosQuery() {
  return useQuery({
    queryKey: permisosKeys.lists(),
    queryFn: () => permisosContainer.getPermisosUseCase.findAll(),
  });
}

