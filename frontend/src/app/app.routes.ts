import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { About } from './features/about/about';
import { Everything } from './features/everything/everything';
import { Groceries } from './features/groceries/groceries';
import { Juice } from './features/juice/juice';
import { Contact } from './features/contact/contact';
import { Auth } from './features/auth/auth';

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
    path: 'product/:id',
    loadComponent: () =>
      import('./features/product-details/product-details')
        .then(m => m.ProductDetails)
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./features/cart/cart')
        .then(m => m.Cart)
  }
];