import { Injectable, inject } from '@angular/core';
import { CanMatch, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanMatch {
  private router = inject(Router);
  private authService = inject(AuthService);

  canMatch(route: Route, segments: UrlSegment[]): boolean | UrlTree {
    if (this.authService.isLoggedIn()) {
      return true;
    }

    const attemptedPath = segments.map(segment => segment.path).join('/');
    const redirectPath = attemptedPath ? `/${attemptedPath}` : `/${route.path ?? ''}`;

    return this.router.parseUrl(`/auth?redirect=${encodeURIComponent(redirectPath)}`);
  }
}
