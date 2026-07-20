import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from '../../infrastructure/api/auth.service';

function tokenIsExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1])) as { exp?: number };
    return typeof payload.exp === 'number' && payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}

export const authGuard: CanActivateFn = (_route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const token = localStorage.getItem('access_token');
  const loginUrl = router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });

  if (!token || tokenIsExpired(token)) {
    authService.logout();
    return loginUrl;
  }

  if (authService.currentUser()) return true;

  return authService.fetchProfile().pipe(
    map(() => true),
    catchError(() => {
      authService.logout();
      return of(loginUrl);
    })
  );
};
