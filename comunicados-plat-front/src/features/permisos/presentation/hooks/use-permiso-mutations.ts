import { useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  CreatePermisoInput,
  UpdatePermisoInput,
} from '../../application/dtos/permiso.dto';
import { permisosContainer } from '../../infrastructure/container';
import { permisosKeys } from './use-permisos-query';

export function useCreatePermisoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreatePermisoInput) =>
      permisosContainer.createPermisoUseCase.execute(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: permisosKeys.all });
    },
  });
}

export function useUpdatePermisoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdatePermisoInput) =>
      permisosContainer.updatePermisoUseCase.execute(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: permisosKeys.all });
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
}

export function useDeletePermisoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (idPermiso: string) =>
      permisosContainer.deletePermisoUseCase.execute(idPermiso),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: permisosKeys.all });
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
}

