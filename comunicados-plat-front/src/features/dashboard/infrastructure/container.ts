import { GetDashboardOverviewUseCase } from '../application/use-cases/get-dashboard-overview.use-case';
import { DashboardInMemoryRepository } from './adapters/dashboard-in-memory.repository';

const dashboardRepository = new DashboardInMemoryRepository();

export const dashboardContainer = {
  repository: dashboardRepository,
  getDashboardOverviewUseCase: new GetDashboardOverviewUseCase(dashboardRepository),
};

