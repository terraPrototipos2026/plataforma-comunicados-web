import { createElement, lazy } from 'react';
import type { RouteObject } from 'react-router';
import { ProtectedRoute } from '../../../../core/router/protected-route';

const dashboardPageLazy = lazy(() => import('../pages/dashboard.page'));

export const dashboardRoutes: RouteObject[] = [
  {
    element: createElement(ProtectedRoute),
    children: [
      {
        path: '/dashboard',
        element: createElement(dashboardPageLazy),
      },
    ],
  },
];

