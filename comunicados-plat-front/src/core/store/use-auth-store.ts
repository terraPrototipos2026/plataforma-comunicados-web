import { create } from 'zustand';
import type { AuthUser } from '../../features/auth/domain/models/auth-user.model';

interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  setSession: (accessToken: string, user: AuthUser) => void;
  updateUser: (partialUser: Partial<AuthUser>) => void;
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

  updateUser: (partialUser) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...partialUser } : null,
    })),

  clearSession: () =>
    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      isInitializing: false,
    }),

  setInitializing: (isInitializing) => set({ isInitializing }),
}));
