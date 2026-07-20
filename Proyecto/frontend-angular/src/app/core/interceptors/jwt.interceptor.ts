import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const isPublicRegistration = req.method === 'POST' && /\/usuario\/crear\/?(?:\?|$)/.test(req.url);
  const token = localStorage.getItem('access_token');
  if (token && !isPublicRegistration) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }
  return next(req);
};
