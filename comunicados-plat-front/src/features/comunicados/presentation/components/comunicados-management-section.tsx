import { FileText, PlusCircle } from 'lucide-react';
import { SlideFadeTransition } from '../../../../shared/components/slide-fade-transition';
import { useComunicadosUiStore } from '../store/use-comunicados-ui-store';
import { ComunicadosTableCard } from './comunicados-table-card';
import { ComunicadoComposerCard } from './comunicado-composer-card';

export function ComunicadosManagementSection() {
  const activeTab = useComunicadosUiStore((state) => state.activeTab);
  const setActiveTab = useComunicadosUiStore((state) => state.setActiveTab);

  return (
    <section
      aria-label="Gestión de Comunicados Oficiales"
      className="flex flex-col gap-5 text-left"
    >
      {/* Barra Superior con Pestañas Principales e Indicadores Operativos */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-1 border-b border-borde-suave">
        {/* Pestañas de Navegación del Módulo */}
        <div
          role="tablist"
          aria-label="Pestañas de Comunicados"
          className="inline-flex flex-wrap items-center gap-2 p-1.5 rounded-full bg-superficie-1 border-[1.5px] border-borde shadow-terra-card"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'listado'}
            onClick={() => setActiveTab('listado')}
            className={`min-h-[2.75rem] px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'listado'
                ? 'bg-gradient-to-r from-oferta to-primario text-sobre-primario shadow-terra-flotante'
                : 'text-texto-suave hover:text-texto-principal hover:bg-superficie-2'
            }`}
          >
            <FileText className="w-4 h-4 shrink-0" />
            <span>Listado de Comunicados</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'redactar'}
            onClick={() => setActiveTab('redactar')}
            className={`min-h-[2.75rem] px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'redactar'
                ? 'bg-gradient-to-r from-oferta to-primario text-sobre-primario shadow-terra-flotante'
                : 'text-texto-suave hover:text-texto-principal hover:bg-superficie-2'
            }`}
          >
            <PlusCircle className="w-4 h-4 shrink-0" />
            <span>+ Redactar Comunicado</span>
          </button>
        </div>
      </div>

      {/* Contenedor Principal con Transición */}
      <SlideFadeTransition
        direction="horizontal"
        offset={24}
        preset="smooth"
        transitionKey={`comunicados-tab-${activeTab}`}
      >
        <div role="tabpanel">
          {activeTab === 'listado' ? (
            <ComunicadosTableCard />
          ) : (
            <ComunicadoComposerCard />
          )}
        </div>
      </SlideFadeTransition>
    </section>
  );
}
