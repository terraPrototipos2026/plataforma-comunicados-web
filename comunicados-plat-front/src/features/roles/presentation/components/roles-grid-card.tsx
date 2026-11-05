import { useState } from 'react';
import {
  Shield,
  Plus,
  Pencil,
  Trash2,
  KeyRound,
  Search,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useThemeStore } from '../../../../core/store/use-theme-store';
import { RolRules } from '../../domain/models/rol.model';
import { useDeleteRolMutation } from '../hooks/use-rol-mutations';
import { useRolesQuery } from '../hooks/use-roles-query';
import { useRolesUiStore } from '../store/use-roles-ui-store';
import { RolFormModal } from './rol-form-modal';
import { RolPermissionsDrawer } from './rol-permissions-drawer';

export function RolesGridCard() {
  const { data: roles = [], isLoading, error } = useRolesQuery();
  const deleteMutation = useDeleteRolMutation();

  const searchTerm = useRolesUiStore((state) => state.searchTerm);
  const setSearchTerm = useRolesUiStore((state) => state.setSearchTerm);
  const openCreateModal = useRolesUiStore((state) => state.openCreateModal);
  const openEditModal = useRolesUiStore((state) => state.openEditModal);
  const deletingRol = useRolesUiStore((state) => state.deletingRol);
  const openDeleteConfirm = useRolesUiStore((state) => state.openDeleteConfirm);
  const closeDeleteConfirm = useRolesUiStore((state) => state.closeDeleteConfirm);
  const openPermissionsDrawer = useRolesUiStore(
    (state) => state.openPermissionsDrawer,
  );

  const [deleteError, setDeleteError] = useState<string | null>(null);
  const highContrast = useThemeStore((state) => state.highContrast);

  const filtered = roles.filter((r) => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return true;
    const matchesName = r.nombre.toLowerCase().includes(query);
    const matchesPermiso = r.permisos.some((p) =>
      p.nombre.toLowerCase().includes(query),
    );
    return matchesName || matchesPermiso;
  });

  const handleConfirmDelete = async () => {
    if (!deletingRol) return;
    setDeleteError(null);
    try {
      await deleteMutation.mutateAsync(deletingRol.idRol);
      closeDeleteConfirm();
    } catch (err) {
      if (err instanceof Error) {
        setDeleteError(err.message);
      } else {
        setDeleteError('No fue posible eliminar el rol.');
      }
    }
  };

  const getInitials = (nombre: string): string => {
    const words = nombre.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return nombre.slice(0, 2).toUpperCase();
  };

  return (
    <>
      <article
        aria-labelledby="roles-heading"
        className="rounded-terra-tarjeta bg-superficie-1 border-[1.5px] border-borde p-5 pt-0 shadow-terra-card flex flex-col gap-5 text-left mt-6"
      >
        {/* Cabecera Flotante estilo Material Dashboard 2 + TERRA (Vino Institucional) */}
        <div
          className={`-mt-6 rounded-terra p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            highContrast
              ? 'bg-superficie-2 text-texto-principal border-2 border-white'
              : 'bg-gradient-to-r from-oferta to-primario text-sobre-primario shadow-terra-flotante'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-terra-boton bg-white/18 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[0.65rem] font-extrabold uppercase tracking-[0.18em] opacity-85 block">
                Matriz RBAC Corporativa
              </span>
              <h2
                id="roles-heading"
                className="text-base sm:text-lg font-extrabold tracking-tight"
              >
                Roles y Asignación ({roles.length})
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="min-h-[2.75rem] px-4 py-2 rounded-full bg-superficie-1 text-texto-principal hover:bg-superficie-2 font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 text-primario" />
            <span>Nuevo Rol</span>
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
              placeholder="Filtrar roles..."
              aria-label="Filtrar roles por nombre"
              className="w-full min-h-[2.75rem] pl-9 pr-4 py-2 rounded-terra-campo bg-superficie-2 border border-borde focus:border-primario focus:bg-superficie-1 focus:outline-none text-xs font-medium text-texto-principal placeholder:text-texto-placeholder"
            />
          </div>

          <span className="text-xs font-semibold text-texto-suave">
            Mostrando <strong className="text-texto-principal">{filtered.length}</strong>{' '}
            registros
          </span>
        </div>

        {/* Confirmación de eliminación */}
        {deletingRol && (
          <div
            role="alert"
            className="rounded-terra-campo border-[1.5px] border-alerta bg-primario-claro p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-alerta shrink-0 mt-0.5" />
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-extrabold uppercase tracking-wider text-alerta">
                  Confirmar eliminación de rol
                </span>
                <p className="text-xs sm:text-sm font-semibold text-texto-principal">
                  ¿Deseas eliminar el rol{' '}
                  <strong>{RolRules.formatDisplayName(deletingRol.nombre)}</strong>? Solo
                  se eliminará si no tiene colaboradores asignados.
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
                <span>Eliminar Rol</span>
              </button>
            </div>
          </div>
        )}

        {/* Estado de carga / error / tabla idéntica a Departamentos */}
        {isLoading ? (
          <div className="py-10 flex items-center justify-center gap-2 text-xs font-bold text-texto-suave">
            <Loader2 className="w-4 h-4 animate-spin text-primario" />
            <span>Consultando roles en el servidor...</span>
          </div>
        ) : error ? (
          <div className="rounded-terra-campo bg-primario-claro border border-alerta p-4 text-xs font-bold text-alerta flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>
              {error instanceof Error ? error.message : 'No fue posible cargar los roles.'}
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
                    Rol
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-4 text-[0.65rem] font-extrabold uppercase tracking-[0.16em] text-texto-suave"
                  >
                    Código Normalizado
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-4 text-[0.65rem] font-extrabold uppercase tracking-[0.16em] text-texto-suave"
                  >
                    Permisos Asignados
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
                {filtered.map((rol) => (
                  <tr
                    key={rol.idRol}
                    className="hover:bg-superficie-2/60 transition-colors"
                  >
                    {/* Columna Rol con Avatar */}
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-terra-chico bg-primario-claro text-primario font-extrabold text-xs flex items-center justify-center shrink-0">
                          {getInitials(rol.nombre)}
                        </div>
                        <span className="text-sm font-extrabold text-texto-principal">
                          {RolRules.formatDisplayName(rol.nombre)}
                        </span>
                      </div>
                    </td>

                    {/* Columna Código Normalizado */}
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-full bg-superficie-2 border border-borde text-xs font-bold text-texto-suave">
                        {rol.nombre}
                      </span>
                    </td>

                    {/* Columna Permisos Asignados (con acción directa para abrir drawer) */}
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => openPermissionsDrawer(rol)}
                        title="Gestionar permisos de este rol"
                        className="px-2.5 py-1 rounded-full bg-superficie-2 hover:bg-primario-claro border border-borde hover:border-primario text-texto-suave hover:text-primario text-xs font-extrabold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <KeyRound className="w-3.5 h-3.5 text-primario" />
                        <span>{rol.permisos.length} permisos</span>
                      </button>
                    </td>

                    {/* Columna UUID */}
                    <td className="py-3 px-4">
                      <code className="text-[0.7rem] text-texto-suave font-mono">
                        {rol.idRol.slice(0, 8)}...
                      </code>
                    </td>

                    {/* Columna Acciones */}
                    <td className="py-3 px-5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openPermissionsDrawer(rol)}
                          aria-label={`Gestionar permisos del rol ${rol.nombre}`}
                          title="Gestionar permisos"
                          className="min-w-[2.75rem] min-h-[2.75rem] w-11 h-11 rounded-full hover:bg-superficie-2 text-texto-suave hover:text-primario flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <KeyRound className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditModal(rol)}
                          aria-label={`Editar rol ${rol.nombre}`}
                          title="Renombrar rol"
                          className="min-w-[2.75rem] min-h-[2.75rem] w-11 h-11 rounded-full hover:bg-superficie-2 text-texto-suave hover:text-primario flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteError(null);
                            openDeleteConfirm(rol);
                          }}
                          aria-label={`Eliminar rol ${rol.nombre}`}
                          title="Eliminar rol"
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

      <RolFormModal />
      <RolPermissionsDrawer />
    </>
  );
}
