import { useQuery } from '@tanstack/react-query';
import { usuariosContainer } from '../../infrastructure/container';

export const usuariosKeys = {
  all: ['usuarios'] as const,
  lists: () => [...usuariosKeys.all, 'list'] as const,
  details: () => [...usuariosKeys.all, 'detail'] as const,
  detail: (id: string) => [...usuariosKeys.details(), id] as const,
};

export function useUsuariosQuery() {
  return useQuery({
    queryKey: usuariosKeys.lists(),
    queryFn: () => usuariosContainer.getUsuariosUseCase.execute(),
  });
}

export function useUsuarioDetailQuery(idUsuario?: string) {
  return useQuery({
    queryKey: usuariosKeys.detail(idUsuario ?? ''),
    queryFn: () => usuariosContainer.getUsuariosUseCase.executeById(idUsuario!),
    enabled: Boolean(idUsuario),
  });
}

