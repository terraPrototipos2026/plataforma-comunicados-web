export interface DashboardKpiApiDto {
  id: string;
  label: string;
  value: string;
  delta: string;
  is_positive: boolean;
  comparison_text: string;
  variant: 'dark' | 'magenta' | 'green' | 'cyan';
  icon_key: 'wallet' | 'users' | 'user-plus' | 'chart';
}

export interface DashboardChartSeriesPointApiDto {
  label: string;
  value: number;
}

export interface DashboardChartCardApiDto {
  id: string;
  title: string;
  description: string;
  highlight_badge?: string;
  timestamp: string;
  chart_type: 'bar' | 'line';
  variant: 'dark' | 'magenta' | 'green';
  points: DashboardChartSeriesPointApiDto[];
}

export interface ProjectMemberApiDto {
  id: string;
  name: string;
  initials: string;
  role: string;
  tone: 'primario' | 'emerald' | 'amber' | 'cyan' | 'dark';
}

export interface DashboardProjectItemApiDto {
  id: string;
  company_name: string;
  company_short_code: string;
  logo_tone: 'magenta' | 'cyan' | 'emerald' | 'primario' | 'amber' | 'dark';
  members: ProjectMemberApiDto[];
  budget: string;
  completion: number;
}

export interface DashboardOrderEventApiDto {
  id: string;
  title: string;
  timestamp: string;
  icon_key: 'bell' | 'code' | 'cart' | 'card' | 'key' | 'coins';
  tone: 'green' | 'primario' | 'cyan' | 'amber' | 'magenta' | 'dark';
}

export interface DashboardOverviewApiResponseDto {
  kpis: DashboardKpiApiDto[];
  charts: DashboardChartCardApiDto[];
  projects: DashboardProjectItemApiDto[];
  projects_done_this_month: number;
  orders_overview: DashboardOrderEventApiDto[];
  orders_growth_percent: string;
}

