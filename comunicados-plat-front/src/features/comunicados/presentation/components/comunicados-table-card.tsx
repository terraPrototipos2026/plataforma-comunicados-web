import { useState } from 'react';
import {
  FileText,
  Search,
  Plus,
  Eye,
  BarChart2,
  Ban,
  AlertCircle,
  Loader2,
  Paperclip,
  Building2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useThemeStore } from '../../../../core/store/use-theme-store';
import { useComunicadosQuery } from '../hooks/use-comunicados-query';
import { useAnularComunicadoMutation } from '../hooks/use-comunicado-mutations';
import {
  ComunicadoRules,
} from '../../domain/models/comunicado.model';
import { useComunicadosUiStore } from '../store/use-comunicados-ui-store';
import { ComunicadoViewerModal } from './comunicado-viewer-modal';
import { ComunicadoStatsDrawer } from './comunicado-stats-drawer';

export function ComunicadosTableCard() {
  const highContrast = useThemeStore((state) => state.highContrast);

  const searchQuery = useComunicadosUiStore((state) => state.searchQuery);
  const setSearchQuery = useComunicadosUiStore((state) => state.setSearchQuery);
  const selectedEstado = useComunicadosUiStore((state) => state.selectedEstado);
  const setSelectedEstado = useComunicadosUiStore((state) => state.setSelectedEstado);
  const selectedPrioridad = useComunicadosUiStore((state) => state.selectedPrioridad);
  const setSelectedPrioridad = useComunicadosUiStore((state) => state.setSelectedPrioridad);
  const setActiveTab = useComunicadosUiStore((state) => state.setActiveTab);
  const openViewer = useComunicadosUiStore((state) => state.openViewer);
  const openStats = useComunicadosUiStore((state) => state.openStats);

  const [anulandoId, setAnulandoId] = useState<string | null>(null);

  const { data: comunicados = [], isLoading, error } = useComunicadosQuery({
    search: searchQuery,
    estado: selectedEstado !== 'TODOS' ? selectedEstado : undefined,
    prioridad: selectedPrioridad !== 'TODAS' ? selectedPrioridad : undefined,
  });

  const anularMutation = useAnularComunicadoMutation();

  const handleAnular = async (id: string) => {
    if (!window.confirm('¿Deseas anular este comunicado oficial?')) return;
    setAnulandoId(id);
    try {
      await anularMutation.mutateAsync(id);
    } finally {
      setAnulandoId(null);
    }
  };

  return (
    <>
      <div className="rounded-terra-modal bg-superficie-1 border-[1.5px] border-borde p-4 sm:p-6 shadow-terra flex flex-col gap-5 text-left">
        {/* Cabecera Principal */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-borde-suave">
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold uppercase tracking-tight text-texto-principal">
              Gestión de Comunicados Oficiales
            </h1>
            <p className="text-xs text-texto-suave">
              Registro, control de distribución institucional y ciclo de vida de publicaciones
            </p>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('redactar')}
            className={`min-h-[2.75rem] px-5 py-2.5 rounded-full font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-terra-flotante transition-all cursor-pointer ${
              highContrast
                ? 'bg-primario text-sobre-primario border border-white'
                : 'bg-primario hover:bg-primario-hover text-sobre-primario'
            }`}
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>Nuevo Comunicado</span>
          </button>
        </div>

        {/* Barra de Filtros: Buscador + Estado + Prioridad */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-superficie-2/50 p-3 rounded-terra-campo border border-borde-suave">
          {/* Buscador */}
          <div className="relative flex-1 min-w-[16rem]">
            <Search className="w-4 h-4 text-texto-placeholder absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por código, título o autor..."
              className="w-full min-h-[2.65rem] pl-9.5 pr-4 py-1.5 rounded-terra-boton bg-superficie-1 border border-borde focus:border-primario focus:shadow-terra-anillo focus:outline-none text-xs font-medium text-texto-principal placeholder:text-texto-placeholder transition-all"
            />
          </div>

          {/* Filtros Dropdowns */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-extrabold uppercase tracking-wider text-texto-suave text-[0.68rem]">
                Estado:
              </span>
              <select
                value={selectedEstado}
                onChange={(e) => setSelectedEstado(e.target.value)}
                className="min-h-[2.65rem] px-3 py-1.5 rounded-terra-boton bg-superficie-1 border border-borde text-xs font-semibold text-texto-principal focus:outline-none focus:border-primario cursor-pointer"
              >
                <option value="TODOS">Todos los Estados</option>
                <option value="PUBLICADO">Publicado</option>
                <option value="BORRADOR">Borrador</option>
                <option value="PROGRAMADO">Programado</option>
                <option value="ANULADO">Anulado</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-extrabold uppercase tracking-wider text-texto-suave text-[0.68rem]">
                Prioridad:
              </span>
              <select
                value={selectedPrioridad}
                onChange={(e) => setSelectedPrioridad(e.target.value)}
                className="min-h-[2.65rem] px-3 py-1.5 rounded-terra-boton bg-superficie-1 border border-borde text-xs font-semibold text-texto-principal focus:outline-none focus:border-primario cursor-pointer"
              >
                <option value="TODAS">Todas</option>
                <option value="URGENTE">Urgente</option>
                <option value="IMPORTANTE">Importante</option>
                <option value="NORMAL">Normal</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabla de Comunicados */}
        {isLoading ? (
          <div className="py-20 flex items-center justify-center gap-2 text-xs font-bold text-texto-suave">
            <Loader2 className="w-5 h-5 animate-spin text-primario" />
            <span>Consultando comunicados oficiales...</span>
          </div>
        ) : error ? (
          <div className="rounded-terra-campo bg-primario-claro border border-alerta p-4 text-xs font-bold text-alerta flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>
              {error instanceof Error ? error.message : 'No fue posible cargar los comunicados.'}
            </span>
          </div>
        ) : comunicados.length === 0 ? (
          <div className="py-16 text-center text-xs text-texto-suave flex flex-col items-center gap-2">
            <FileText className="w-10 h-10 text-texto-placeholder opacity-60" />
            <p className="font-bold text-texto-principal text-sm">No se encontraron comunicados</p>
            <p className="max-w-sm">
              No existen publicaciones con los criterios seleccionados o aún no has redactado ningún comunicado.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 sm:-mx-6">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-y border-borde-suave bg-superficie-2/70 text-[0.65rem] font-extrabold uppercase tracking-[0.16em] text-texto-suave">
                  <th scope="col" className="py-3 px-5">
                    Portada / Título
                  </th>
                  <th scope="col" className="py-3 px-3">
                    Prioridad
                  </th>
                  <th scope="col" className="py-3 px-3">
                    Estado
                  </th>
                  <th scope="col" className="py-3 px-3">
                    Autor
                  </th>
                  <th scope="col" className="py-3 px-3">
                    Alcance
                  </th>
                  <th scope="col" className="py-3 px-3">
                    Fecha
                  </th>
                  <th scope="col" className="py-3 px-3 text-center">
                    Dest. / Confirm.
                  </th>
                  <th scope="col" className="py-3 px-5 text-right">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borde-suave text-xs font-medium text-texto-principal">
                {comunicados.map((item) => {
                  const prioridadStyles = ComunicadoRules.getPrioridadBadgeStyles(item.prioridad);
                  const estadoStyles = ComunicadoRules.getEstadoBadgeStyles(item.estado);

                  return (
                    <tr
                      key={item.idComunicado}
                      className="hover:bg-superficie-2/50 transition-colors group"
                    >
                      {/* Portada / Título */}
                      <td className="py-3.5 px-5 max-w-xs sm:max-w-sm">
                        <div className="flex items-start gap-3">
                          {item.portadaUrl ? (
                            <div className="w-11 h-11 rounded-terra-chico overflow-hidden border border-borde bg-black/5 shrink-0 shadow-terra-sm">
                              <img
                                src={item.portadaUrl}
                                alt={item.titulo}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-11 h-11 rounded-terra-chico bg-superficie-2 border border-borde text-texto-suave flex items-center justify-center shrink-0">
                              <FileText className="w-5 h-5" />
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <span className="font-mono text-[0.68rem] font-bold text-texto-suave block">
                              {item.codigo}
                            </span>
                            <button
                              type="button"
                              onClick={() => openViewer(item.idComunicado)}
                              className="font-extrabold text-xs text-texto-principal hover:text-primario transition-colors text-left line-clamp-2 cursor-pointer leading-snug"
                            >
                              {item.titulo}
                            </button>
                            {item.totalAdjuntosPdf > 0 && (
                              <span className="inline-flex items-center gap-1 text-[0.65rem] font-semibold text-texto-suave mt-0.5">
                                <Paperclip className="w-3 h-3 text-primario" />
                                <span>{item.totalAdjuntosPdf} PDF adjunto(s)</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Prioridad */}
                      <td className="py-3.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[0.65rem] border ${prioridadStyles.bg} ${prioridadStyles.text} ${prioridadStyles.border}`}
                        >
                          {item.prioridad}
                        </span>
                      </td>

                      {/* Estado */}
                      <td className="py-3.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[0.65rem] border ${estadoStyles.bg} ${estadoStyles.text} ${estadoStyles.border}`}
                        >
                          {item.estado}
                        </span>
                      </td>

                      {/* Autor */}
                      <td className="py-3.5 px-3 text-texto-suave font-semibold whitespace-nowrap">
                        {item.autorNombre}
                      </td>

                      {/* Alcance */}
                      <td className="py-3.5 px-3 text-texto-suave whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-texto-placeholder shrink-0" />
                          <span>{ComunicadoRules.formatAlcanceLabel(item.tipoAlcance)}</span>
                        </div>
                      </td>

                      {/* Fecha */}
                      <td className="py-3.5 px-3 text-texto-suave text-[0.72rem] whitespace-nowrap font-mono">
                        {item.fechaPublicacion
                          ? new Date(item.fechaPublicacion).toISOString().replace('T', ' ').slice(0, 16)
                          : '—'}
                      </td>

                      {/* Dest. / Confirm. */}
                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        <div className="flex flex-col items-center">
                          <span className="font-extrabold text-xs text-texto-principal">
                            {item.totalConfirmados} / {item.totalDestinatarios}
                          </span>
                          <span
                            className={`text-[0.68rem] font-extrabold ${
                              item.porcentajeLectura > 0 ? 'text-exito' : 'text-alerta'
                            }`}
                          >
                            {item.porcentajeLectura}% lectura
                          </span>
                        </div>
                      </td>

                      {/* Acciones */}
                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => openViewer(item.idComunicado)}
                            title="Ver comunicado oficial"
                            className="w-8 h-8 rounded-full hover:bg-superficie-2 text-texto-suave hover:text-primario flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => openStats(item.idComunicado)}
                            title="Estadísticas de lectura"
                            className="w-8 h-8 rounded-full hover:bg-superficie-2 text-texto-suave hover:text-primario flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <BarChart2 className="w-4 h-4" />
                          </button>

                          {item.estado !== 'ANULADO' && (
                            <button
                              type="button"
                              disabled={anulandoId === item.idComunicado}
                              onClick={() => handleAnular(item.idComunicado)}
                              title="Anular comunicado"
                              className="w-8 h-8 rounded-full hover:bg-primario-claro text-texto-suave hover:text-alerta flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer con paginación simulada */}
        <div className="flex items-center justify-between border-t border-borde-suave pt-3 text-xs text-texto-suave">
          <span>Mostrando 1 - {comunicados.length} de {comunicados.length} comunicados</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled
              className="w-8 h-8 rounded-full border border-borde text-texto-suave flex items-center justify-center opacity-40 cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="w-8 h-8 rounded-full bg-primario text-sobre-primario font-bold text-xs flex items-center justify-center">
              1
            </span>
            <button
              type="button"
              disabled
              className="w-8 h-8 rounded-full border border-borde text-texto-suave flex items-center justify-center opacity-40 cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <ComunicadoViewerModal />
      <ComunicadoStatsDrawer />
    </>
  );
}
