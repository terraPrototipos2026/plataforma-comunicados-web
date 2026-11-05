import {
  ArrowUp,
  Bell,
  Code2,
  ShoppingCart,
  CreditCard,
  KeyRound,
  Coins,
} from 'lucide-react';
import type {
  DashboardOrderEvent,
  OrderEventIconKey,
  OrderEventTone,
} from '../../domain/models/dashboard.model';

interface OrdersOverviewCardProps {
  events: readonly DashboardOrderEvent[];
  growthPercent: string;
}

const ORDER_ICONS: Record<OrderEventIconKey, typeof Bell> = {
  bell: Bell,
  code: Code2,
  cart: ShoppingCart,
  card: CreditCard,
  key: KeyRound,
  coins: Coins,
};

const ORDER_TONE_STYLES: Record<OrderEventTone, string> = {
  green: 'bg-[#e4f4e9] text-[#1e7e46] border-[#bfe3ca]',
  primario: 'bg-primario-claro text-primario border-borde',
  cyan: 'bg-[#e3f6f8] text-[#116976] border-[#b7e4ea]',
  amber: 'bg-[#fff7df] text-[#b27600] border-[#f0e0b8]',
  magenta: 'bg-primario-suave text-oferta border-borde',
  dark: 'bg-superficie-2 text-texto-principal border-borde',
};

export function OrdersOverviewCard({
  events,
  growthPercent,
}: OrdersOverviewCardProps) {
  return (
    <article
      aria-labelledby="orders-overview-heading"
      className="rounded-terra-tarjeta bg-superficie-1 border-[1.5px] border-borde p-5 shadow-terra-card flex flex-col justify-between text-left"
    >
      {/* Cabecera del Widget */}
      <div className="flex flex-col gap-1 pb-4 border-b border-borde-suave">
        <h2
          id="orders-overview-heading"
          className="text-base sm:text-lg font-extrabold text-texto-principal tracking-tight"
        >
          Orders Overview
        </h2>
        <p className="text-xs sm:text-sm text-texto-suave flex items-center gap-1.5">
          <ArrowUp className="w-4 h-4 text-exito stroke-[2.5] shrink-0" />
          <span>
            <strong className="font-extrabold text-texto-principal">
              {growthPercent}
            </strong>{' '}
            this month
          </span>
        </p>
      </div>

      {/* Timeline Vertical de Eventos Recientes */}
      <div className="relative pt-5 pl-1 flex flex-col gap-5">
        {/* Línea conectora vertical */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[1.15rem] top-7 bottom-5 w-0.5 bg-borde"
        />

        {events.map((event) => {
          const Icon = ORDER_ICONS[event.iconKey];
          const badgeTone = ORDER_TONE_STYLES[event.tone];

          return (
            <div key={event.id} className="relative flex items-start gap-3.5">
              <div
                className={`relative z-10 w-8 h-8 rounded-full border flex items-center justify-center shrink-0 shadow-2xs ${badgeTone}`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>

              <div className="flex flex-col gap-0.5 pt-0.5 min-w-0">
                <h3 className="text-xs sm:text-sm font-extrabold text-texto-principal leading-snug">
                  {event.title}
                </h3>
                <time className="text-[0.68rem] font-extrabold uppercase tracking-wider text-texto-suave">
                  {event.timestamp}
                </time>
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}

