import { Injectable, inject } from '@angular/core';
import { CanMatch, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanMatch {
  private router = inject(Router);
  private authService = inject(AuthService);

  canMatch(): boolean | UrlTree {
    if (this.authService.isLoggedIn()) {
      return true;
    }

    return this.router.parseUrl('/auth?redirect=/cart');
  }
}
