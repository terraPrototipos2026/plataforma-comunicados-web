import { useState } from 'react';
import {
  Users,
  UserPlus,
  Pencil,
  Trash2,
  Search,
  AlertCircle,
  Loader2,
  Mail,
  Phone,
  Shield,
  Building2,
} from 'lucide-react';
import { useThemeStore } from '../../../../core/store/use-theme-store';
import { UsuarioRules } from '../../domain/models/usuario.model';
import { useRolesQuery } from '../../../roles/presentation/hooks/use-roles-query';
import { useDepartamentosQuery } from '../../../departamentos/presentation/hooks/use-departamentos-query';
import { useUsuariosQuery } from '../hooks/use-usuarios-query';
import { useDeleteUsuarioMutation } from '../hooks/use-usuario-mutations';
import { useUsuariosUiStore } from '../store/use-usuarios-ui-store';
import { UsuarioEditModal } from './usuario-edit-modal';

interface UsuariosTableCardProps {
  onGoToRegister?: () => void;
}

export function UsuariosTableCard({ onGoToRegister }: UsuariosTableCardProps) {
  const { data: usuarios = [], isLoading, error } = useUsuariosQuery();
  const { data: roles = [] } = useRolesQuery();
  const { data: departamentos = [] } = useDepartamentosQuery();
  const deleteMutation = useDeleteUsuarioMutation();

  const searchTerm = useUsuariosUiStore((state) => state.searchTerm);
  const setSearchTerm = useUsuariosUiStore((state) => state.setSearchTerm);
  const selectedRolFilter = useUsuariosUiStore((state) => state.selectedRolFilter);
  const setSelectedRolFilter = useUsuariosUiStore((state) => state.setSelectedRolFilter);
  const selectedDeptFilter = useUsuariosUiStore((state) => state.selectedDeptFilter);
  const setSelectedDeptFilter = useUsuariosUiStore((state) => state.setSelectedDeptFilter);
  const openEditModal = useUsuariosUiStore((state) => state.openEditModal);
  const deletingUsuario = useUsuariosUiStore((state) => state.deletingUsuario);
  const openDeleteConfirm = useUsuariosUiStore((state) => state.openDeleteConfirm);
  const closeDeleteConfirm = useUsuariosUiStore((state) => state.closeDeleteConfirm);

  const [deleteError, setDeleteError] = useState<string | null>(null);
  const highContrast = useThemeStore((state) => state.highContrast);

  const filteredUsuarios = usuarios.filter((user) => {
    const matchesSearch =
      user.nombre.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
      user.correo.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
      (user.telefono && user.telefono.toLowerCase().includes(searchTerm.trim().toLowerCase()));

    const matchesRol =
      selectedRolFilter === 'all' ||
      user.rol.toLowerCase() === selectedRolFilter.toLowerCase();

    const matchesDept =
      selectedDeptFilter === 'all' ||
      user.departamento.toLowerCase() === selectedDeptFilter.toLowerCase();

    return matchesSearch && matchesRol && matchesDept;
  });

  const handleConfirmDelete = async () => {
    if (!deletingUsuario) return;
    setDeleteError(null);
    try {
      await deleteMutation.mutateAsync(deletingUsuario.idUsuario);
      closeDeleteConfirm();
    } catch (err) {
      if (err instanceof Error) {
        setDeleteError(err.message);
      } else {
        setDeleteError('No fue posible eliminar el usuario.');
      }
    }
  };

  return (
    <>
      <article
        aria-labelledby="usuarios-heading"
        className="rounded-terra-tarjeta bg-superficie-1 border-[1.5px] border-borde p-5 pt-0 shadow-terra-card flex flex-col gap-5 text-left mt-6"
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
            <div className="w-11 h-11 rounded-terra-boton bg-white/14 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[0.65rem] font-extrabold uppercase tracking-[0.18em] opacity-80 block">
                Directorio Corporativo
              </span>
              <h2 id="usuarios-heading" className="text-base sm:text-lg font-extrabold tracking-tight">
                Listado de Usuarios ({usuarios.length})
              </h2>
            </div>
          </div>

          {onGoToRegister && (
            <button
              type="button"
              onClick={onGoToRegister}
              className="min-h-[2.75rem] px-4 py-2 rounded-full bg-primario hover:bg-primario-hover text-sobre-primario shadow-terra-flotante text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              <span>Registrar Usuario</span>
            </button>
          )}
        </div>

        {/* Barra de Filtros y Búsqueda */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <div className="sm:col-span-5 relative flex items-center">
            <Search
              aria-hidden="true"
              className="w-4 h-4 text-texto-suave absolute left-3.5 pointer-events-none"
            />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre, correo..."
              aria-label="Buscar usuarios"
              className="w-full min-h-[2.75rem] pl-9 pr-4 py-2 rounded-terra-campo bg-superficie-2 border border-borde focus:border-primario focus:bg-superficie-1 focus:outline-none text-xs font-medium text-texto-principal placeholder:text-texto-placeholder"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedRolFilter}
              onChange={(e) => setSelectedRolFilter(e.target.value)}
              aria-label="Filtrar por rol"
              className="w-full min-h-[2.75rem] px-3.5 py-2 rounded-terra-campo bg-superficie-2 border border-borde focus:border-primario focus:bg-superficie-1 focus:outline-none text-xs font-medium text-texto-principal capitalize"
            >
              <option value="all">Todos los Roles</option>
              {roles.map((r) => (
                <option key={r.idRol} value={r.nombre}>
                  {r.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-4">
            <select
              value={selectedDeptFilter}
              onChange={(e) => setSelectedDeptFilter(e.target.value)}
              aria-label="Filtrar por departamento"
              className="w-full min-h-[2.75rem] px-3.5 py-2 rounded-terra-campo bg-superficie-2 border border-borde focus:border-primario focus:bg-superficie-1 focus:outline-none text-xs font-medium text-texto-principal capitalize"
            >
              <option value="all">Todos los Departamentos</option>
              {departamentos.map((d) => (
                <option key={d.idDepartamento} value={d.nombre}>
                  {d.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Alerta de confirmación de eliminación en línea */}
        {deletingUsuario && (
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
                  ¿Deseas dar de baja la cuenta de{' '}
                  <strong>{deletingUsuario.nombre}</strong> ({deletingUsuario.correo})?
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

        {/* Tabla de Resultados */}
        {isLoading ? (
          <div className="py-12 flex items-center justify-center gap-2 text-xs font-bold text-texto-suave">
            <Loader2 className="w-4 h-4 animate-spin text-primario" />
            <span>Consultando usuarios del sistema...</span>
          </div>
        ) : error ? (
          <div className="rounded-terra-campo bg-primario-claro border border-alerta p-4 text-xs font-bold text-alerta flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>
              {error instanceof Error ? error.message : 'No fue posible cargar los usuarios.'}
            </span>
          </div>
        ) : filteredUsuarios.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2 text-center text-texto-suave">
            <Users className="w-8 h-8 opacity-40 text-primario" />
            <p className="text-sm font-bold text-texto-principal">No se encontraron usuarios</p>
            <p className="text-xs">
              Intenta modificar los filtros de búsqueda o registra un nuevo usuario en la pestaña adyacente.
            </p>
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
                    Usuario
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-4 text-[0.65rem] font-extrabold uppercase tracking-[0.16em] text-texto-suave"
                  >
                    Rol Asignado
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-4 text-[0.65rem] font-extrabold uppercase tracking-[0.16em] text-texto-suave"
                  >
                    Departamento
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-4 text-[0.65rem] font-extrabold uppercase tracking-[0.16em] text-texto-suave"
                  >
                    Contacto
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
                {filteredUsuarios.map((u) => (
                  <tr key={u.idUsuario} className="hover:bg-superficie-2/60 transition-colors">
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primario to-primario-hover text-sobre-primario font-extrabold text-xs flex items-center justify-center shrink-0 shadow-terra-sm">
                          {UsuarioRules.getIniciales(u.nombre)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-extrabold text-texto-principal">
                            {u.nombre}
                          </span>
                          <span className="text-xs text-texto-suave flex items-center gap-1">
                            <Mail className="w-3 h-3 text-texto-placeholder shrink-0" />
                            {u.correo}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primario-claro text-primario text-xs font-bold capitalize">
                        <Shield className="w-3 h-3" />
                        {u.rol}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-superficie-2 border border-borde text-xs font-semibold text-texto-principal capitalize">
                        <Building2 className="w-3 h-3 text-texto-suave" />
                        {u.departamento}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {u.telefono ? (
                        <span className="text-xs font-medium text-texto-suave flex items-center gap-1">
                          <Phone className="w-3 h-3 text-texto-placeholder" />
                          {u.telefono}
                        </span>
                      ) : (
                        <span className="text-xs text-texto-placeholder italic">Sin teléfono</span>
                      )}
                    </td>
                    <td className="py-3 px-5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(u)}
                          aria-label={`Editar usuario ${u.nombre}`}
                          title="Editar usuario"
                          className="min-w-[2.75rem] min-h-[2.75rem] w-11 h-11 rounded-full hover:bg-superficie-2 text-texto-suave hover:text-primario flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteError(null);
                            openDeleteConfirm(u);
                          }}
                          aria-label={`Eliminar usuario ${u.nombre}`}
                          title="Eliminar usuario"
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

      <UsuarioEditModal />
    </>
  );
}

