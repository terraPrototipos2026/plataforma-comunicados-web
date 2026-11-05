import { createElement, lazy } from 'react';
import type { RouteObject } from 'react-router';

const landingPageLazy = lazy(() => import('../pages/landing.page'));

export const landingRoutes: RouteObject[] = [
  {
    path: '/',
    element: createElement(landingPageLazy),
  },
];
