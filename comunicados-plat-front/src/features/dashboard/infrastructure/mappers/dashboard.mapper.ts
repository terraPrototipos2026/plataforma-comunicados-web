import type {
  DashboardChartCard,
  DashboardKpiMetric,
  DashboardOrderEvent,
  DashboardOverviewData,
  DashboardProjectItem,
} from '../../domain/models/dashboard.model';
import type {
  DashboardChartCardApiDto,
  DashboardKpiApiDto,
  DashboardOrderEventApiDto,
  DashboardOverviewApiResponseDto,
  DashboardProjectItemApiDto,
} from '../dtos/dashboard-api.dto';

export class DashboardMapper {
  static kpiToDomain(dto: DashboardKpiApiDto): DashboardKpiMetric {
    return {
      id: dto.id,
      label: dto.label,
      value: dto.value,
      delta: dto.delta,
      isPositive: dto.is_positive,
      comparisonText: dto.comparison_text,
      variant: dto.variant,
      iconKey: dto.icon_key,
    };
  }

  static chartToDomain(dto: DashboardChartCardApiDto): DashboardChartCard {
    return {
      id: dto.id,
      title: dto.title,
      description: dto.description,
      highlightBadge: dto.highlight_badge,
      timestamp: dto.timestamp,
      chartType: dto.chart_type,
      variant: dto.variant,
      points: dto.points.map((point) => ({
        label: point.label,
        value: point.value,
      })),
    };
  }

  static projectToDomain(dto: DashboardProjectItemApiDto): DashboardProjectItem {
    const normalizedCompletion = Math.min(100, Math.max(0, dto.completion));
    return {
      id: dto.id,
      companyName: dto.company_name,
      companyShortCode: dto.company_short_code,
      logoTone: dto.logo_tone,
      members: dto.members.map((member) => ({
        id: member.id,
        name: member.name,
        initials: member.initials,
        role: member.role,
        tone: member.tone,
      })),
      budget: dto.budget,
      completion: normalizedCompletion,
      status: normalizedCompletion >= 100 ? 'completed' : 'in-progress',
    };
  }

  static orderEventToDomain(dto: DashboardOrderEventApiDto): DashboardOrderEvent {
    return {
      id: dto.id,
      title: dto.title,
      timestamp: dto.timestamp,
      iconKey: dto.icon_key,
      tone: dto.tone,
    };
  }

  static toDomain(dto: DashboardOverviewApiResponseDto): DashboardOverviewData {
    return {
      kpis: dto.kpis.map(DashboardMapper.kpiToDomain),
      charts: dto.charts.map(DashboardMapper.chartToDomain),
      projects: dto.projects.map(DashboardMapper.projectToDomain),
      projectsDoneThisMonth: dto.projects_done_this_month,
      ordersOverview: dto.orders_overview.map(DashboardMapper.orderEventToDomain),
      ordersGrowthPercent: dto.orders_growth_percent,
    };
  }
}

