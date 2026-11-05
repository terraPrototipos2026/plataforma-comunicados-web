import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateSucursalInput, UpdateSucursalInput } from '../../application/dtos/sucursal.dto';
import { sucursalesContainer } from '../../infrastructure/container';
import { SUCURSALES_QUERY_KEY } from './use-sucursales-query';
import { departamentosKeys } from '../../../departamentos/presentation/hooks/use-departamentos-query';

export function useCreateSucursalMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateSucursalInput) =>
      sucursalesContainer.createSucursalUseCase.execute(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUCURSALES_QUERY_KEY });
    },
  });
}

export function useUpdateSucursalMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateSucursalInput) =>
      sucursalesContainer.updateSucursalUseCase.execute(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUCURSALES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: departamentosKeys.all });
    },
  });
}

export function useDeleteSucursalMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (idSucursal: string) =>
      sucursalesContainer.deleteSucursalUseCase.execute(idSucursal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUCURSALES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: departamentosKeys.all });
    },
  });
}
