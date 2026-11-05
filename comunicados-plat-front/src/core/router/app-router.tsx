import { Suspense, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router';
import { authContainer } from '../../features/auth/infrastructure/container';
import { authRoutes } from '../../features/auth/presentation/routes/auth.routes';
import { dashboardRoutes } from '../../features/dashboard/presentation/routes/dashboard.routes';
import { landingRoutes } from '../../features/landing/presentation/routes/landing.routes';
import { useAuthStore } from '../store/use-auth-store';

const router = createBrowserRouter([
  ...landingRoutes,
  ...authRoutes,
  ...dashboardRoutes,
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export function AppRouter() {
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);

  useEffect(() => {
    let isMounted = true;

    authContainer.refreshSessionUseCase
      .execute()
      .then((session) => {
        if (isMounted) {
          setSession(session.accessToken, session.user);
        }
      })
      .catch(() => {
        if (isMounted) {
          clearSession();
        }
      });

    return () => {
      isMounted = false;
    };
  }, [setSession, clearSession]);

  return (
    <Suspense
      fallback={
        <div className="min-h-svh flex items-center justify-center bg-fondo text-texto-principal">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full border-3 border-primario border-t-transparent animate-spin" />
            <span className="text-xs font-extrabold uppercase tracking-widest text-primario">
              Cargando Sistema TERRA...
            </span>
          </div>
        </div>
      }
    >
      <RouterProvider router={router} />
    </Suspense>
  );
}
