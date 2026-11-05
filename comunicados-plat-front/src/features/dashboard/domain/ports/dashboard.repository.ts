import type { DashboardOverviewData } from '../models/dashboard.model';

export interface DashboardRepository {
  getOverview(): Promise<DashboardOverviewData>;
}

