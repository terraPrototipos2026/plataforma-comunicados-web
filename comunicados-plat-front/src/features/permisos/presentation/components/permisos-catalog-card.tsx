import { useState } from 'react';
import {
  KeyRound,
  Plus,
  Pencil,
  Trash2,
  Search,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useThemeStore } from '../../../../core/store/use-theme-store';
import { useDeletePermisoMutation } from '../hooks/use-permiso-mutations';
import { usePermisosQuery } from '../hooks/use-permisos-query';
import { usePermisosUiStore } from '../store/use-permisos-ui-store';
import { PermisoFormModal } from './permiso-form-modal';

export function PermisosCatalogCard() {
  const { data: permisos = [], isLoading, error } = usePermisosQuery();
  const deleteMutation = useDeletePermisoMutation();

  const searchTerm = usePermisosUiStore((state) => state.searchTerm);
  const setSearchTerm = usePermisosUiStore((state) => state.setSearchTerm);
  const openCreateModal = usePermisosUiStore((state) => state.openCreateModal);
  const openEditModal = usePermisosUiStore((state) => state.openEditModal);
  const deletingPermiso = usePermisosUiStore((state) => state.deletingPermiso);
  const openDeleteConfirm = usePermisosUiStore((state) => state.openDeleteConfirm);
  const closeDeleteConfirm = usePermisosUiStore((state) => state.closeDeleteConfirm);

  const [deleteError, setDeleteError] = useState<string | null>(null);
  const highContrast = useThemeStore((state) => state.highContrast);

  const filtered = permisos.filter((p) =>
    p.nombre.toLowerCase().includes(searchTerm.trim().toLowerCase()),
  );

  const handleConfirmDelete = async () => {
    if (!deletingPermiso) return;
    setDeleteError(null);
    try {
      await deleteMutation.mutateAsync(deletingPermiso.idPermiso);
      closeDeleteConfirm();
    } catch (err) {
      if (err instanceof Error) {
        setDeleteError(err.message);
      } else {
        setDeleteError('No fue posible eliminar el permiso.');
      }
    }
  };

  return (
    <>
      <article
        aria-labelledby="permisos-heading"
        className="rounded-terra-tarjeta bg-superficie-1 border-[1.5px] border-borde p-5 pt-0 shadow-terra-card flex flex-col gap-5 text-left mt-6"
      >
        {/* Cabecera Flotante estilo Material Dashboard 2 (Green Emerald) */}
        <div
          className={`-mt-6 rounded-terra p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            highContrast
              ? 'bg-superficie-2 text-texto-principal border-2 border-white'
              : 'bg-gradient-to-r from-[#28a45a] to-[#1e7e46] text-white shadow-[0_12px_26px_-6px_rgba(30,126,70,0.45)]'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-terra-boton bg-white/18 flex items-center justify-center shrink-0">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[0.65rem] font-extrabold uppercase tracking-[0.18em] opacity-85 block">
                Control de Acceso Granular
              </span>
              <h2
                id="permisos-heading"
                className="text-base sm:text-lg font-extrabold tracking-tight"
              >
                Catálogo de Permisos ({permisos.length})
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="min-h-[2.75rem] px-4 py-2 rounded-full bg-superficie-1 text-texto-principal hover:bg-superficie-2 font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 text-primario" />
            <span>Nuevo Permiso</span>
          </button>
        </div>

        {/* Buscador local */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-xs flex items-center">
            <Search
              aria-hidden="true"
              className="w-4 h-4 text-texto-suave absolute left-3.5 pointer-events-none"
            />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filtrar permisos por nombre..."
              aria-label="Filtrar permisos por nombre"
              className="w-full min-h-[2.75rem] pl-9 pr-4 py-2 rounded-terra-campo bg-superficie-2 border border-borde focus:border-primario focus:bg-superficie-1 focus:outline-none text-xs font-medium text-texto-principal placeholder:text-texto-placeholder"
            />
          </div>

          <span className="text-xs font-semibold text-texto-suave">
            Mostrando <strong className="text-texto-principal">{filtered.length}</strong>{' '}
            permisos
          </span>
        </div>

        {/* Confirmación de eliminación */}
        {deletingPermiso && (
          <div
            role="alert"
            className="rounded-terra-campo border-[1.5px] border-alerta bg-primario-claro p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-alerta shrink-0 mt-0.5" />
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-extrabold uppercase tracking-wider text-alerta">
                  Confirmar eliminación en cascada
                </span>
                <p className="text-xs sm:text-sm font-semibold text-texto-principal">
                  ¿Eliminar el permiso <code>{deletingPermiso.nombre}</code>? Se desvinculará automáticamente de todos los roles que lo posean.
                </p>
                {deleteError && (
                  <p className="text-xs font-bold text-alerta mt-1">{deleteError}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setDeleteError(null);
                  closeDeleteConfirm();
                }}
                className="min-h-[2.75rem] px-3.5 py-1.5 rounded-full bg-superficie-1 border border-borde text-xs font-bold text-texto-principal cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={deleteMutation.isPending}
                onClick={handleConfirmDelete}
                className="min-h-[2.75rem] px-4 py-1.5 rounded-full bg-alerta text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                {deleteMutation.isPending && (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                )}
                <span>Eliminar</span>
              </button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="py-10 flex items-center justify-center gap-2 text-xs font-bold text-texto-suave">
            <Loader2 className="w-4 h-4 animate-spin text-primario" />
            <span>Cargando catálogo de permisos...</span>
          </div>
        ) : error ? (
          <div className="rounded-terra-campo bg-primario-claro border border-alerta p-4 text-xs font-bold text-alerta flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>
              {error instanceof Error
                ? error.message
                : 'No fue posible cargar el catálogo de permisos.'}
            </span>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-5">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-y border-borde-suave bg-superficie-2/60">
                  <th
                    scope="col"
                    className="py-3 px-5 text-[0.65rem] font-extrabold uppercase tracking-[0.16em] text-texto-suave"
                  >
                    Nombre del Permiso
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-4 text-[0.65rem] font-extrabold uppercase tracking-[0.16em] text-texto-suave"
                  >
                    UUID
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-5 text-right text-[0.65rem] font-extrabold uppercase tracking-[0.16em] text-texto-suave"
                  >
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borde-suave">
                {filtered.map((permiso) => (
                  <tr
                    key={permiso.idPermiso}
                    className="hover:bg-superficie-2/60 transition-colors"
                  >
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-terra-chico bg-[#e4f4e9] text-[#1e7e46] flex items-center justify-center shrink-0">
                          <KeyRound className="w-4 h-4" />
                        </div>
                        <code className="text-xs sm:text-sm font-extrabold text-texto-principal">
                          {permiso.nombre}
                        </code>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <code className="text-[0.7rem] text-texto-suave font-mono">
                        {permiso.idPermiso.slice(0, 8)}...
                      </code>
                    </td>
                    <td className="py-3 px-5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(permiso)}
                          aria-label={`Editar permiso ${permiso.nombre}`}
                          title="Editar permiso"
                          className="min-w-[2.75rem] min-h-[2.75rem] w-11 h-11 rounded-full hover:bg-superficie-2 text-texto-suave hover:text-primario flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteError(null);
                            openDeleteConfirm(permiso);
                          }}
                          aria-label={`Eliminar permiso ${permiso.nombre}`}
                          title="Eliminar permiso"
                          className="min-w-[2.75rem] min-h-[2.75rem] w-11 h-11 rounded-full hover:bg-primario-claro text-texto-suave hover:text-alerta flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>

      <PermisoFormModal />
    </>
  );
}
