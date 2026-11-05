import { useState } from 'react';
import { Clock } from 'lucide-react';
import { useThemeStore } from '../../../../core/store/use-theme-store';
import type {
  ChartCardVariant,
  DashboardChartCard,
  DashboardChartSeriesPoint,
} from '../../domain/models/dashboard.model';

interface OverhangingChartsRowProps {
  charts: readonly DashboardChartCard[];
}

const CHART_HEADER_STYLES: Record<ChartCardVariant, string> = {
  dark: 'bg-gradient-to-br from-[#352c2a] to-[#1e1917] text-[#f4ede8] shadow-[0_12px_26px_-6px_rgba(30,25,23,0.50)]',
  magenta:
    'bg-gradient-to-br from-oferta to-primario text-sobre-primario shadow-terra-flotante',
  green:
    'bg-gradient-to-br from-[#28a45a] to-[#1e7e46] text-white shadow-[0_12px_26px_-6px_rgba(30,126,70,0.45)]',
};

function OverhangingBarChart({ points }: { points: readonly DashboardChartSeriesPoint[] }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const maxValue = Math.max(...points.map((p) => p.value), 60);

  return (
    <div className="w-full h-44 flex flex-col justify-between pt-2 pb-1 select-none">
      {/* Líneas guía horizontales y barras */}
      <div className="relative flex-1 flex items-end justify-between gap-2.5 px-2 pt-4 pb-2 border-b border-white/20">
        {/* Líneas punteadas de fondo */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-2 bottom-2 flex flex-col justify-between"
        >
          <div className="border-t border-dashed border-white/20 w-full" />
          <div className="border-t border-dashed border-white/20 w-full" />
          <div className="border-t border-dashed border-white/20 w-full" />
        </div>

        {points.map((point, index) => {
          const heightPercent = Math.max(12, Math.round((point.value / maxValue) * 100));
          const isHovered = hoveredIdx === index;

          return (
            <div
              key={`${point.label}-${index}`}
              onMouseEnter={() => setHoveredIdx(index)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="relative z-10 flex-1 h-full flex flex-col items-center justify-end group cursor-pointer"
            >
              {/* Tooltip flotante al pasar el cursor */}
              {isHovered && (
                <span className="absolute -top-6 px-2 py-0.5 rounded-md bg-black/85 text-white text-[0.65rem] font-extrabold whitespace-nowrap shadow-sm">
                  {point.value}k
                </span>
              )}

              <div
                style={{ height: `${heightPercent}%` }}
                className={`w-2.5 sm:w-3 rounded-full transition-all duration-300 motion-reduce:transition-none ${
                  isHovered ? 'bg-white scale-x-110' : 'bg-white/85 hover:bg-white'
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Etiquetas del eje X */}
      <div className="flex items-center justify-between px-2 pt-2">
        {points.map((point, index) => (
          <span
            key={`${point.label}-label-${index}`}
            className="flex-1 text-center text-[0.68rem] font-bold text-white/80"
          >
            {point.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function OverhangingLineChart({
  points,
  chartId,
}: {
  points: readonly DashboardChartSeriesPoint[];
  chartId: string;
}) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const maxVal = Math.max(...points.map((p) => p.value), 500);
  const minVal = 0;

  const svgWidth = 320;
  const svgHeight = 130;
  const padX = 16;
  const padY = 18;
  const usableWidth = svgWidth - padX * 2;
  const usableHeight = svgHeight - padY * 2;

  const coords = points.map((point, idx) => {
    const x =
      points.length > 1
        ? padX + (idx / (points.length - 1)) * usableWidth
        : svgWidth / 2;
    const ratio = (point.value - minVal) / (maxVal - minVal || 1);
    const y = padY + usableHeight - ratio * usableHeight;
    return { x, y, point };
  });

  const polylinePoints = coords.map((c) => `${c.x},${c.y}`).join(' ');
  const areaPoints = `${coords[0]?.x ?? padX},${svgHeight - padY} ${polylinePoints} ${
    coords[coords.length - 1]?.x ?? svgWidth - padX
  },${svgHeight - padY}`;

  const gradientId = `line-area-${chartId}`;

  return (
    <div className="w-full h-44 flex flex-col justify-between pt-1 pb-1 select-none">
      <div className="relative flex-1 w-full">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full overflow-visible"
          role="img"
          aria-label={`Gráfico de líneas ${chartId}`}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Líneas guía horizontales */}
          {[0.2, 0.5, 0.8].map((ratio) => (
            <line
              key={ratio}
              x1={padX}
              x2={svgWidth - padX}
              y1={padY + usableHeight * ratio}
              y2={padY + usableHeight * ratio}
              stroke="rgba(255,255,255,0.2)"
              strokeDasharray="4 4"
              strokeWidth="1"
            />
          ))}

          {/* Área bajo la curva */}
          <polygon points={areaPoints} fill={`url(#${gradientId})`} />

          {/* Línea principal */}
          <polyline
            fill="none"
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={polylinePoints}
          />

          {/* Puntos interactivos */}
          {coords.map((coord, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <g
                key={`${coord.point.label}-${idx}`}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <circle
                  cx={coord.x}
                  cy={coord.y}
                  r={isHovered ? 6 : 4}
                  fill="#ffffff"
                  stroke="rgba(0,0,0,0.2)"
                  strokeWidth="1.5"
                />
                {isHovered && (
                  <g>
                    <rect
                      x={coord.x - 22}
                      y={coord.y - 26}
                      width="44"
                      height="18"
                      rx="5"
                      fill="rgba(20, 16, 15, 0.9)"
                    />
                    <text
                      x={coord.x}
                      y={coord.y - 14}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="10"
                      fontWeight="800"
                    >
                      {coord.point.value}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Etiquetas de meses en el eje X */}
      <div className="flex items-center justify-between px-2 pt-1 border-t border-white/20">
        {points.map((point, index) => (
          <span
            key={`${point.label}-${index}`}
            className="text-[0.65rem] font-bold text-white/85"
          >
            {point.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export function OverhangingChartsRow({ charts }: OverhangingChartsRowProps) {
  const highContrast = useThemeStore((state) => state.highContrast);

  return (
    <section
      aria-label="Métricas gráficas de campañas y tareas"
      className="grid grid-cols-1 lg:grid-cols-3 gap-y-9 gap-x-6 pt-6"
    >
      {charts.map((chart) => {
        const headerStyle = highContrast
          ? 'bg-superficie-2 text-texto-principal border-2 border-white'
          : CHART_HEADER_STYLES[chart.variant];

        return (
          <article
            key={chart.id}
            className="group rounded-terra-tarjeta bg-superficie-1 border-[1.5px] border-borde p-4 shadow-terra-card hover:shadow-terra transition-all duration-200 flex flex-col justify-between text-left"
          >
            {/* Cabecera Flotante ("Overhanging Chart Header") */}
            <div
              className={`-mt-9 mb-4 rounded-terra p-4 transition-transform duration-300 group-hover:-translate-y-1 motion-reduce:transform-none ${headerStyle}`}
            >
              {chart.chartType === 'bar' ? (
                <OverhangingBarChart points={chart.points} />
              ) : (
                <OverhangingLineChart points={chart.points} chartId={chart.id} />
              )}
            </div>

            {/* Cuerpo de la Tarjeta: Título y Descripción */}
            <div className="px-1 flex flex-col gap-1">
              <h2 className="text-base font-extrabold text-texto-principal tracking-tight">
                {chart.title}
              </h2>
              <p className="text-xs sm:text-sm text-texto-suave">
                {chart.highlightBadge && (
                  <strong className="font-extrabold text-exito mr-1">
                    {chart.highlightBadge}
                  </strong>
                )}
                <span>{chart.description}</span>
              </p>
            </div>

            {/* Divisor y Timestamp Inferior */}
            <div
              aria-hidden="true"
              className="my-3.5 h-px w-full bg-gradient-to-r from-transparent via-borde to-transparent"
            />

            <div className="px-1 flex items-center gap-1.5 text-xs font-medium text-texto-suave">
              <Clock className="w-3.5 h-3.5 shrink-0 text-texto-suave" />
              <span>{chart.timestamp}</span>
            </div>
          </article>
        );
      })}
    </section>
  );
}

