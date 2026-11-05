import { useState, useMemo } from 'react';
import {
  Building2,
  Plus,
  Pencil,
  Trash2,
  Search,
  AlertCircle,
  Loader2,
  Store,
} from 'lucide-react';
import { useThemeStore } from '../../../../core/store/use-theme-store';
import { useSucursalesQuery } from '../../../sucursales/presentation/hooks/use-sucursales-query';
import { DepartamentoRules } from '../../domain/models/departamento.model';
import { useDeleteDepartamentoMutation } from '../hooks/use-departamento-mutations';
import { useDepartamentosQuery } from '../hooks/use-departamentos-query';
import { useDepartamentosUiStore } from '../store/use-departamentos-ui-store';
import { DepartamentoFormModal } from './departamento-form-modal';

export function DepartamentosTableCard() {
  const { data: departamentos = [], isLoading, error } = useDepartamentosQuery();
  const { data: sucursales = [] } = useSucursalesQuery();
  const deleteMutation = useDeleteDepartamentoMutation();

  const sucursalMap = useMemo(() => {
    const map = new Map<string, string>();
    sucursales.forEach((s) => map.set(s.idSucursal, s.nombre));
    return map;
  }, [sucursales]);

  const searchTerm = useDepartamentosUiStore((state) => state.searchTerm);
  const setSearchTerm = useDepartamentosUiStore((state) => state.setSearchTerm);
  const openCreateModal = useDepartamentosUiStore((state) => state.openCreateModal);
  const openEditModal = useDepartamentosUiStore((state) => state.openEditModal);
  const deletingDepartamento = useDepartamentosUiStore(
    (state) => state.deletingDepartamento,
  );
  const openDeleteConfirm = useDepartamentosUiStore(
    (state) => state.openDeleteConfirm,
  );
  const closeDeleteConfirm = useDepartamentosUiStore(
    (state) => state.closeDeleteConfirm,
  );

  const [deleteError, setDeleteError] = useState<string | null>(null);
  const highContrast = useThemeStore((state) => state.highContrast);

  const filtered = departamentos.filter((dept) =>
    dept.nombre.toLowerCase().includes(searchTerm.trim().toLowerCase()),
  );

  const handleConfirmDelete = async () => {
    if (!deletingDepartamento) return;
    setDeleteError(null);
    try {
      await deleteMutation.mutateAsync(deletingDepartamento.idDepartamento);
      closeDeleteConfirm();
    } catch (err) {
      if (err instanceof Error) {
        setDeleteError(err.message);
      } else {
        setDeleteError('No fue posible eliminar el departamento.');
      }
    }
  };

  return (
    <>
      <article
        aria-labelledby="departamentos-heading"
        className="rounded-terra-tarjeta bg-superficie-1 border-[1.5px] border-borde p-5 pt-0 shadow-terra-card flex flex-col gap-5 text-left mt-6"
      >
        {/* Cabecera Flotante estilo Material Dashboard 2 + TERRA */}
        <div
          className={`-mt-6 rounded-terra p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            highContrast
              ? 'bg-superficie-2 text-texto-principal border-2 border-white'
              : 'bg-gradient-to-r from-[#352c2a] to-[#1e1917] text-[#f4ede8] shadow-[0_12px_26px_-6px_rgba(30,25,23,0.48)]'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-terra-boton bg-white/14 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[0.65rem] font-extrabold uppercase tracking-[0.18em] opacity-80 block">
                Catálogo Corporativo
              </span>
              <h2
                id="departamentos-heading"
                className="text-base sm:text-lg font-extrabold tracking-tight"
              >
                Departamentos ({departamentos.length})
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="min-h-[2.75rem] px-4 py-2 rounded-full bg-primario hover:bg-primario-hover text-sobre-primario shadow-terra-flotante text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Departamento</span>
          </button>
        </div>

        {/* Barra de filtro interna */}
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
              placeholder="Filtrar departamentos..."
              aria-label="Filtrar departamentos por nombre"
              className="w-full min-h-[2.75rem] pl-9 pr-4 py-2 rounded-terra-campo bg-superficie-2 border border-borde focus:border-primario focus:bg-superficie-1 focus:outline-none text-xs font-medium text-texto-principal placeholder:text-texto-placeholder"
            />
          </div>

          <span className="text-xs font-semibold text-texto-suave">
            Mostrando <strong className="text-texto-principal">{filtered.length}</strong>{' '}
            registros
          </span>
        </div>

        {/* Confirmación de eliminación en línea si hay un departamento seleccionado */}
        {deletingDepartamento && (
          <div
            role="alert"
            className="rounded-terra-campo border-[1.5px] border-alerta bg-primario-claro p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-alerta shrink-0 mt-0.5" />
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-extrabold uppercase tracking-wider text-alerta">
                  Confirmar eliminación
                </span>
                <p className="text-xs sm:text-sm font-semibold text-texto-principal">
                  ¿Deseas eliminar el departamento{' '}
                  <strong>
                    {DepartamentoRules.formatDisplayName(deletingDepartamento.nombre)}
                  </strong>
                  ?
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

        {/* Estado de carga / error / tabla */}
        {isLoading ? (
          <div className="py-10 flex items-center justify-center gap-2 text-xs font-bold text-texto-suave">
            <Loader2 className="w-4 h-4 animate-spin text-primario" />
            <span>Consultando departamentos en el servidor...</span>
          </div>
        ) : error ? (
          <div className="rounded-terra-campo bg-primario-claro border border-alerta p-4 text-xs font-bold text-alerta flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>
              {error instanceof Error
                ? error.message
                : 'No fue posible cargar los departamentos.'}
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
                    Departamento
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
                    Sucursal Asignada
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
                {filtered.map((dept) => (
                  <tr
                    key={dept.idDepartamento}
                    className="hover:bg-superficie-2/60 transition-colors"
                  >
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-terra-chico bg-primario-claro text-primario font-extrabold text-xs flex items-center justify-center shrink-0">
                          {dept.nombre.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="text-sm font-extrabold text-texto-principal">
                          {DepartamentoRules.formatDisplayName(dept.nombre)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-full bg-superficie-2 border border-borde text-xs font-bold text-texto-suave">
                        {dept.nombre}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {dept.idSucursal && sucursalMap.has(dept.idSucursal) ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-superficie-crema border border-borde text-xs font-bold text-primario">
                          <Store className="w-3.5 h-3.5 text-primario shrink-0" />
                          <span>{sucursalMap.get(dept.idSucursal)}</span>
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-texto-placeholder italic">
                          Sin sucursal asignada
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <code className="text-[0.7rem] text-texto-suave font-mono">
                        {dept.idDepartamento.slice(0, 8)}...
                      </code>
                    </td>
                    <td className="py-3 px-5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(dept)}
                          aria-label={`Editar departamento ${dept.nombre}`}
                          title="Renombrar departamento"
                          className="min-w-[2.75rem] min-h-[2.75rem] w-11 h-11 rounded-full hover:bg-superficie-2 text-texto-suave hover:text-primario flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteError(null);
                            openDeleteConfirm(dept);
                          }}
                          aria-label={`Eliminar departamento ${dept.nombre}`}
                          title="Eliminar departamento"
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

      <DepartamentoFormModal />
    </>
  );
}

