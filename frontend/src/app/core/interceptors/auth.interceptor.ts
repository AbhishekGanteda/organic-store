import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

import { AuthService } from '../services/auth';

const shouldIgnoreAuthError = (url: string): boolean => {
  return url.includes('/auth/login') || url.includes('/auth/register');
};

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    tap({
      error: (error: unknown) => {
        if (shouldIgnoreAuthError(req.url)) {
          return;
        }

        if (error instanceof HttpErrorResponse && error.status === 401) {
          authService.logout();

          if (!router.url.startsWith('/auth')) {
            router.navigateByUrl('/auth?mode=signin');
          }
        }
      }
    })
  );
};