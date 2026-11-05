import { useState } from 'react';
import { X, Loader2, AlertCircle, UserCheck } from 'lucide-react';
import { useDepartamentosQuery } from '../../../departamentos/presentation/hooks/use-departamentos-query';
import { useUpdateUsuarioMutation } from '../hooks/use-usuario-mutations';
import { useUsuariosUiStore } from '../store/use-usuarios-ui-store';
import type { Usuario } from '../../domain/models/usuario.model';

interface UsuarioEditFormContentProps {
  usuario: Usuario;
  onClose: () => void;
}

function UsuarioEditFormContent({ usuario, onClose }: UsuarioEditFormContentProps) {
  const { data: departamentos = [] } = useDepartamentosQuery();
  const updateMutation = useUpdateUsuarioMutation();

  const [nombre, setNombre] = useState(usuario.nombre);
  const [correo, setCorreo] = useState(usuario.correo);
  const [telefono, setTelefono] = useState(usuario.telefono || '');
  const [rol] = useState(usuario.rol);
  const [departamento, setDepartamento] = useState(usuario.departamento);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      await updateMutation.mutateAsync({
        idUsuario: usuario.idUsuario,
        nombre,
        correo,
        telefono: telefono.trim() ? telefono : undefined,
        rol,
        departamento,
      });
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('No fue posible actualizar la información del usuario.');
      }
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-usuario-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
    >
      <div className="w-full max-w-lg rounded-terra-modal bg-superficie-1 border-[1.5px] border-borde p-6 shadow-terra flex flex-col gap-5 text-left">
        {/* Cabecera del Modal */}
        <div className="flex items-center justify-between pb-3 border-b border-borde-suave">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-terra-boton bg-primario-claro text-primario flex items-center justify-center shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 id="edit-usuario-title" className="text-base font-extrabold text-texto-principal">
                Editar Datos de Usuario
              </h2>
              <span className="text-xs text-texto-suave">
                Modifica los atributos, departamento o rol asignado
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="w-9 h-9 rounded-full hover:bg-superficie-2 text-texto-suave hover:text-texto-principal flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-terra-campo bg-primario-claro border border-alerta text-alerta text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-texto-suave mb-1">
              Nombre Completo
            </label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full min-h-[2.75rem] px-3.5 py-2 rounded-terra-campo bg-superficie-2 border border-borde focus:border-primario focus:bg-superficie-1 focus:outline-none text-xs font-medium text-texto-principal"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-texto-suave mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                required
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="w-full min-h-[2.75rem] px-3.5 py-2 rounded-terra-campo bg-superficie-2 border border-borde focus:border-primario focus:bg-superficie-1 focus:outline-none text-xs font-medium text-texto-principal"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-texto-suave mb-1">
                Teléfono de Contacto
              </label>
              <input
                type="text"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="+591 70000000"
                className="w-full min-h-[2.75rem] px-3.5 py-2 rounded-terra-campo bg-superficie-2 border border-borde focus:border-primario focus:bg-superficie-1 focus:outline-none text-xs font-medium text-texto-principal"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-texto-suave">
                  Rol Asignado
                </label>
                <span className="text-[0.65rem] font-bold uppercase tracking-wider text-texto-suave bg-superficie-2 px-1.5 py-0.5 rounded border border-borde">
                  Solo lectura
                </span>
              </div>
              <input
                type="text"
                readOnly
                disabled
                value={rol}
                aria-label="Rol asignado (solo lectura)"
                className="w-full min-h-[2.75rem] px-3.5 py-2 rounded-terra-campo bg-superficie-2/70 border border-borde-suave text-xs font-bold text-texto-suave capitalize cursor-not-allowed select-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-texto-suave mb-1">
                Departamento
              </label>
              <select
                required
                value={departamento}
                onChange={(e) => setDepartamento(e.target.value)}
                className="w-full min-h-[2.75rem] px-3.5 py-2 rounded-terra-campo bg-superficie-2 border border-borde focus:border-primario focus:bg-superficie-1 focus:outline-none text-xs font-medium text-texto-principal capitalize"
              >
                {departamentos.map((d) => (
                  <option key={d.idDepartamento} value={d.nombre}>
                    {d.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-borde-suave mt-2">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[2.75rem] px-4 py-2 rounded-full bg-superficie-2 hover:bg-superficie-crema border border-borde text-xs font-bold text-texto-principal transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="min-h-[2.75rem] px-5 py-2 rounded-full bg-primario hover:bg-primario-hover text-sobre-primario shadow-terra-flotante text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-60"
            >
              {updateMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Guardar Cambios</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function UsuarioEditModal() {
  const isEditModalOpen = useUsuariosUiStore((state) => state.isEditModalOpen);
  const editingUsuario = useUsuariosUiStore((state) => state.editingUsuario);
  const closeEditModal = useUsuariosUiStore((state) => state.closeEditModal);

  if (!isEditModalOpen || !editingUsuario) return null;

  return (
    <UsuarioEditFormContent
      key={editingUsuario.idUsuario}
      usuario={editingUsuario}
      onClose={closeEditModal}
    />
  );
}

