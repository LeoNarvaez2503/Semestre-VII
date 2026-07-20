import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, Role } from '../../core/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private gatewayUrl = environment.gatewayUrl;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.gatewayUrl}/usuario/listar`);
  }

  createUser(userData: any): Observable<any> {
    return this.http.post(`${this.gatewayUrl}/usuario/crear`, userData);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.gatewayUrl}/usuario/obtener/${id}`);
  }

  updateUser(id: string, userData: any): Observable<any> {
    return this.http.patch(`${this.gatewayUrl}/usuario/actualizar/${id}`, userData);
  }

  updateUserRoles(id: string, roleNames: string[]): Observable<any> {
    return this.http.put(`${this.gatewayUrl}/usuario/roles/${id}`, { roles: roleNames });
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.gatewayUrl}/usuario/eliminar/${id}`);
  }

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.gatewayUrl}/rol/listar`);
  }

  createRole(roleData: { name: string; description: string }): Observable<Role> {
    return this.http.post<Role>(`${this.gatewayUrl}/rol/crear`, roleData);
  }
}
