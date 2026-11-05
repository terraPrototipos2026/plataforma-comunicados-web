import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { RegisterUsuarioInput, UpdateUsuarioInput } from '../../application/dtos/usuario.dto';
import { usuariosContainer } from '../../infrastructure/container';
import { usuariosKeys } from './use-usuarios-query';

export function useRegisterUsuarioMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: RegisterUsuarioInput) =>
      usuariosContainer.registerUsuarioUseCase.execute(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usuariosKeys.all });
    },
  });
}

export function useUpdateUsuarioMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateUsuarioInput) =>
      usuariosContainer.updateUsuarioUseCase.execute(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usuariosKeys.all });
    },
  });
}

export function useDeleteUsuarioMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usuariosContainer.deleteUsuarioUseCase.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usuariosKeys.all });
    },
  });
}
