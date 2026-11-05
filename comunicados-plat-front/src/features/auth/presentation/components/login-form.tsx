import { useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router';
import {
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  AlertCircle,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { SlideFadeTransition } from '../../../../shared/components/slide-fade-transition';
import { useLoginMutation } from '../hooks/use-login-mutation';

interface LocationState {
  from?: {
    pathname?: string;
  };
}

export function LoginForm() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const loginMutation = useLoginMutation();

  const state = location.state as LocationState | null;
  const redirectPath = state?.from?.pathname ?? '/dashboard';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationError(null);

    try {
      await loginMutation.mutateAsync({ correo, password });
      navigate(redirectPath, { replace: true });
    } catch (err) {
      if (err instanceof Error) {
        setValidationError(err.message);
      } else {
        setValidationError('No fue posible iniciar sesión. Verifica tus credenciales.');
      }
    }
  };

  const activeErrorMessage =
    validationError ?? (loginMutation.error instanceof Error ? loginMutation.error.message : null);

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5 text-left">
      {/* Alerta de Error con Animación Slide + Fade */}
      <SlideFadeTransition
        isVisible={Boolean(activeErrorMessage)}
        direction="horizontal"
        exitMode="reverse"
        offset={28}
        preset="spring"
        transitionKey={activeErrorMessage ?? 'no-error'}
      >
        <div
          role="alert"
          aria-live="assertive"
          className="rounded-terra-campo border-[1.5px] border-alerta bg-primario-claro p-3.5 flex items-start gap-3 text-alerta"
        >
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-extrabold uppercase tracking-wider">
              Acceso denegado
            </span>
            <p className="text-sm font-semibold text-texto-principal">{activeErrorMessage}</p>
          </div>
        </div>
      </SlideFadeTransition>

      {/* Campo: Correo Electrónico Corporativo */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="correo-input"
          className="text-xs font-extrabold uppercase tracking-wider text-texto-principal"
        >
          Correo Electrónico Corporativo
        </label>
        <div className="relative flex items-center">
          <Mail
            aria-hidden="true"
            className="w-5 h-5 text-texto-suave absolute left-3.5 pointer-events-none"
          />
          <input
            id="correo-input"
            name="correo"
            type="email"
            autoComplete="email"
            required
            disabled={loginMutation.isPending}
            value={correo}
            onChange={(e) => {
              setCorreo(e.target.value);
              if (validationError) setValidationError(null);
            }}
            placeholder="colaborador@terra.com"
            className="w-full min-h-[3rem] pl-11 pr-4 py-2.5 rounded-terra-campo bg-superficie-2 border-[1.5px] border-borde hover:border-borde-hover focus:border-primario focus:bg-superficie-1 focus:shadow-terra-anillo focus:outline-none text-sm font-medium text-texto-principal placeholder:text-texto-placeholder transition-all disabled:opacity-60"
          />
        </div>
      </div>

      {/* Campo: Contraseña */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="password-input"
          className="text-xs font-extrabold uppercase tracking-wider text-texto-principal"
        >
          Contraseña
        </label>
        <div className="relative flex items-center">
          <LockKeyhole
            aria-hidden="true"
            className="w-5 h-5 text-texto-suave absolute left-3.5 pointer-events-none"
          />
          <input
            id="password-input"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            disabled={loginMutation.isPending}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (validationError) setValidationError(null);
            }}
            placeholder="••••••••••••"
            className="w-full min-h-[3rem] pl-11 pr-12 py-2.5 rounded-terra-campo bg-superficie-2 border-[1.5px] border-borde hover:border-borde-hover focus:border-primario focus:bg-superficie-1 focus:shadow-terra-anillo focus:outline-none text-sm font-medium text-texto-principal placeholder:text-texto-placeholder transition-all disabled:opacity-60"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            className="absolute right-1 min-w-[2.75rem] min-h-[2.75rem] w-11 h-11 rounded-terra-chico text-texto-suave hover:text-primario flex items-center justify-center transition-colors cursor-pointer"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Botón CTA Principal TERRA */}
      <button
        type="submit"
        disabled={loginMutation.isPending}
        className="group mt-1 min-h-[3.1rem] w-full px-5 py-2 rounded-full bg-primario hover:bg-primario-hover text-sobre-primario shadow-terra-flotante transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 motion-reduce:transform-none flex items-center justify-between gap-3 cursor-pointer disabled:opacity-70 disabled:pointer-events-none"
      >
        <div className="flex flex-col text-left">
          <span className="text-[0.62rem] font-semibold uppercase tracking-wider opacity-85">
            Portal Interno TERRA
          </span>
          <span className="text-xs sm:text-sm font-extrabold">
            {loginMutation.isPending ? 'Verificando credenciales...' : 'Iniciar Sesión'}
          </span>
        </div>
        <div className="w-8 h-8 rounded-full bg-white/18 flex items-center justify-center shrink-0">
          {loginMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none" />
          )}
        </div>
      </button>
    </form>
  );
}
