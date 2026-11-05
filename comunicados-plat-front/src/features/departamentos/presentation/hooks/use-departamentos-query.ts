import { useQuery } from '@tanstack/react-query';
import { departamentosContainer } from '../../infrastructure/container';

export const departamentosKeys = {
  all: ['departamentos'] as const,
  lists: () => [...departamentosKeys.all, 'list'] as const,
  details: () => [...departamentosKeys.all, 'detail'] as const,
  detail: (id: string) => [...departamentosKeys.details(), id] as const,
};

export function useDepartamentosQuery() {
  return useQuery({
    queryKey: departamentosKeys.lists(),
    queryFn: () => departamentosContainer.getDepartamentosUseCase.findAll(),
  });
}

