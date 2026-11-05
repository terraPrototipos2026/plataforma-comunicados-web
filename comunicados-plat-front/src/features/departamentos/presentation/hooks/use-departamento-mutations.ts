import { useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  CreateDepartamentoInput,
  UpdateDepartamentoInput,
} from '../../application/dtos/departamento.dto';
import { departamentosContainer } from '../../infrastructure/container';
import { departamentosKeys } from './use-departamentos-query';

export function useCreateDepartamentoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateDepartamentoInput) =>
      departamentosContainer.createDepartamentoUseCase.execute(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departamentosKeys.all });
    },
  });
}

export function useUpdateDepartamentoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateDepartamentoInput) =>
      departamentosContainer.updateDepartamentoUseCase.execute(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departamentosKeys.all });
    },
  });
}

export function useDeleteDepartamentoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (idDepartamento: string) =>
      departamentosContainer.deleteDepartamentoUseCase.execute(idDepartamento),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departamentosKeys.all });
    },
  });
}

