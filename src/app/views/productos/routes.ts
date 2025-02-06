import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: ''
    },
    children: [
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full'
      },
      {
        path: '',
        loadComponent: () => import('./productos.component').then(m => m.ProductosComponent),
        data: {
          title: 'Productos'
        }
      }
    ]
  }
];
