import { createElement, lazy } from 'react';
import type { RouteObject } from 'react-router';
import { PublicOnlyRoute } from '../../../../core/router/public-only-route';

const loginPageLazy = lazy(() => import('../pages/login.page'));

export const authRoutes: RouteObject[] = [
  {
    element: createElement(PublicOnlyRoute),
    children: [
      {
        path: '/login',
        element: createElement(loginPageLazy),
      },
    ],
  },
];
