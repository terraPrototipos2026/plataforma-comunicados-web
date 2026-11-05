import { createPortal } from 'react-dom';
import {
  X,
  CheckCircle2,
  FileText,
  Calendar,
  User,
  ShieldAlert,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { SlideFadeTransition } from '../../../../shared/components/slide-fade-transition';
import {
  useComunicadoDetailQuery,
} from '../hooks/use-comunicados-query';
import { useRegistrarLecturaMutation } from '../hooks/use-comunicado-mutations';
import { ComunicadoRules } from '../../domain/models/comunicado.model';
import { useComunicadosUiStore } from '../store/use-comunicados-ui-store';

export function ComunicadoViewerModal() {
  const viewerComunicadoId = useComunicadosUiStore((state) => state.viewerComunicadoId);
  const closeViewer = useComunicadosUiStore((state) => state.closeViewer);

  const { data: comunicado, isLoading } = useComunicadoDetailQuery(viewerComunicadoId);
  const registrarLecturaMutation = useRegistrarLecturaMutation();

  if (!viewerComunicadoId || typeof document === 'undefined') return null;

  const handleConfirmar = async () => {
    if (!viewerComunicadoId) return;
    await registrarLecturaMutation.mutateAsync({
      idComunicado: viewerComunicadoId,
      confirmar: true,
    });
  };

  return createPortal(
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5">
      <div
        aria-hidden="true"
        onClick={closeViewer}
        className="fixed inset-0 bg-black/65 backdrop-blur-xs transition-opacity"
      />

      <SlideFadeTransition
        isVisible={Boolean(viewerComunicadoId)}
        direction="vertical"
        offset={24}
        preset="spring"
        transitionKey={`viewer-${viewerComunicadoId}`}
        className="relative z-10 w-full max-w-3xl max-h-[90vh] flex flex-col rounded-terra-modal bg-superficie-1 border-[1.5px] border-borde shadow-terra overflow-hidden text-left"
      >
        {/* Cabecera del Modal */}
        <div className="flex items-start justify-between gap-3 p-5 border-b border-borde-suave bg-superficie-2/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-terra-boton bg-primario-claro text-primario flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-primario">
                  {comunicado?.codigo ?? 'COMUNICADO OFICIAL'}
                </span>
                {comunicado && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[0.65rem] border ${
                      ComunicadoRules.getPrioridadBadgeStyles(comunicado.prioridad).bg
                    } ${
                      ComunicadoRules.getPrioridadBadgeStyles(comunicado.prioridad).text
                    } ${
                      ComunicadoRules.getPrioridadBadgeStyles(comunicado.prioridad).border
                    }`}
                  >
                    {comunicado.prioridad}
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-texto-principal line-clamp-1">
                {comunicado?.titulo ?? 'Cargando contenido...'}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={closeViewer}
            aria-label="Cerrar visualizador"
            className="w-9 h-9 rounded-full hover:bg-superficie-2 text-texto-suave hover:text-texto-principal flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido con scroll oculto */}
        <div className="flex-1 overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden p-5 sm:p-6 flex flex-col gap-5">
          {isLoading || !comunicado ? (
            <div className="py-16 flex items-center justify-center gap-2 text-xs font-bold text-texto-suave">
              <Loader2 className="w-5 h-5 animate-spin text-primario" />
              <span>Cargando comunicado oficial...</span>
            </div>
          ) : (
            <>
              {/* Metadatos Rápidos */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-texto-suave border-b border-borde-suave pb-3">
                <div className="flex items-center gap-1.5 font-semibold">
                  <User className="w-4 h-4 text-primario" />
                  <span>Emisor: {comunicado.autorNombre}</span>
                </div>
                <div className="flex items-center gap-1.5 font-semibold">
                  <Calendar className="w-4 h-4 text-primario" />
                  <span>
                    Fecha:{' '}
                    {comunicado.fechaPublicacion
                      ? new Date(comunicado.fechaPublicacion).toLocaleString('es-ES', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })
                      : 'Borrador'}
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-superficie-2 border border-borde text-[0.7rem] font-bold text-texto-principal">
                  {ComunicadoRules.formatAlcanceLabel(comunicado.tipoAlcance)}
                </span>
              </div>

              {/* Imagen / Afiche Principal */}
              {comunicado.portadaUrl && (
                <div className="rounded-terra-campo overflow-hidden border border-borde bg-black/5 flex items-center justify-center max-h-72">
                  <img
                    src={comunicado.portadaUrl}
                    alt={comunicado.titulo}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Extracto */}
              {comunicado.extracto && (
                <div className="p-3.5 rounded-terra-campo bg-superficie-crema border border-borde text-xs font-semibold text-texto-principal leading-relaxed">
                  <p className="font-extrabold text-[0.68rem] uppercase tracking-wider text-primario mb-1">
                    Extracto Ejecutivo
                  </p>
                  {comunicado.extracto}
                </div>
              )}

              {/* Cuerpo HTML */}
              {comunicado.cuerpo?.contenido ? (
                <div
                  className="prose prose-sm max-w-none text-xs sm:text-sm text-texto-principal leading-relaxed space-y-3"
                  dangerouslySetInnerHTML={{ __html: comunicado.cuerpo.contenido }}
                />
              ) : (
                <p className="text-xs text-texto-suave italic">
                  Este comunicado no contiene texto adicional en el cuerpo.
                </p>
              )}

              {/* Documento PDF adjunto si existe */}
              {comunicado.cuerpo?.urlArchivo && (
                <div className="rounded-terra-campo bg-superficie-2 border border-borde p-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-terra-chico bg-primario-claro text-primario flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-texto-principal truncate">
                        {comunicado.cuerpo.nombreArchivo ?? 'Documento_Oficial.pdf'}
                      </p>
                      <p className="text-[0.65rem] text-texto-suave">
                        {comunicado.cuerpo.tamanoBytes
                          ? `${(comunicado.cuerpo.tamanoBytes / 1024 / 1024).toFixed(1)} MB`
                          : 'PDF Oficial'}{' '}
                        • {comunicado.cuerpo.numeroPaginas ?? 1} páginas
                      </p>
                    </div>
                  </div>

                  <a
                    href={comunicado.cuerpo.urlArchivo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[2.5rem] px-3.5 py-1.5 rounded-full bg-primario hover:bg-primario-hover text-sobre-primario text-xs font-extrabold flex items-center gap-1.5 transition-colors shadow-terra-sm shrink-0"
                  >
                    <span>Ver PDF</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </>
          )}
        </div>

        {/* Barra de Confirmación Inferior */}
        <div className="p-4 border-t border-borde-suave bg-superficie-2/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-texto-suave">
            <ShieldAlert className="w-4 h-4 text-primario shrink-0" />
            <span className="text-[0.72rem]">
              La confirmación quedará registrada con fecha, hora e identidad en la bitácora de auditoría.
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={closeViewer}
              className="min-h-[2.75rem] px-4 py-2 rounded-full bg-superficie-1 border border-borde text-xs font-bold text-texto-principal cursor-pointer"
            >
              Cerrar
            </button>

            <button
              type="button"
              disabled={registrarLecturaMutation.isPending}
              onClick={handleConfirmar}
              className="min-h-[2.75rem] px-5 py-2 rounded-full bg-gradient-to-r from-oferta to-primario hover:opacity-95 text-sobre-primario text-xs font-extrabold shadow-terra-flotante flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
            >
              {registrarLecturaMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              <span>Confirmar Recepción Obligatoria</span>
            </button>
          </div>
        </div>
      </SlideFadeTransition>
    </div>,
    document.body,
  );
}
