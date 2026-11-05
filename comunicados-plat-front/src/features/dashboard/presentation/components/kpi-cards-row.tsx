import { Wallet, Users, UserPlus, BarChart3 } from 'lucide-react';
import { useThemeStore } from '../../../../core/store/use-theme-store';
import type {
  DashboardKpiMetric,
  KpiAccentVariant,
  KpiIconKey,
} from '../../domain/models/dashboard.model';

interface KpiCardsRowProps {
  metrics: readonly DashboardKpiMetric[];
}

const KPI_ICONS: Record<KpiIconKey, typeof Wallet> = {
  wallet: Wallet,
  users: Users,
  'user-plus': UserPlus,
  chart: BarChart3,
};

const KPI_GRADIENT_STYLES: Record<KpiAccentVariant, string> = {
  dark: 'bg-gradient-to-br from-[#382e2c] to-[#1e1917] text-[#f4ede8] shadow-[0_10px_22px_-4px_rgba(30,25,23,0.45)]',
  magenta:
    'bg-gradient-to-br from-oferta to-primario text-sobre-primario shadow-terra-flotante',
  green:
    'bg-gradient-to-br from-[#28a45a] to-[#1e7e46] text-white shadow-[0_10px_22px_-4px_rgba(30,126,70,0.42)]',
  cyan: 'bg-gradient-to-br from-[#1b9aaa] to-[#116976] text-white shadow-[0_10px_22px_-4px_rgba(27,154,170,0.40)]',
};

export function KpiCardsRow({ metrics }: KpiCardsRowProps) {
  const highContrast = useThemeStore((state) => state.highContrast);

  return (
    <section
      aria-label="Indicadores clave de rendimiento"
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-y-7 gap-x-6 pt-4"
    >
      {metrics.map((metric) => {
        const Icon = KPI_ICONS[metric.iconKey];
        const badgeStyle = highContrast
          ? 'bg-primario text-sobre-primario border-2 border-white'
          : KPI_GRADIENT_STYLES[metric.variant];

        return (
          <article
            key={metric.id}
            className="group relative rounded-terra-tarjeta bg-superficie-1 border-[1.5px] border-borde p-4 shadow-terra-card hover:shadow-terra transition-all duration-200 hover:-translate-y-0.5 motion-reduce:transform-none flex flex-col justify-between"
          >
            {/* Fila Superior: Icono Flotante + Etiqueta y Valor a la derecha */}
            <div className="flex items-start justify-between gap-3">
              <div
                className={`-mt-8 w-14 h-14 rounded-terra-boton flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 motion-reduce:transform-none ${badgeStyle}`}
              >
                <Icon className="w-6 h-6" />
              </div>

              <div className="flex flex-col text-right">
                <span className="text-xs font-bold text-texto-suave tracking-wide">
                  {metric.label}
                </span>
                <span className="text-xl sm:text-2xl font-extrabold text-texto-principal tracking-tight mt-0.5">
                  {metric.value}
                </span>
              </div>
            </div>

            {/* Separador Sutil Material Dashboard */}
            <div
              aria-hidden="true"
              className="my-3.5 h-px w-full bg-gradient-to-r from-transparent via-borde to-transparent"
            />

            {/* Pie de Tarjeta: Comparativa respecto a la semana/mes/día anterior */}
            <p className="text-xs font-medium text-texto-suave flex items-center gap-1.5 text-left">
              <span
                className={`font-extrabold ${
                  metric.isPositive ? 'text-exito' : 'text-alerta'
                }`}
              >
                {metric.delta}
              </span>
              <span>{metric.comparisonText}</span>
            </p>
          </article>
        );
      })}
    </section>
  );
}

