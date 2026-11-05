import { Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router';
import { landingRoutes } from '../../features/landing/presentation/routes/landing.routes';

const router = createBrowserRouter([
  ...landingRoutes,
  {
    path: '/login',
    element: <Navigate to="/" replace />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export function AppRouter() {
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

