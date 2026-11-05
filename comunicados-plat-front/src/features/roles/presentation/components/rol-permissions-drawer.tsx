import { useState } from 'react';
import { createPortal } from 'react-dom';
import { KeyRound, X, Check, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';
import { SlideFadeTransition } from '../../../../shared/components/slide-fade-transition';
import { usePermisosQuery } from '../../../permisos/presentation/hooks/use-permisos-query';
import { RolRules, type Rol } from '../../domain/models/rol.model';
import { useAssignPermisosToRolMutation } from '../hooks/use-rol-mutations';
import { useRolesUiStore } from '../store/use-roles-ui-store';

function RolPermissionsDialogContent({
  targetRol,
  onClose,
}: {
  targetRol: Rol;
  onClose: () => void;
}) {
  const { data: allPermisos = [] } = usePermisosQuery();
  const assignMutation = useAssignPermisosToRolMutation();

  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    targetRol.permisos.map((p) => p.idPermiso),
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const togglePermiso = (idPermiso: string) => {
    setSelectedIds((prev) =>
      prev.includes(idPermiso)
        ? prev.filter((id) => id !== idPermiso)
        : [...prev, idPermiso],
    );
  };

  const handleSave = async () => {
    setErrorMessage(null);
    try {
      await assignMutation.mutateAsync({
        idRol: targetRol.idRol,
        permisoIds: selectedIds,
      });
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Error al sincronizar los permisos del rol.');
      }
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="rol-permisos-drawer-title"
      className="rounded-terra-modal bg-superficie-1 border-[1.5px] border-borde p-6 shadow-terra text-left flex flex-col gap-5 max-h-[88svh]"
    >
      {/* Cabecera */}
      <div className="flex items-start justify-between gap-3 border-b border-borde-suave pb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-terra-boton bg-gradient-to-br from-oferta to-primario text-sobre-primario shadow-terra-flotante flex items-center justify-center shrink-0">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[0.65rem] font-extrabold uppercase tracking-[0.18em] text-primario block">
              Sincronización de Permisos
            </span>
            <h2
              id="rol-permisos-drawer-title"
              className="text-base sm:text-lg font-extrabold text-texto-principal"
            >
              Permisos de: {RolRules.formatDisplayName(targetRol.nombre)}
            </h2>
          </div>
        </div>

        <button
          type="button"
          disabled={assignMutation.isPending}
          onClick={onClose}
          aria-label="Cerrar matriz de permisos"
          className="min-w-[2.75rem] min-h-[2.75rem] w-11 h-11 rounded-full hover:bg-superficie-2 text-texto-suave hover:text-texto-principal flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="rounded-terra-campo border-[1.5px] border-alerta bg-primario-claro p-3 flex items-start gap-2.5 text-alerta"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="text-xs font-bold text-texto-principal">
            {errorMessage}
          </span>
        </div>
      )}

      {/* Barra superior de selección rápida */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold text-texto-suave">
          Seleccionados:{' '}
          <strong className="text-primario">{selectedIds.length}</strong> de{' '}
          {allPermisos.length} permisos
        </span>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSelectedIds(allPermisos.map((p) => p.idPermiso))}
            className="text-xs font-extrabold text-primario hover:underline cursor-pointer"
          >
            Marcar todos
          </button>
          <button
            type="button"
            onClick={() => setSelectedIds([])}
            className="text-xs font-bold text-texto-suave hover:text-texto-principal cursor-pointer"
          >
            Limpiar
          </button>
        </div>
      </div>

      {/* Lista directa de permisos disponibles */}
      <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {allPermisos.map((permiso) => {
          const isChecked = selectedIds.includes(permiso.idPermiso);
          return (
            <button
              key={permiso.idPermiso}
              type="button"
              onClick={() => togglePermiso(permiso.idPermiso)}
              aria-pressed={isChecked}
              className={`min-h-[2.85rem] px-3.5 py-2 rounded-terra-boton border text-left text-xs font-bold flex items-center justify-between gap-2 transition-all cursor-pointer ${
                isChecked
                  ? 'bg-primario text-sobre-primario border-primario shadow-terra-sm'
                  : 'bg-superficie-2 text-texto-principal border-borde hover:border-primario'
              }`}
            >
              <code className="truncate">{permiso.nombre}</code>
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                  isChecked
                    ? 'bg-white/22 text-sobre-primario'
                    : 'border border-borde text-transparent'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
              </span>
            </button>
          );
        })}
      </div>

      {/* Acciones inferiores */}
      <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-borde-suave">
        <button
          type="button"
          disabled={assignMutation.isPending}
          onClick={onClose}
          className="min-h-[2.75rem] px-4 py-2 rounded-full bg-superficie-2 hover:bg-superficie-crema border border-borde text-xs font-bold text-texto-principal transition-colors cursor-pointer"
        >
          Cancelar
        </button>

        <button
          type="button"
          disabled={assignMutation.isPending}
          onClick={handleSave}
          className="min-h-[2.75rem] px-5 py-2 rounded-full bg-primario hover:bg-primario-hover text-sobre-primario shadow-terra-flotante text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-60"
        >
          {assignMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ShieldCheck className="w-4 h-4" />
          )}
          <span>Sincronizar Permisos</span>
        </button>
      </div>
    </div>
  );
}

export function RolPermissionsDrawer() {
  const permissionsTargetRol = useRolesUiStore(
    (state) => state.permissionsTargetRol,
  );
  const closePermissionsDrawer = useRolesUiStore(
    (state) => state.closePermissionsDrawer,
  );

  if (!permissionsTargetRol || typeof document === 'undefined') return null;

  const drawerKey = `perm-drawer-${permissionsTargetRol.idRol}`;

  return createPortal(
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div
        aria-hidden="true"
        onClick={closePermissionsDrawer}
        className="fixed inset-0 bg-black/55 backdrop-blur-xs transition-opacity"
      />

      <SlideFadeTransition
        isVisible={Boolean(permissionsTargetRol)}
        direction="vertical"
        offset={28}
        preset="spring"
        transitionKey={drawerKey}
        className="relative z-10 w-full max-w-[36rem]"
      >
        <RolPermissionsDialogContent
          key={drawerKey}
          targetRol={permissionsTargetRol}
          onClose={closePermissionsDrawer}
        />
      </SlideFadeTransition>
    </div>,
    document.body,
  );
}
