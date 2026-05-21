import { Injectable, inject } from '@angular/core';
import { CanMatch, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanMatch {
  private router = inject(Router);
  private authService = inject(AuthService);

  canMatch(): boolean | UrlTree {
    const user = this.authService.getCurrentUser();
    if (this.authService.isLoggedIn() && user?.role === 'admin') {
      return true;
    }

    return this.router.parseUrl('/auth?redirect=/admin');
  }
}
