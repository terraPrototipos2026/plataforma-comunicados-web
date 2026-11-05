import { useState, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { Store, X, AlertCircle, Loader2, Check, MapPin } from 'lucide-react';
import { SlideFadeTransition } from '../../../../shared/components/slide-fade-transition';
import type { Sucursal } from '../../domain/models/sucursal.model';
import {
  useCreateSucursalMutation,
  useUpdateSucursalMutation,
} from '../hooks/use-sucursal-mutations';
import { useSucursalesUiStore } from '../store/use-sucursales-ui-store';

function SucursalFormDialogContent({
  editingSucursal,
  onClose,
}: {
  editingSucursal: Sucursal | null;
  onClose: () => void;
}) {
  const [nombre, setNombre] = useState(
    editingSucursal ? editingSucursal.nombre : '',
  );
  const [direccion, setDireccion] = useState(
    editingSucursal ? editingSucursal.direccion : '',
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const createMutation = useCreateSucursalMutation();
  const updateMutation = useUpdateSucursalMutation();

  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    try {
      if (editingSucursal) {
        await updateMutation.mutateAsync({
          idSucursal: editingSucursal.idSucursal,
          nombre,
          direccion,
        });
      } else {
        await createMutation.mutateAsync({
          nombre,
          direccion,
        });
      }
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Ocurrió un error al guardar la sucursal.');
      }
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sucursal-modal-title"
      className="rounded-terra-modal bg-superficie-1 border-[1.5px] border-borde p-6 shadow-terra text-left flex flex-col gap-5"
    >
      {/* Cabecera del Modal */}
      <div className="flex items-start justify-between gap-3 border-b border-borde-suave pb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-terra-boton bg-gradient-to-br from-oferta to-primario text-sobre-primario shadow-terra-flotante flex items-center justify-center shrink-0">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[0.65rem] font-extrabold uppercase tracking-[0.18em] text-primario block">
              Sedes Corporativas
            </span>
            <h2
              id="sucursal-modal-title"
              className="text-base sm:text-lg font-extrabold text-texto-principal"
            >
              {editingSucursal ? 'Editar Sucursal' : 'Nueva Sucursal'}
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
            htmlFor="sucursal-nombre-input"
            className="text-xs font-extrabold uppercase tracking-wider text-texto-principal"
          >
            Nombre de la Sucursal *
          </label>
          <input
            id="sucursal-nombre-input"
            type="text"
            required
            maxLength={100}
            disabled={isPending}
            value={nombre}
            onChange={(e) => {
              setNombre(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            placeholder="Ej. Sucursal Central, Planta Industrial..."
            className="w-full min-h-[3rem] px-4 py-2.5 rounded-terra-campo bg-superficie-2 border-[1.5px] border-borde hover:border-borde-hover focus:border-primario focus:bg-superficie-1 focus:shadow-terra-anillo focus:outline-none text-sm font-medium text-texto-principal placeholder:text-texto-placeholder transition-all"
          />
          <span className="text-[0.68rem] text-texto-suave">
            Identificador visible de la sede física (máx. 100 caracteres).
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="sucursal-direccion-input"
            className="text-xs font-extrabold uppercase tracking-wider text-texto-principal flex items-center gap-1.5"
          >
            <MapPin className="w-3.5 h-3.5 text-primario" />
            <span>Dirección / Ubicación *</span>
          </label>
          <input
            id="sucursal-direccion-input"
            type="text"
            required
            maxLength={255}
            disabled={isPending}
            value={direccion}
            onChange={(e) => {
              setDireccion(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            placeholder="Ej. Av. Cristo Redentor #450, Santa Cruz..."
            className="w-full min-h-[3rem] px-4 py-2.5 rounded-terra-campo bg-superficie-2 border-[1.5px] border-borde hover:border-borde-hover focus:border-primario focus:bg-superficie-1 focus:shadow-terra-anillo focus:outline-none text-sm font-medium text-texto-principal placeholder:text-texto-placeholder transition-all"
          />
          <span className="text-[0.68rem] text-texto-suave">
            Dirección geográfica completa (máx. 255 caracteres).
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
            <span>
              {editingSucursal ? 'Guardar Cambios' : 'Crear Sucursal'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}

export function SucursalFormModal() {
  const isFormModalOpen = useSucursalesUiStore((state) => state.isFormModalOpen);
  const editingSucursal = useSucursalesUiStore((state) => state.editingSucursal);
  const closeFormModal = useSucursalesUiStore((state) => state.closeFormModal);

  if (!isFormModalOpen || typeof document === 'undefined') return null;

  const modalKey = editingSucursal?.idSucursal ?? 'create-sucursal';

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
        className="relative z-10 w-full max-w-[28rem]"
      >
        <SucursalFormDialogContent
          key={modalKey}
          editingSucursal={editingSucursal}
          onClose={closeFormModal}
        />
      </SlideFadeTransition>
    </div>,
    document.body,
  );
}
