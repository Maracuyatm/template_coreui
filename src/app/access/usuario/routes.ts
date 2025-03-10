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
        loadComponent: () => import('./usuario.component').then(m => m.UsuarioComponent),
        data: {
          title: 'Usuario'
        }
      }
    ]
  }
];
