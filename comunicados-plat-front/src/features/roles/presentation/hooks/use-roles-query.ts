import { useQuery } from '@tanstack/react-query';
import { rolesContainer } from '../../infrastructure/container';

export const rolesKeys = {
  all: ['roles'] as const,
  lists: () => [...rolesKeys.all, 'list'] as const,
  details: () => [...rolesKeys.all, 'detail'] as const,
  detail: (id: string) => [...rolesKeys.details(), id] as const,
};

export function useRolesQuery() {
  return useQuery({
    queryKey: rolesKeys.lists(),
    queryFn: () => rolesContainer.getRolesUseCase.findAll(),
  });
}

