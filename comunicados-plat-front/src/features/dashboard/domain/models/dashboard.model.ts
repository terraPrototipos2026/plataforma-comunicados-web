export type DashboardNavKey =
  | 'dashboard'
  | 'comunicados'
  | 'usuarios'
  | 'roles-permisos'
  | 'departamentos'
  | 'tables'
  | 'billing'
  | 'notifications'
  | 'profile';

export type KpiAccentVariant = 'dark' | 'magenta' | 'green' | 'cyan';

export type KpiIconKey = 'wallet' | 'users' | 'user-plus' | 'chart';

export interface DashboardKpiMetric {
  id: string;
  label: string;
  value: string;
  delta: string;
  isPositive: boolean;
  comparisonText: string;
  variant: KpiAccentVariant;
  iconKey: KpiIconKey;
}

export interface DashboardChartSeriesPoint {
  label: string;
  value: number;
}

export type ChartCardVariant = 'dark' | 'magenta' | 'green';

export interface DashboardChartCard {
  id: string;
  title: string;
  description: string;
  highlightBadge?: string;
  timestamp: string;
  chartType: 'bar' | 'line';
  variant: ChartCardVariant;
  points: readonly DashboardChartSeriesPoint[];
}

export interface ProjectMember {
  id: string;
  name: string;
  initials: string;
  role: string;
  tone: 'primario' | 'emerald' | 'amber' | 'cyan' | 'dark';
}

export type ProjectStatus = 'in-progress' | 'completed';

export interface DashboardProjectItem {
  id: string;
  companyName: string;
  companyShortCode: string;
  logoTone: 'magenta' | 'cyan' | 'emerald' | 'primario' | 'amber' | 'dark';
  members: readonly ProjectMember[];
  budget: string;
  completion: number;
  status: ProjectStatus;
}

export type OrderEventIconKey = 'bell' | 'code' | 'cart' | 'card' | 'key' | 'coins';

export type OrderEventTone = 'green' | 'primario' | 'cyan' | 'amber' | 'magenta' | 'dark';

export interface DashboardOrderEvent {
  id: string;
  title: string;
  timestamp: string;
  iconKey: OrderEventIconKey;
  tone: OrderEventTone;
}

export interface DashboardOverviewData {
  kpis: readonly DashboardKpiMetric[];
  charts: readonly DashboardChartCard[];
  projects: readonly DashboardProjectItem[];
  projectsDoneThisMonth: number;
  ordersOverview: readonly DashboardOrderEvent[];
  ordersGrowthPercent: string;
}

export type ProjectFilterStatus = 'all' | ProjectStatus;

export const DashboardRules = {
  filterProjects(
    projects: readonly DashboardProjectItem[],
    searchQuery: string,
    statusFilter: ProjectFilterStatus,
  ): DashboardProjectItem[] {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
      if (!matchesStatus) return false;

      if (!normalizedQuery) return true;

      const matchesCompany = project.companyName.toLowerCase().includes(normalizedQuery);
      const matchesBudget = project.budget.toLowerCase().includes(normalizedQuery);
      const matchesMember = project.members.some((member) =>
        member.name.toLowerCase().includes(normalizedQuery),
      );

      return matchesCompany || matchesBudget || matchesMember;
    });
  },
};

