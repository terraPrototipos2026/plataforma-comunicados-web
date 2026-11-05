import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../../../core/store/use-auth-store';
import { authContainer } from '../../infrastructure/container';

export function useLogoutMutation() {
  const clearSession = useAuthStore((state) => state.clearSession);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authContainer.logoutUseCase.execute(),
    onSettled: () => {
      clearSession();
      queryClient.clear();
    },
  });
}
