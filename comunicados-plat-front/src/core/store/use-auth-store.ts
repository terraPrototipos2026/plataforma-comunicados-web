import { create } from 'zustand';
import type { AuthUser } from '../../features/auth/domain/models/auth-user.model';

interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  setSession: (accessToken: string, user: AuthUser) => void;
  clearSession: () => void;
  setInitializing: (isInitializing: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isInitializing: true,

  setSession: (accessToken, user) =>
    set({
      accessToken,
      user,
      isAuthenticated: true,
      isInitializing: false,
    }),

  clearSession: () =>
    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      isInitializing: false,
    }),

  setInitializing: (isInitializing) => set({ isInitializing }),
}));
