import { useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  AssignPermisosToRolInput,
  CreateRolInput,
  UpdateRolInput,
} from '../../application/dtos/rol.dto';
import { rolesContainer } from '../../infrastructure/container';
import { rolesKeys } from './use-roles-query';

export function useCreateRolMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateRolInput) =>
      rolesContainer.createRolUseCase.execute(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rolesKeys.all });
    },
  });
}

export function useUpdateRolMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateRolInput) =>
      rolesContainer.updateRolUseCase.execute(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rolesKeys.all });
    },
  });
}

export function useAssignPermisosToRolMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AssignPermisosToRolInput) =>
      rolesContainer.assignPermisosToRolUseCase.execute(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rolesKeys.all });
    },
  });
}

export function useDeleteRolMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (idRol: string) => rolesContainer.deleteRolUseCase.execute(idRol),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rolesKeys.all });
    },
  });
}

