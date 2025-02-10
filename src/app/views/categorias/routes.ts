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
        loadComponent: () => import('./categorias.component').then(m => m.CategoriasComponent),
        data: {
          title: 'Categorias'
        }
      }
    ]
  }
];
