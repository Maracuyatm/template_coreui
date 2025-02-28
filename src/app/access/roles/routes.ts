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
        loadComponent: () => import('./roles.component').then(m => m.RolesComponent),
        data: {
          title: 'Roles'
        }
      }
    ]
  }
];
