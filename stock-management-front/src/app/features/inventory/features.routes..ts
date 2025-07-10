import { Routes } from '@angular/router';

export const features_routes: Routes = [
  { path: 'dashboard', loadChildren: () => import('./charts/dashboard.routes').then((route) => route.dashboard_routes) },
  { path: 'products', loadChildren: () => import('./products/products.routes').then((route) => route.products_routes) },
  { path: 'stock', loadChildren: () => import('./stock-movement/stock-movement.routes').then((route) => route.stock_routes)}
];
