import { useState } from 'react';
import {
  UserPlus,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Users,
  Building2,
  Shield,
  KeyRound,
  Mail,
  User,
  Phone,
} from 'lucide-react';
import { useThemeStore } from '../../../../core/store/use-theme-store';
import { useRolesQuery } from '../../../roles/presentation/hooks/use-roles-query';
import { useDepartamentosQuery } from '../../../departamentos/presentation/hooks/use-departamentos-query';
import { useRegisterUsuarioMutation } from '../hooks/use-usuario-mutations';

interface UsuarioRegisterCardProps {
  onGoToListado?: () => void;
}

export function UsuarioRegisterCard({ onGoToListado }: UsuarioRegisterCardProps) {
  const { data: roles = [], isLoading: isLoadingRoles } = useRolesQuery();
  const { data: departamentos = [], isLoading: isLoadingDepts } = useDepartamentosQuery();
  const registerMutation = useRegisterUsuarioMutation();

  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [telefono, setTelefono] = useState('');
  const [rol, setRol] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{ idUsuario: string; correo: string } | null>(
    null,
  );

  const highContrast = useThemeStore((state) => state.highContrast);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessInfo(null);

    const effectiveRol = rol || (roles[0]?.nombre ?? '');
    const effectiveDept = departamento || (departamentos[0]?.nombre ?? '');

    try {
      const result = await registerMutation.mutateAsync({
        nombre,
        correo,
        password,
        telefono: telefono.trim() ? telefono : undefined,
        rol: effectiveRol,
        departamento: effectiveDept,
      });

      setSuccessInfo(result);
      setNombre('');
      setCorreo('');
      setPassword('');
      setTelefono('');
    } catch (err) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('No fue posible completar el registro del usuario.');
      }
    }
  };

  return (
    <article
      aria-labelledby="register-usuario-heading"
      className="rounded-terra-tarjeta bg-superficie-1 border-[1.5px] border-borde p-5 pt-0 shadow-terra-card flex flex-col gap-6 text-left mt-6"
    >
      {/* Cabecera Flotante Overhanging estilo Material Dashboard 2 + TERRA */}
      <div
        className={`-mt-6 rounded-terra p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          highContrast
            ? 'bg-superficie-2 text-texto-principal border-2 border-white'
            : 'bg-gradient-to-r from-oferta to-primario text-sobre-primario shadow-terra-flotante'
        }`}
      >
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-terra-boton bg-white/16 flex items-center justify-center shrink-0">
            <UserPlus className="w-5 h-5 text-sobre-primario" />
          </div>
          <div>
            <span className="text-[0.65rem] font-extrabold uppercase tracking-[0.18em] opacity-80 block">
              Control de Accesos &amp; Cuentas
            </span>
            <h2 id="register-usuario-heading" className="text-base sm:text-lg font-extrabold tracking-tight">
              Registro de Usuario en el Sistema
            </h2>
          </div>
        </div>

        {onGoToListado && (
          <button
            type="button"
            onClick={onGoToListado}
            className="min-h-[2.75rem] px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 text-sobre-primario border border-white/20 text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
          >
            <Users className="w-4 h-4" />
            <span>Ver Directorio</span>
          </button>
        )}
      </div>

      {/* Mensaje de Éxito al Registrar */}
      {successInfo && (
        <div
          role="status"
          className="w-full max-w-4xl mx-auto rounded-terra-campo bg-[#e4f4e9] border-[1.5px] border-[#bfe3ca] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left"
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-exito shrink-0" />
            <div>
              <p className="text-sm font-extrabold text-texto-principal">
                ¡Usuario registrado con éxito!
              </p>
              <p className="text-xs text-texto-suave">
                Se ha dado de alta la cuenta institucional para{' '}
                <strong>{successInfo.correo}</strong>.
              </p>
            </div>
          </div>

          {onGoToListado && (
            <button
              type="button"
              onClick={onGoToListado}
              className="min-h-[2.75rem] px-4 py-1.5 rounded-full bg-exito hover:opacity-90 text-white text-xs font-extrabold transition-opacity cursor-pointer shrink-0"
            >
              Consultar en Listado
            </button>
          )}
        </div>
      )}

      {/* Alerta de Error */}
      {errorMessage && (
        <div
          role="alert"
          className="w-full max-w-4xl mx-auto rounded-terra-campo bg-primario-claro border border-alerta p-4 text-xs font-bold text-alerta flex items-center gap-2.5"
        >
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Formulario Estructurado y Centrado */}
      <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto flex flex-col gap-5 py-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Nombre */}
          <div>
            <label className="text-xs font-extrabold uppercase tracking-wider text-texto-suave mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-primario" />
              <span>Nombre Completo *</span>
            </label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Roberto Mendoza Quispe"
              className="w-full min-h-[3rem] px-4 py-2 rounded-terra-campo bg-superficie-2 border-[1.5px] border-borde focus:border-primario focus:bg-superficie-1 focus:shadow-terra-anillo focus:outline-none text-sm font-medium text-texto-principal placeholder:text-texto-placeholder"
            />
          </div>

          {/* Correo Electrónico */}
          <div>
            <label className="text-xs font-extrabold uppercase tracking-wider text-texto-suave mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-primario" />
              <span>Correo Electrónico *</span>
            </label>
            <input
              type="email"
              required
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="ejemplo@terra.com"
              className="w-full min-h-[3rem] px-4 py-2 rounded-terra-campo bg-superficie-2 border-[1.5px] border-borde focus:border-primario focus:bg-superficie-1 focus:shadow-terra-anillo focus:outline-none text-sm font-medium text-texto-principal placeholder:text-texto-placeholder"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Contraseña Inicial */}
          <div>
            <label className="text-xs font-extrabold uppercase tracking-wider text-texto-suave mb-1.5 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-primario" />
              <span>Contraseña Inicial (mínimo 6 caracteres) *</span>
            </label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full min-h-[3rem] pl-4 pr-11 py-2 rounded-terra-campo bg-superficie-2 border-[1.5px] border-borde focus:border-primario focus:bg-superficie-1 focus:shadow-terra-anillo focus:outline-none text-sm font-medium text-texto-principal placeholder:text-texto-placeholder"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                className="absolute right-2 w-8 h-8 rounded-full hover:bg-superficie-1 text-texto-suave hover:text-texto-principal flex items-center justify-center cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Teléfono */}
          <div>
            <label className="text-xs font-extrabold uppercase tracking-wider text-texto-suave mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-primario" />
              <span>Teléfono de Contacto (Opcional)</span>
            </label>
            <input
              type="text"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="+591 70000000"
              className="w-full min-h-[3rem] px-4 py-2 rounded-terra-campo bg-superficie-2 border-[1.5px] border-borde focus:border-primario focus:bg-superficie-1 focus:shadow-terra-anillo focus:outline-none text-sm font-medium text-texto-principal placeholder:text-texto-placeholder"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Rol Asignado */}
          <div>
            <label className="text-xs font-extrabold uppercase tracking-wider text-texto-suave mb-1.5 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-primario" />
              <span>Rol Asignado *</span>
            </label>
            <select
              required
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              disabled={isLoadingRoles}
              className="w-full min-h-[3rem] px-4 py-2 rounded-terra-campo bg-superficie-2 border-[1.5px] border-borde focus:border-primario focus:bg-superficie-1 focus:shadow-terra-anillo focus:outline-none text-sm font-medium text-texto-principal capitalize cursor-pointer disabled:opacity-50"
            >
              <option value="" disabled>
                {isLoadingRoles ? 'Cargando roles...' : 'Selecciona un rol'}
              </option>
              {roles.map((r) => (
                <option key={r.idRol} value={r.nombre}>
                  {r.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Departamento Asignado */}
          <div>
            <label className="text-xs font-extrabold uppercase tracking-wider text-texto-suave mb-1.5 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-primario" />
              <span>Departamento Asignado *</span>
            </label>
            <select
              required
              value={departamento}
              onChange={(e) => setDepartamento(e.target.value)}
              disabled={isLoadingDepts}
              className="w-full min-h-[3rem] px-4 py-2 rounded-terra-campo bg-superficie-2 border-[1.5px] border-borde focus:border-primario focus:bg-superficie-1 focus:shadow-terra-anillo focus:outline-none text-sm font-medium text-texto-principal capitalize cursor-pointer disabled:opacity-50"
            >
              <option value="" disabled>
                {isLoadingDepts ? 'Cargando departamentos...' : 'Selecciona un departamento'}
              </option>
              {departamentos.map((d) => (
                <option key={d.idDepartamento} value={d.nombre}>
                  {d.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-borde-suave mt-2">
          <p className="text-xs text-texto-suave">
            La contraseña se cifrará de forma segura con <strong>Argon2id</strong>.
          </p>

          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full sm:w-auto min-h-[3rem] px-8 py-2.5 rounded-full bg-primario hover:bg-primario-hover text-sobre-primario shadow-terra-flotante text-sm font-extrabold flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-60"
          >
            {registerMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Registrando Usuario...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Crear Cuenta de Usuario</span>
              </>
            )}
          </button>
        </div>
      </form>
    </article>
  );
}

