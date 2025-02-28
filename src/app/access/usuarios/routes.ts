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
        loadComponent: () => import('./usuarios.component').then(m => m.UsuariosComponent),
        data: {
          title: 'Usuarios'
        }
      }
    ]
  }
];
