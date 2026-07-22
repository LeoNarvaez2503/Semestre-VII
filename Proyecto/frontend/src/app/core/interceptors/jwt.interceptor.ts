import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const isPublicRegistration = req.method === 'POST' && /\/usuario\/crear\/?(?:\?|$)/.test(req.url);
  const token = localStorage.getItem('access_token');

  let requestToHandler = req;
  if (token && !isPublicRegistration) {
    requestToHandler = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(requestToHandler).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/login')) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_roles');
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
