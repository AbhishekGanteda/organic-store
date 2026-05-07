import { Routes } from '@angular/router';
import { About } from './features/about/about';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home').then(m => m.Home)
  },
  {
    path: 'about',
    component: About
  }
];