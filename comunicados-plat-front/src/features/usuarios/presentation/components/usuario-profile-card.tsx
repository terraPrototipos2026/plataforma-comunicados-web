import { useState, useEffect } from 'react';
import {
  UserCircle2,
  User,
  Mail,
  Phone,
  Shield,
  Building2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RotateCcw,
  Save,
  ShieldCheck,
  KeyRound,
  Lock,
} from 'lucide-react';
import { useAuthStore } from '../../../../core/store/use-auth-store';
import { useThemeStore } from '../../../../core/store/use-theme-store';
import { useDepartamentosQuery } from '../../../departamentos/presentation/hooks/use-departamentos-query';
import { UsuarioRules } from '../../domain/models/usuario.model';
import { useUpdateUsuarioMutation } from '../hooks/use-usuario-mutations';
import { useUsuarioDetailQuery } from '../hooks/use-usuarios-query';

export function UsuarioProfileCard() {
  const authUser = useAuthStore((state) => state.user);
  const updateUserInStore = useAuthStore((state) => state.updateUser);
  const highContrast = useThemeStore((state) => state.highContrast);

  const { data: usuarioDetalle, isLoading: isLoadingDetalle } = useUsuarioDetailQuery(
    authUser?.idUsuario,
  );
  const { data: departamentos = [], isLoading: isLoadingDepts } = useDepartamentosQuery();
  const updateMutation = useUpdateUsuarioMutation();

  const [nombre, setNombre] = useState(authUser?.nombre ?? '');
  const [correo, setCorreo] = useState(authUser?.correo ?? '');
  const [telefono, setTelefono] = useState('');
  const [departamento, setDepartamento] = useState(authUser?.departamento ?? '');

  const rolActual = usuarioDetalle?.rol ?? authUser?.rol ?? 'Sin rol';

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (usuarioDetalle) {
      setNombre(usuarioDetalle.nombre);
      setCorreo(usuarioDetalle.correo);
      setTelefono(usuarioDetalle.telefono ?? '');
      setDepartamento(usuarioDetalle.departamento);
    } else if (authUser) {
      setNombre(authUser.nombre);
      setCorreo(authUser.correo);
      setDepartamento(authUser.departamento);
    }
  }, [usuarioDetalle, authUser]);

  const handleReset = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    if (usuarioDetalle) {
      setNombre(usuarioDetalle.nombre);
      setCorreo(usuarioDetalle.correo);
      setTelefono(usuarioDetalle.telefono ?? '');
      setDepartamento(usuarioDetalle.departamento);
    } else if (authUser) {
      setNombre(authUser.nombre);
      setCorreo(authUser.correo);
      setTelefono('');
      setDepartamento(authUser.departamento);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUser) return;

    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const updated = await updateMutation.mutateAsync({
        idUsuario: authUser.idUsuario,
        nombre,
        correo,
        telefono: telefono.trim() ? telefono : undefined,
        departamento,
      });

      updateUserInStore({
        nombre: updated.nombre,
        correo: updated.correo,
        departamento: updated.departamento,
      });

      setSuccessMessage('Tu información de perfil se ha actualizado correctamente.');
    } catch (err) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('No fue posible actualizar tu perfil.');
      }
    }
  };

  const displayNombre = nombre || authUser?.nombre || 'Colaborador TERRA';
  const displayRol = rolActual;
  const displayDept = departamento || authUser?.departamento || 'Sin departamento';

  return (
    <article
      aria-labelledby="profile-usuario-heading"
      className="rounded-terra-tarjeta bg-superficie-1 border-[1.5px] border-borde p-5 pt-0 shadow-terra-card flex flex-col gap-6 text-left mt-6"
    >
      {/* Cabecera Flotante Overhanging estilo Material Dashboard 2 + TERRA */}
      <div
        className={`-mt-6 rounded-terra p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          highContrast
            ? 'bg-superficie-2 text-texto-principal border-2 border-white'
            : 'bg-gradient-to-r from-[#352c2a] to-[#1e1917] text-[#f4ede8] shadow-[0_12px_26px_-6px_rgba(30,25,23,0.48)]'
        }`}
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-oferta to-primario text-sobre-primario font-extrabold text-sm flex items-center justify-center shrink-0 shadow-terra-sm border-2 border-white/20">
            {UsuarioRules.getIniciales(displayNombre)}
          </div>
          <div>
            <span className="text-[0.65rem] font-extrabold uppercase tracking-[0.18em] opacity-80 block">
              Cuenta Institucional Verificada
            </span>
            <h2
              id="profile-usuario-heading"
              className="text-base sm:text-lg font-extrabold tracking-tight flex items-center gap-2"
            >
              <span>{displayNombre}</span>
              <ShieldCheck className="w-4 h-4 text-[#58c986] shrink-0" />
            </h2>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/12 border border-white/15 text-xs font-extrabold capitalize">
            <Shield className="w-3.5 h-3.5 text-[#ffb3bd]" />
            <span>{displayRol}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/12 border border-white/15 text-xs font-extrabold capitalize">
            <Building2 className="w-3.5 h-3.5 text-[#f4ede8]/80" />
            <span>{displayDept}</span>
          </span>
        </div>
      </div>

      {/* Contenedor Centrado de Alertas y Formulario */}
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-5 py-1">
        {/* Resumen Rápido de Permisos Activos y Seguridad */}
        <div className="rounded-terra bg-superficie-2/80 border border-borde p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-terra-chico bg-primario-claro text-primario flex items-center justify-center shrink-0 mt-0.5">
              <UserCircle2 className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-extrabold uppercase tracking-wider text-primario">
                Ficha de Perfil Corporativo
              </span>
              <p className="text-xs text-texto-suave">
                Actualiza tus datos de contacto y asignación organizacional. Los cambios se reflejarán de inmediato en tu sesión activa.
              </p>
            </div>
          </div>

          {authUser?.permisos && authUser.permisos.length > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-superficie-1 border border-borde shrink-0 self-start sm:self-center">
              <KeyRound className="w-3.5 h-3.5 text-primario shrink-0" />
              <span className="text-xs font-extrabold text-texto-principal">
                {authUser.permisos.length} permisos activos
              </span>
            </div>
          )}
        </div>

        {/* Mensaje de Éxito */}
        {successMessage && (
          <div
            role="status"
            className="rounded-terra-campo bg-[#e4f4e9] border-[1.5px] border-[#bfe3ca] p-4 flex items-center gap-3 text-left"
          >
            <CheckCircle2 className="w-5 h-5 text-exito shrink-0" />
            <p className="text-xs sm:text-sm font-extrabold text-texto-principal">
              {successMessage}
            </p>
          </div>
        )}

        {/* Mensaje de Error */}
        {errorMessage && (
          <div
            role="alert"
            className="rounded-terra-campo bg-primario-claro border border-alerta p-4 text-xs font-bold text-alerta flex items-center gap-2.5"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Estado de carga inicial del detalle */}
        {isLoadingDetalle ? (
          <div className="py-10 flex items-center justify-center gap-2 text-xs font-bold text-texto-suave">
            <Loader2 className="w-4 h-4 animate-spin text-primario" />
            <span>Cargando información detallada del perfil...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nombre Completo */}
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
                  placeholder="Tu nombre completo"
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
                  placeholder="correo@terra.com"
                  className="w-full min-h-[3rem] px-4 py-2 rounded-terra-campo bg-superficie-2 border-[1.5px] border-borde focus:border-primario focus:bg-superficie-1 focus:shadow-terra-anillo focus:outline-none text-sm font-medium text-texto-principal placeholder:text-texto-placeholder"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Teléfono de Contacto */}
              <div>
                <label className="text-xs font-extrabold uppercase tracking-wider text-texto-suave mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-primario" />
                  <span>Teléfono de Contacto</span>
                </label>
                <input
                  type="text"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="+591 70000000"
                  className="w-full min-h-[3rem] px-4 py-2 rounded-terra-campo bg-superficie-2 border-[1.5px] border-borde focus:border-primario focus:bg-superficie-1 focus:shadow-terra-anillo focus:outline-none text-sm font-medium text-texto-principal placeholder:text-texto-placeholder"
                />
              </div>

              {/* Rol Asignado (Solo lectura) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-texto-suave flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-primario" />
                    <span>Rol Asignado</span>
                  </label>
                  <span className="inline-flex items-center gap-1 text-[0.65rem] font-bold uppercase tracking-wider text-texto-suave bg-superficie-2 px-2 py-0.5 rounded-full border border-borde">
                    <Lock className="w-2.5 h-2.5 text-primario" />
                    <span>Solo lectura</span>
                  </span>
                </div>
                <input
                  type="text"
                  readOnly
                  disabled
                  value={displayRol}
                  aria-label="Rol asignado (solo lectura)"
                  className="w-full min-h-[3rem] px-4 py-2 rounded-terra-campo bg-superficie-2/60 border-[1.5px] border-borde-suave text-sm font-bold text-texto-suave capitalize cursor-not-allowed select-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              {/* Departamento Asignado */}
              <div>
                <label className="text-xs font-extrabold uppercase tracking-wider text-texto-suave mb-1.5 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-primario" />
                  <span>Departamento Corporativo *</span>
                </label>
                <select
                  required
                  value={departamento}
                  onChange={(e) => setDepartamento(e.target.value)}
                  disabled={isLoadingDepts}
                  className="w-full min-h-[3rem] px-4 py-2 rounded-terra-campo bg-superficie-2 border-[1.5px] border-borde focus:border-primario focus:bg-superficie-1 focus:shadow-terra-anillo focus:outline-none text-sm font-medium text-texto-principal capitalize cursor-pointer disabled:opacity-50"
                >
                  {departamentos.map((d) => (
                    <option key={d.idDepartamento} value={d.nombre}>
                      {d.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Aviso de Contraseña Protegida (No editable en esta vista) */}
              <div className="min-h-[3rem] px-4 py-2.5 rounded-terra-campo bg-superficie-crema border border-borde flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-primario shrink-0" />
                <span className="text-xs font-semibold text-texto-suave leading-snug">
                  La contraseña de acceso está protegida y no es editable desde la vista de perfil.
                </span>
              </div>
            </div>

            {/* Barra Inferior de Acciones */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-borde-suave mt-2">
              <button
                type="button"
                onClick={handleReset}
                disabled={updateMutation.isPending}
                className="w-full sm:w-auto min-h-[2.85rem] px-5 py-2 rounded-full bg-superficie-2 hover:bg-superficie-crema border border-borde text-xs font-bold text-texto-principal flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restablecer cambios</span>
              </button>

              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="w-full sm:w-auto min-h-[3rem] px-7 py-2.5 rounded-full bg-primario hover:bg-primario-hover text-sobre-primario shadow-terra-flotante text-sm font-extrabold flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-60"
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Guardando Perfil...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Guardar Información de Perfil</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </article>
  );
}
