import { useState, useMemo } from 'react';
import {
  Store,
  Plus,
  Pencil,
  Trash2,
  Search,
  AlertCircle,
  Loader2,
  MapPin,
  Building2,
} from 'lucide-react';
import { useThemeStore } from '../../../../core/store/use-theme-store';
import { useDepartamentosQuery } from '../../../departamentos/presentation/hooks/use-departamentos-query';
import type { Sucursal } from '../../domain/models/sucursal.model';
import { SucursalRules } from '../../domain/models/sucursal.model';
import { useDeleteSucursalMutation } from '../hooks/use-sucursal-mutations';
import { useSucursalesQuery } from '../hooks/use-sucursales-query';
import { useSucursalesUiStore } from '../store/use-sucursales-ui-store';
import { SucursalFormModal } from './sucursal-form-modal';

export function SucursalesTableCard() {
  const { data: sucursales = [], isLoading, error } = useSucursalesQuery();
  const { data: departamentos = [] } = useDepartamentosQuery();
  const deleteMutation = useDeleteSucursalMutation();

  const searchFilter = useSucursalesUiStore((state) => state.searchFilter);
  const setSearchFilter = useSucursalesUiStore((state) => state.setSearchFilter);
  const openCreateModal = useSucursalesUiStore((state) => state.openCreateModal);
  const openEditModal = useSucursalesUiStore((state) => state.openEditModal);

  const [deletingSucursal, setDeletingSucursal] = useState<Sucursal | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const highContrast = useThemeStore((state) => state.highContrast);

  // Mapear cantidad de departamentos asociados a cada sucursal
  const deptsCountBySucursal = useMemo(() => {
    const map = new Map<string, number>();
    departamentos.forEach((d) => {
      if (d.idSucursal) {
        map.set(d.idSucursal, (map.get(d.idSucursal) ?? 0) + 1);
      }
    });
    return map;
  }, [departamentos]);

  const filtered = useMemo(() => {
    const term = searchFilter.trim().toLowerCase();
    if (!term) return sucursales;
    return sucursales.filter(
      (s) =>
        s.nombre.toLowerCase().includes(term) ||
        s.direccion.toLowerCase().includes(term),
    );
  }, [sucursales, searchFilter]);

  const handleConfirmDelete = async () => {
    if (!deletingSucursal) return;
    setDeleteError(null);
    try {
      await deleteMutation.mutateAsync(deletingSucursal.idSucursal);
      setDeletingSucursal(null);
    } catch (err) {
      if (err instanceof Error) {
        setDeleteError(err.message);
      } else {
        setDeleteError('No fue posible eliminar la sucursal seleccionada.');
      }
    }
  };

  return (
    <>
      <div className="rounded-terra-modal bg-superficie-1 border-[1.5px] border-borde p-5 sm:p-6 shadow-terra flex flex-col gap-5 text-left">
        {/* Cabecera de la Tarjeta */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-borde-suave">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-terra bg-gradient-to-br from-oferta to-primario text-sobre-primario shadow-terra-flotante flex items-center justify-center shrink-0">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-primario block">
                  Infraestructura Física
                </span>
                <span className="px-2 py-0.5 rounded-full text-[0.65rem] font-extrabold bg-superficie-2 border border-borde text-texto-suave">
                  {filtered.length} {filtered.length === 1 ? 'sucursal' : 'sucursales'}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-texto-principal tracking-tight">
                Gestión de Sucursales
              </h2>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {/* Buscador táctil con tokens TERRA */}
            <div className="relative min-w-[14rem]">
              <Search className="w-4 h-4 text-texto-placeholder absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Buscar por nombre o dirección..."
                className="w-full min-h-[2.85rem] pl-9.5 pr-4 py-2 rounded-full bg-superficie-2 border border-borde focus:border-primario focus:bg-superficie-1 focus:shadow-terra-anillo focus:outline-none text-xs font-medium text-texto-principal placeholder:text-texto-placeholder transition-all"
              />
            </div>

            <button
              type="button"
              onClick={openCreateModal}
              className={`min-h-[2.85rem] px-4.5 py-2 rounded-full font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-terra-sm cursor-pointer ${
                highContrast
                  ? 'bg-primario text-sobre-primario border border-white'
                  : 'bg-primario hover:bg-primario-hover text-sobre-primario'
              }`}
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>Nueva Sucursal</span>
            </button>
          </div>
        </div>

        {/* Mensaje de confirmación de eliminación en línea */}
        {deletingSucursal && (
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
                  ¿Deseas eliminar la sucursal{' '}
                  <strong>
                    {SucursalRules.formatDisplayName(deletingSucursal.nombre)}
                  </strong>
                  ? Los departamentos asociados quedarán sin sucursal asignada.
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
                  setDeletingSucursal(null);
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
            <span>Consultando sucursales corporativas...</span>
          </div>
        ) : error ? (
          <div className="rounded-terra-campo bg-primario-claro border border-alerta p-4 text-xs font-bold text-alerta flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>
              {error instanceof Error
                ? error.message
                : 'No fue posible cargar las sucursales.'}
            </span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2 text-center text-texto-suave">
            <Store className="w-10 h-10 text-texto-placeholder opacity-60" />
            <p className="text-sm font-bold text-texto-principal">
              No se encontraron sucursales
            </p>
            <p className="text-xs text-texto-suave max-w-sm">
              {searchFilter
                ? 'No existen sucursales que coincidan con el término de búsqueda ingresado.'
                : 'Aún no se han registrado sucursales. Haz clic en "Nueva Sucursal" para agregar la primera.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-5 sm:-mx-6">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-y border-borde-suave bg-superficie-2/60">
                  <th
                    scope="col"
                    className="py-3 px-5 text-[0.65rem] font-extrabold uppercase tracking-[0.16em] text-texto-suave"
                  >
                    Sucursal
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-4 text-[0.65rem] font-extrabold uppercase tracking-[0.16em] text-texto-suave"
                  >
                    Dirección
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-4 text-[0.65rem] font-extrabold uppercase tracking-[0.16em] text-texto-suave"
                  >
                    Departamentos
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
                {filtered.map((sucursal) => {
                  const deptsCount = deptsCountBySucursal.get(sucursal.idSucursal) ?? 0;

                  return (
                    <tr
                      key={sucursal.idSucursal}
                      className="hover:bg-superficie-2/60 transition-colors"
                    >
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-terra-chico bg-primario-claro text-primario font-extrabold text-xs flex items-center justify-center shrink-0">
                            {sucursal.nombre.slice(0, 2).toUpperCase()}
                          </div>
                          <span className="text-sm font-extrabold text-texto-principal">
                            {SucursalRules.formatDisplayName(sucursal.nombre)}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-texto-suave">
                          <MapPin className="w-3.5 h-3.5 text-primario shrink-0" />
                          <span>{sucursal.direccion}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-superficie-2 border border-borde text-xs font-bold text-texto-principal">
                          <Building2 className="w-3.5 h-3.5 text-primario shrink-0" />
                          <span>
                            {deptsCount} {deptsCount === 1 ? 'departamento' : 'departamentos'}
                          </span>
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <code className="text-[0.7rem] text-texto-suave font-mono">
                          {sucursal.idSucursal.slice(0, 8)}...
                        </code>
                      </td>
                      <td className="py-3 px-5">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditModal(sucursal)}
                            aria-label={`Editar sucursal ${sucursal.nombre}`}
                            title="Editar datos de sucursal"
                            className="min-w-[2.75rem] min-h-[2.75rem] w-11 h-11 rounded-full hover:bg-superficie-2 text-texto-suave hover:text-primario flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDeleteError(null);
                              setDeletingSucursal(sucursal);
                            }}
                            aria-label={`Eliminar sucursal ${sucursal.nombre}`}
                            title="Eliminar sucursal"
                            className="min-w-[2.75rem] min-h-[2.75rem] w-11 h-11 rounded-full hover:bg-primario-claro text-texto-suave hover:text-alerta flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <SucursalFormModal />
    </>
  );
}

