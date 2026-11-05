import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateComunicadoInput } from '../../application/dtos/comunicado.dto';
import { comunicadosContainer } from '../../infrastructure/container';
import { comunicadosKeys } from './use-comunicados-query';

export function useCreateComunicadoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateComunicadoInput) =>
      comunicadosContainer.createComunicadoUseCase.execute(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: comunicadosKeys.lists() });
    },
  });
}

export function useRegistrarLecturaMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ idComunicado, confirmar }: { idComunicado: string; confirmar?: boolean }) =>
      comunicadosContainer.registrarLecturaUseCase.execute(idComunicado, confirmar),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: comunicadosKeys.detail(variables.idComunicado) });
      queryClient.invalidateQueries({ queryKey: comunicadosKeys.lists() });
    },
  });
}

export function useAnularComunicadoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (idComunicado: string) =>
      comunicadosContainer.anularComunicadoUseCase.execute(idComunicado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: comunicadosKeys.lists() });
    },
  });
}

