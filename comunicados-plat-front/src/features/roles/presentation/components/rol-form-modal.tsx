import { useState, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { Shield, X, AlertCircle, Loader2, Check } from 'lucide-react';
import { SlideFadeTransition } from '../../../../shared/components/slide-fade-transition';
import { usePermisosQuery } from '../../../permisos/presentation/hooks/use-permisos-query';
import type { Rol } from '../../domain/models/rol.model';
import {
  useCreateRolMutation,
  useUpdateRolMutation,
} from '../hooks/use-rol-mutations';
import { useRolesUiStore } from '../store/use-roles-ui-store';

function RolFormDialogContent({
  editingRol,
  onClose,
}: {
  editingRol: Rol | null;
  onClose: () => void;
}) {
  const { data: allPermisos = [] } = usePermisosQuery();

  const [nombre, setNombre] = useState(editingRol ? editingRol.nombre : '');
  const [selectedPermisoIds, setSelectedPermisoIds] = useState<string[]>(() =>
    editingRol ? editingRol.permisos.map((p) => p.idPermiso) : [],
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const createMutation = useCreateRolMutation();
  const updateMutation = useUpdateRolMutation();

  const isPending = createMutation.isPending || updateMutation.isPending;

  const togglePermisoId = (idPermiso: string) => {
    setSelectedPermisoIds((prev) =>
      prev.includes(idPermiso)
        ? prev.filter((id) => id !== idPermiso)
        : [...prev, idPermiso],
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    try {
      if (editingRol) {
        await updateMutation.mutateAsync({
          idRol: editingRol.idRol,
          nombre,
        });
      } else {
        await createMutation.mutateAsync({
          nombre,
          permisoIds: selectedPermisoIds,
        });
      }
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Ocurrió un error al guardar el rol.');
      }
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="rol-modal-title"
      className="rounded-terra-modal bg-superficie-1 border-[1.5px] border-borde p-6 shadow-terra text-left flex flex-col gap-5 max-h-[90svh] overflow-y-auto"
    >
      <div className="flex items-start justify-between gap-3 border-b border-borde-suave pb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-terra-boton bg-gradient-to-br from-oferta to-primario text-sobre-primario shadow-terra-flotante flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[0.65rem] font-extrabold uppercase tracking-[0.18em] text-primario block">
              Gobernanza y Perfiles
            </span>
            <h2
              id="rol-modal-title"
              className="text-base sm:text-lg font-extrabold text-texto-principal"
            >
              {editingRol ? 'Renombrar Rol' : 'Crear Nuevo Rol'}
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
            htmlFor="rol-nombre-input"
            className="text-xs font-extrabold uppercase tracking-wider text-texto-principal"
          >
            Nombre del Rol (máx. 50 caracteres)
          </label>
          <input
            id="rol-nombre-input"
            type="text"
            required
            maxLength={50}
            disabled={isPending}
            value={nombre}
            onChange={(e) => {
              setNombre(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            placeholder="Ej. supervisor de sucursal, editor general..."
            className="w-full min-h-[3rem] px-4 py-2.5 rounded-terra-campo bg-superficie-2 border-[1.5px] border-borde hover:border-borde-hover focus:border-primario focus:bg-superficie-1 focus:shadow-terra-anillo focus:outline-none text-sm font-medium text-texto-principal placeholder:text-texto-placeholder transition-all"
          />
        </div>

        {/* Selección opcional de permisos iniciales al crear un rol */}
        {!editingRol && allPermisos.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-texto-principal">
                Permisos Iniciales ({selectedPermisoIds.length})
              </span>
              <button
                type="button"
                onClick={() =>
                  setSelectedPermisoIds(
                    selectedPermisoIds.length === allPermisos.length
                      ? []
                      : allPermisos.map((p) => p.idPermiso),
                  )
                }
                className="text-xs font-bold text-primario hover:underline cursor-pointer"
              >
                {selectedPermisoIds.length === allPermisos.length
                  ? 'Desmarcar todos'
                  : 'Seleccionar todos'}
              </button>
            </div>

            <div className="max-h-44 overflow-y-auto rounded-terra-campo bg-superficie-2 border border-borde p-2.5 flex flex-wrap gap-1.5">
              {allPermisos.map((permiso) => {
                const isSelected = selectedPermisoIds.includes(permiso.idPermiso);
                return (
                  <button
                    key={permiso.idPermiso}
                    type="button"
                    onClick={() => togglePermisoId(permiso.idPermiso)}
                    className={`min-h-[2.75rem] px-3 py-1.5 rounded-full text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-primario text-sobre-primario shadow-terra-sm'
                        : 'bg-superficie-1 text-texto-suave border border-borde hover:border-primario'
                    }`}
                  >
                    <Check
                      className={`w-3.5 h-3.5 ${
                        isSelected ? 'opacity-100' : 'opacity-0 w-0'
                      }`}
                    />
                    <span>{permiso.nombre}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

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
            <span>{editingRol ? 'Guardar Nombre' : 'Crear Rol'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export function RolFormModal() {
  const isFormModalOpen = useRolesUiStore((state) => state.isFormModalOpen);
  const editingRol = useRolesUiStore((state) => state.editingRol);
  const closeFormModal = useRolesUiStore((state) => state.closeFormModal);

  if (!isFormModalOpen || typeof document === 'undefined') return null;

  const modalKey = editingRol?.idRol ?? 'create-rol';

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
        className="relative z-10 w-full max-w-[30rem]"
      >
        <RolFormDialogContent
          key={modalKey}
          editingRol={editingRol}
          onClose={closeFormModal}
        />
      </SlideFadeTransition>
    </div>,
    document.body,
  );
}
