import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { About } from './features/about/about';
import { Everything } from './features/everything/everything';
import { Groceries } from './features/groceries/groceries';
import { Juice } from './features/juice/juice';
import { Contact } from './features/contact/contact';
import { Auth } from './features/auth/auth';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    component: Home
  },
  {
    path: 'about',
    component: About
  },
  {
    path: 'everything',
    component: Everything,
  },
  {
    path: 'groceries',
    component: Groceries,
  },
  {
    path: 'juice',
    component: Juice,
  },
  {
    path: 'contact',
    component: Contact,
  },
  {
    path: 'auth',
    component: Auth,
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./features/profile/profile').then(m => m.Profile),
    canMatch: [AuthGuard]
  },
  {
    path: 'product/:id',
    loadComponent: () =>
      import('./features/product-details/product-details')
        .then(m => m.ProductDetails)
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./features/admin/admin')
        .then(m => m.Admin),
    canMatch: [AuthGuard, AdminGuard]
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./features/cart/cart')
        .then(m => m.Cart),
    canMatch: [AuthGuard]
  }
];