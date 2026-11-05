import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../../../../core/store/use-auth-store';
import type { LoginInput } from '../../application/dtos/login.dto';
import { authContainer } from '../../infrastructure/container';

export function useLoginMutation() {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: (input: LoginInput) => authContainer.loginUseCase.execute(input),
    onSuccess: (session) => {
      setSession(session.accessToken, session.user);
    },
  });
}
