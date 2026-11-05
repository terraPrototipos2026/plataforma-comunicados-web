import { Check, MoreVertical, FolderKanban } from 'lucide-react';
import {
  DashboardRules,
  type DashboardProjectItem,
  type ProjectFilterStatus,
  type ProjectMember,
} from '../../domain/models/dashboard.model';
import { useDashboardUiStore } from '../store/use-dashboard-ui-store';

interface ProjectsTableCardProps {
  projects: readonly DashboardProjectItem[];
  doneThisMonth: number;
}

const COMPANY_LOGO_STYLES: Record<DashboardProjectItem['logoTone'], string> = {
  magenta: 'bg-gradient-to-br from-oferta to-primario text-sobre-primario',
  cyan: 'bg-gradient-to-br from-[#1b9aaa] to-[#116976] text-white',
  emerald: 'bg-gradient-to-br from-[#28a45a] to-[#1e7e46] text-white',
  primario: 'bg-gradient-to-br from-primario to-primario-hover text-sobre-primario',
  amber: 'bg-gradient-to-br from-[#d9822b] to-[#b26214] text-white',
  dark: 'bg-gradient-to-br from-[#382e2c] to-[#1e1917] text-[#f4ede8]',
};

const MEMBER_AVATAR_STYLES: Record<ProjectMember['tone'], string> = {
  primario: 'bg-primario text-sobre-primario',
  emerald: 'bg-[#1e7e46] text-white',
  amber: 'bg-[#b27600] text-white',
  cyan: 'bg-[#116976] text-white',
  dark: 'bg-[#282120] text-[#f4ede8]',
};

const FILTER_OPTIONS: readonly { value: ProjectFilterStatus; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'in-progress', label: 'En curso' },
  { value: 'completed', label: 'Completados' },
];

export function ProjectsTableCard({ projects, doneThisMonth }: ProjectsTableCardProps) {
  const searchQuery = useDashboardUiStore((state) => state.searchQuery);
  const projectStatusFilter = useDashboardUiStore((state) => state.projectStatusFilter);
  const setProjectStatusFilter = useDashboardUiStore(
    (state) => state.setProjectStatusFilter,
  );

  const filteredProjects = DashboardRules.filterProjects(
    projects,
    searchQuery,
    projectStatusFilter,
  );

  return (
    <article
      aria-labelledby="projects-card-heading"
      className="rounded-terra-tarjeta bg-superficie-1 border-[1.5px] border-borde shadow-terra-card flex flex-col overflow-hidden text-left"
    >
      {/* Cabecera de la Tabla de Proyectos */}
      <div className="p-5 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-borde-suave">
        <div className="flex flex-col gap-1">
          <h2
            id="projects-card-heading"
            className="text-base sm:text-lg font-extrabold text-texto-principal tracking-tight"
          >
            Projects
          </h2>
          <p className="text-xs sm:text-sm text-texto-suave flex items-center gap-1.5">
            <Check className="w-4 h-4 text-exito stroke-[2.5] shrink-0" />
            <span>
              <strong className="font-extrabold text-texto-principal">
                {doneThisMonth} done
              </strong>{' '}
              this month
            </span>
          </p>
        </div>

        {/* Filtros rápidos interactivos con área táctil >= 44px */}
        <div className="flex flex-wrap items-center gap-1.5">
          {FILTER_OPTIONS.map((option) => {
            const isActive = projectStatusFilter === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setProjectStatusFilter(option.value)}
                className={`min-h-[2.75rem] px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-primario text-sobre-primario shadow-terra-sm'
                    : 'bg-superficie-2 text-texto-suave hover:text-texto-principal border border-borde'
                }`}
              >
                {option.label}
              </button>
            );
          })}

          <button
            type="button"
            aria-label="Opciones de tabla de proyectos"
            onClick={() => setProjectStatusFilter('all')}
            className="min-w-[2.75rem] min-h-[2.75rem] w-11 h-11 rounded-full hover:bg-superficie-2 text-texto-suave hover:text-texto-principal flex items-center justify-center transition-colors cursor-pointer"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabla Responsive */}
      <div className="overflow-x-auto">
        {filteredProjects.length === 0 ? (
          <div className="p-8 text-center flex flex-col items-center gap-2">
            <FolderKanban className="w-8 h-8 text-texto-placeholder" />
            <p className="text-sm font-bold text-texto-principal">
              No se encontraron proyectos que coincidan con el filtro
            </p>
            <p className="text-xs text-texto-suave">
              Prueba con otro término en la barra de búsqueda superior.
            </p>
          </div>
        ) : (
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-borde-suave bg-superficie-2/50">
                <th
                  scope="col"
                  className="py-3 px-5 text-[0.65rem] font-extrabold uppercase tracking-[0.16em] text-texto-suave"
                >
                  Companies
                </th>
                <th
                  scope="col"
                  className="py-3 px-4 text-[0.65rem] font-extrabold uppercase tracking-[0.16em] text-texto-suave"
                >
                  Members
                </th>
                <th
                  scope="col"
                  className="py-3 px-4 text-[0.65rem] font-extrabold uppercase tracking-[0.16em] text-texto-suave"
                >
                  Budget
                </th>
                <th
                  scope="col"
                  className="py-3 px-5 text-[0.65rem] font-extrabold uppercase tracking-[0.16em] text-texto-suave"
                >
                  Completion
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borde-suave">
              {filteredProjects.map((project) => {
                const isCompleted = project.completion >= 100;

                return (
                  <tr
                    key={project.id}
                    className="hover:bg-superficie-2/60 transition-colors"
                  >
                    {/* Columna 1: Logo + Nombre del Proyecto/Empresa */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3.5 min-w-[12.5rem]">
                        <div
                          className={`w-9 h-9 rounded-terra-chico font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs ${
                            COMPANY_LOGO_STYLES[project.logoTone]
                          }`}
                        >
                          {project.companyShortCode}
                        </div>
                        <span className="text-xs sm:text-sm font-extrabold text-texto-principal">
                          {project.companyName}
                        </span>
                      </div>
                    </td>

                    {/* Columna 2: Avatares Superpuestos de Miembros */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center -space-x-2">
                        {project.members.map((member) => (
                          <div
                            key={member.id}
                            title={`${member.name} — ${member.role}`}
                            className={`relative w-7 h-7 rounded-full border-2 border-superficie-1 text-[0.65rem] font-extrabold flex items-center justify-center transition-transform hover:scale-110 hover:z-10 cursor-pointer select-none ${
                              MEMBER_AVATAR_STYLES[member.tone]
                            }`}
                          >
                            {member.initials}
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Columna 3: Presupuesto */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="text-xs font-extrabold text-texto-suave">
                        {project.budget}
                      </span>
                    </td>

                    {/* Columna 4: Barra de Progreso */}
                    <td className="py-3.5 px-5 min-w-[10rem]">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-extrabold text-texto-suave">
                            {project.completion}%
                          </span>
                        </div>
                        <div
                          role="progressbar"
                          aria-valuenow={project.completion}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`Progreso de ${project.companyName}`}
                          className="w-full h-1.5 rounded-full bg-superficie-2 overflow-hidden border border-borde-suave"
                        >
                          <div
                            style={{ width: `${project.completion}%` }}
                            className={`h-full rounded-full transition-all duration-500 ${
                              isCompleted
                                ? 'bg-gradient-to-r from-[#28a45a] to-exito'
                                : 'bg-gradient-to-r from-oferta to-primario'
                            }`}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </article>
  );
}

