import type { DashboardOverviewData } from '../../domain/models/dashboard.model';
import type { DashboardRepository } from '../../domain/ports/dashboard.repository';

export class GetDashboardOverviewUseCase {
  private readonly repository: DashboardRepository;

  constructor(repository: DashboardRepository) {
    this.repository = repository;
  }

  async execute(): Promise<DashboardOverviewData> {
    return this.repository.getOverview();
  }
}

