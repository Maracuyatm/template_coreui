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
        loadComponent: () => import('./rol.component').then(m => m.RolComponent),
        data: {
          title: 'Roles'
        }
      }
    ]
  }
];
