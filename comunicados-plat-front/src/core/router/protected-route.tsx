import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuthStore } from '../store/use-auth-store';

interface ProtectedRouteProps {
  requiredPermission?: string;
}

export function ProtectedRoute({ requiredPermission }: ProtectedRouteProps) {
  const { isAuthenticated, isInitializing, user } = useAuthStore();
  const location = useLocation();

  if (isInitializing) {
    return (
      <div className="min-h-svh flex items-center justify-center bg-fondo text-texto-principal">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-3 border-primario border-t-transparent animate-spin" />
          <span className="text-xs font-extrabold uppercase tracking-widest text-primario">
            Verificando sesión TERRA...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredPermission && user && !user.permisos.includes(requiredPermission)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
