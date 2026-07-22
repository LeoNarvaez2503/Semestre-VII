import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../infrastructure/api/auth.service';

export const roleGuard: CanActivateFn = route => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const allowedRoles = (route.data?.['roles'] as string[] | undefined) ?? [];
  const hasPermission = allowedRoles.some(role => authService.hasRole(role));

  return hasPermission ? true : router.parseUrl('/dashboard');
};
