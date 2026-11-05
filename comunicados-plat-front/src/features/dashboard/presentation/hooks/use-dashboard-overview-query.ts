import { useQuery } from '@tanstack/react-query';
import { dashboardContainer } from '../../infrastructure/container';

export const dashboardKeys = {
  all: ['dashboard'] as const,
  overview: () => [...dashboardKeys.all, 'overview'] as const,
};

export function useDashboardOverviewQuery() {
  return useQuery({
    queryKey: dashboardKeys.overview(),
    queryFn: () => dashboardContainer.getDashboardOverviewUseCase.execute(),
    staleTime: 1000 * 60 * 5,
  });
}

