import { useState, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { KeyRound, X, AlertCircle, Loader2, Check } from 'lucide-react';
import { SlideFadeTransition } from '../../../../shared/components/slide-fade-transition';
import type { Permiso } from '../../domain/models/permiso.model';
import {
  useCreatePermisoMutation,
  useUpdatePermisoMutation,
} from '../hooks/use-permiso-mutations';
import { usePermisosUiStore } from '../store/use-permisos-ui-store';

function PermisoFormDialogContent({
  editingPermiso,
  onClose,
}: {
  editingPermiso: Permiso | null;
  onClose: () => void;
}) {
  const [nombre, setNombre] = useState(editingPermiso ? editingPermiso.nombre : '');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const createMutation = useCreatePermisoMutation();
  const updateMutation = useUpdatePermisoMutation();

  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    try {
      if (editingPermiso) {
        await updateMutation.mutateAsync({
          idPermiso: editingPermiso.idPermiso,
          nombre,
        });
      } else {
        await createMutation.mutateAsync({ nombre });
      }
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Ocurrió un error al guardar el permiso.');
      }
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="permiso-modal-title"
      className="rounded-terra-modal bg-superficie-1 border-[1.5px] border-borde p-6 shadow-terra text-left flex flex-col gap-5"
    >
      <div className="flex items-start justify-between gap-3 border-b border-borde-suave pb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-terra-boton bg-gradient-to-br from-[#28a45a] to-[#1e7e46] text-white shadow-[0_10px_22px_-4px_rgba(30,126,70,0.42)] flex items-center justify-center shrink-0">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[0.65rem] font-extrabold uppercase tracking-[0.18em] text-primario block">
              Seguridad Granular RBAC
            </span>
            <h2
              id="permiso-modal-title"
              className="text-base sm:text-lg font-extrabold text-texto-principal"
            >
              {editingPermiso ? 'Editar Permiso' : 'Nuevo Permiso'}
            </h2>
          </div>
        </div>

        <button
          type="button"
          disabled={isPending}
          onClick={onClose}
          aria-label="Cerrar modal"
          className="min-w-[2.75rem] min-h-[2.75rem] w-11 h-11 rounded-full hover:bg-superficie-2 text-texto-suave hover:text-texto-principal flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
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

        <div className="flex flex-col gap-2">
          <label
            htmlFor="permiso-nombre-input"
            className="text-xs font-extrabold uppercase tracking-wider text-texto-principal"
          >
            Nombre del Permiso
          </label>
          <input
            id="permiso-nombre-input"
            type="text"
            required
            maxLength={100}
            disabled={isPending}
            value={nombre}
            onChange={(e) => {
              setNombre(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            placeholder="Ej. crear comunicados, gestionar usuarios..."
            className="w-full min-h-[3rem] px-4 py-2.5 rounded-terra-campo bg-superficie-2 border-[1.5px] border-borde hover:border-borde-hover focus:border-primario focus:bg-superficie-1 focus:shadow-terra-anillo focus:outline-none text-sm font-medium text-texto-principal placeholder:text-texto-placeholder transition-all"
          />
          <span className="text-[0.68rem] text-texto-suave">
            Se normalizará automáticamente en minúsculas (máx. 100 caracteres).
          </span>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-borde-suave">
          <button
            type="button"
            disabled={isPending}
            onClick={onClose}
            className="min-h-[2.75rem] px-4 py-2 rounded-full bg-superficie-2 hover:bg-superficie-crema border border-borde text-xs font-bold text-texto-principal transition-colors cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={isPending}
            className="min-h-[2.75rem] px-5 py-2 rounded-full bg-primario hover:bg-primario-hover text-sobre-primario shadow-terra-flotante text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-60"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            <span>{editingPermiso ? 'Guardar Cambios' : 'Registrar Permiso'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export function PermisoFormModal() {
  const isFormModalOpen = usePermisosUiStore((state) => state.isFormModalOpen);
  const editingPermiso = usePermisosUiStore((state) => state.editingPermiso);
  const closeFormModal = usePermisosUiStore((state) => state.closeFormModal);

  if (!isFormModalOpen || typeof document === 'undefined') return null;

  const modalKey = editingPermiso?.idPermiso ?? 'create-permiso';

  return createPortal(
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div
        aria-hidden="true"
        onClick={closeFormModal}
        className="fixed inset-0 bg-black/55 backdrop-blur-xs transition-opacity"
      />

      <SlideFadeTransition
        isVisible={isFormModalOpen}
        direction="vertical"
        offset={24}
        preset="spring"
        transitionKey={modalKey}
        className="relative z-10 w-full max-w-[26rem]"
      >
        <PermisoFormDialogContent
          key={modalKey}
          editingPermiso={editingPermiso}
          onClose={closeFormModal}
        />
      </SlideFadeTransition>
    </div>,
    document.body,
  );
}
