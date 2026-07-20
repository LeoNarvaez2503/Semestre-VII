import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, switchMap, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginResponse, RegisterPayload, User } from '../../core/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.gatewayUrl}/usuario`;
  
  currentUser = signal<User | null>(null);
  userRoles = signal<string[]>([]);

  constructor(private http: HttpClient) {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const savedRoles = localStorage.getItem('user_roles');
    if (!savedRoles) return;

    try {
      const roles: unknown = JSON.parse(savedRoles);
      if (!Array.isArray(roles) || !roles.every(role => typeof role === 'string')) {
        throw new Error('Invalid stored roles');
      }
      this.userRoles.set(roles);
    } catch {
      localStorage.removeItem('user_roles');
      this.userRoles.set([]);
    }
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { username, password }).pipe(
      switchMap(response => {
        if (!response.access_token) {
          return throwError(() => new Error('El servidor no devolvió un token de acceso.'));
        }

        localStorage.setItem('access_token', response.access_token);
        if (response.refresh_token) {
          localStorage.setItem('refresh_token', response.refresh_token);
        } else {
          localStorage.removeItem('refresh_token');
        }

        return this.fetchProfile().pipe(map(() => response));
      }),
      catchError(error => {
        this.clearSession();
        return throwError(() => error);
      })
    );
  }

  register(payload: RegisterPayload): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/crear`, payload);
  }

  fetchProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`).pipe(
      tap(user => {
        this.currentUser.set(user);
        const directRoles = Array.isArray(user.roles)
          ? user.roles.map(role => typeof role === 'string' ? role : role.name)
          : [];
        const assignedRoles = Array.isArray(user.user_roles)
          ? user.user_roles
              .filter(userRole => userRole.active !== false)
              .map(userRole => typeof userRole.role === 'string' ? userRole.role : userRole.role.name)
          : [];
        const roles = [...new Set([...directRoles, ...assignedRoles])].filter(Boolean);
        this.userRoles.set(roles);
        localStorage.setItem('user_roles', JSON.stringify(roles));
      })
    );
  }

  logout(): void {
    this.clearSession();
  }

  private clearSession(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_roles');
    this.currentUser.set(null);
    this.userRoles.set([]);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  hasRole(roleName: string): boolean {
    const roles = this.userRoles();
    return roles.includes(roleName) || roles.includes('Root');
  }
}
