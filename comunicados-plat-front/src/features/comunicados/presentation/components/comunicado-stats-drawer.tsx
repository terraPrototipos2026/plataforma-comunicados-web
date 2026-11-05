import { createPortal } from 'react-dom';
import {
  X,
  PieChart,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Store,
} from 'lucide-react';
import { SlideFadeTransition } from '../../../../shared/components/slide-fade-transition';
import { useComunicadoDetailQuery } from '../hooks/use-comunicados-query';
import { useComunicadosUiStore } from '../store/use-comunicados-ui-store';

export function ComunicadoStatsDrawer() {
  const statsComunicadoId = useComunicadosUiStore((state) => state.statsComunicadoId);
  const closeStats = useComunicadosUiStore((state) => state.closeStats);

  const { data: comunicado } = useComunicadoDetailQuery(statsComunicadoId);

  if (!statsComunicadoId || typeof document === 'undefined') return null;

  const total = comunicado?.totalDestinatarios ?? 0;
  const confirmados = comunicado?.totalConfirmados ?? 0;
  const pendientes = Math.max(0, total - confirmados);
  const porcentaje = comunicado?.porcentajeLectura ?? 0;

  return createPortal(
    <div className="fixed inset-0 z-[120] flex items-center justify-end">
      <div
        aria-hidden="true"
        onClick={closeStats}
        className="fixed inset-0 bg-black/55 backdrop-blur-xs transition-opacity"
      />

      <SlideFadeTransition
        isVisible={Boolean(statsComunicadoId)}
        direction="horizontal"
        offset={60}
        preset="spring"
        transitionKey={`stats-${statsComunicadoId}`}
        className="relative z-10 w-full max-w-md h-full bg-superficie-1 border-l border-borde shadow-terra flex flex-col text-left"
      >
        {/* Cabecera */}
        <div className="p-5 border-b border-borde-suave flex items-center justify-between gap-3 bg-superficie-2/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-terra-boton bg-primario-claro text-primario flex items-center justify-center shrink-0">
              <PieChart className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[0.65rem] font-extrabold uppercase tracking-widest text-primario block">
                Trazabilidad en Tiempo Real
              </span>
              <h2 className="text-base font-extrabold text-texto-principal line-clamp-1">
                Seguimiento de Lectura
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={closeStats}
            aria-label="Cerrar panel de estadísticas"
            className="w-9 h-9 rounded-full hover:bg-superficie-2 text-texto-suave hover:text-texto-principal flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden p-5 flex flex-col gap-5">
          {/* Tarjeta de Resumen General */}
          <div className="rounded-terra-campo bg-superficie-2 border border-borde p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs font-bold text-texto-suave">
              <span>{comunicado?.codigo}</span>
              <span className="font-extrabold text-primario">{porcentaje}% Lectura</span>
            </div>

            <div className="w-full h-3 rounded-full bg-borde-suave overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-oferta to-exito transition-all duration-500 rounded-full"
                style={{ width: `${porcentaje}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 text-center">
              <div className="p-2.5 rounded-terra-chico bg-superficie-1 border border-borde">
                <span className="text-[0.65rem] font-extrabold uppercase tracking-wider text-exito flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Confirmados</span>
                </span>
                <p className="text-lg font-extrabold text-texto-principal mt-0.5">
                  {confirmados}
                </p>
              </div>

              <div className="p-2.5 rounded-terra-chico bg-superficie-1 border border-borde">
                <span className="text-[0.65rem] font-extrabold uppercase tracking-wider text-texto-suave flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3 text-alerta" />
                  <span>Pendientes</span>
                </span>
                <p className="text-lg font-extrabold text-texto-principal mt-0.5">
                  {pendientes}
                </p>
              </div>
            </div>
          </div>

          {/* Desglose por Sedes y Departamentos */}
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-extrabold uppercase tracking-wider text-texto-suave flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-primario" />
              <span>Desglose por Sede Corporativa</span>
            </span>

            <div className="space-y-2">
              <div className="p-3 rounded-terra-chico bg-superficie-2 border border-borde-suave flex items-center justify-between text-xs">
                <span className="font-bold text-texto-principal">Casa Central</span>
                <span className="font-semibold text-exito">92% confirmado</span>
              </div>
              <div className="p-3 rounded-terra-chico bg-superficie-2 border border-borde-suave flex items-center justify-between text-xs">
                <span className="font-bold text-texto-principal">Planta Industrial</span>
                <span className="font-semibold text-texto-principal">76% confirmado</span>
              </div>
              <div className="p-3 rounded-terra-chico bg-superficie-2 border border-borde-suave flex items-center justify-between text-xs">
                <span className="font-bold text-texto-principal">Salas de Exposición</span>
                <span className="font-semibold text-texto-principal">84% confirmado</span>
              </div>
            </div>
          </div>

          {/* Auditoría Legal y Validez */}
          <div className="p-3.5 rounded-terra-campo bg-superficie-crema border border-borde flex items-start gap-2.5 text-xs text-texto-suave">
            <ShieldCheck className="w-4 h-4 text-primario shrink-0 mt-0.5" />
            <p className="text-[0.72rem] leading-snug">
              Cada confirmación de lectura cuenta con respaldo criptográfico y validez jurídica interna de acuerdo al reglamento corporativo de Grupo Terra.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-borde-suave bg-superficie-2/40 flex justify-end">
          <button
            type="button"
            onClick={closeStats}
            className="min-h-[2.5rem] px-5 py-2 rounded-full bg-superficie-1 hover:bg-superficie-2 border border-borde text-xs font-bold text-texto-principal transition-colors cursor-pointer"
          >
            Cerrar Panel
          </button>
        </div>
      </SlideFadeTransition>
    </div>,
    document.body,
  );
}
