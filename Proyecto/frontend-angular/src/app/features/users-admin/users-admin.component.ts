import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UserService } from '../../infrastructure/api/user.service';
import { User, Role } from '../../core/models/user.model';

@Component({
  selector: 'app-users-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="feature-dark min-h-[calc(100vh-73px)] p-4 sm:p-6 space-y-6">
          
          <!-- Header Bar -->
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h2 class="text-2xl font-extrabold text-white flex items-center gap-2">
                <i class="fa-solid fa-users-gear text-purple-400"></i> Administración de Usuarios y Roles (RBAC)
              </h2>
              <p class="text-xs text-slate-400 mt-1">
                Control de usuarios, datos personales (DNI, Nombres, Correo) y asignación de roles.
              </p>
            </div>

            <button (click)="showCreateUserModal = true"
              class="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/20 flex items-center gap-2 transition-all">
              <i class="fa-solid fa-user-plus"></i> Crear Nuevo Usuario
            </button>
          </div>

          <!-- Users Table -->
          <div class="glass-card border border-slate-800 overflow-hidden">
            <div class="p-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
              <h3 class="text-xs font-bold text-slate-200 uppercase tracking-wider">Usuarios del Sistema</h3>
              <span class="text-[10px] font-mono text-slate-400">{{ users.length }} Registrados</span>
            </div>

            <div *ngIf="loading" class="text-center py-12 text-xs text-slate-400 font-mono">
              <i class="fa-solid fa-circle-notch fa-spin text-purple-400 text-2xl mb-2"></i>
              <p>Cargando lista de usuarios...</p>
            </div>

            <div *ngIf="!loading && users.length > 0" class="overflow-x-auto">
              <table class="w-full text-left text-xs text-slate-300">
                <thead class="bg-slate-950 text-[10px] font-mono uppercase text-slate-400 border-b border-slate-800">
                  <tr>
                    <th class="p-3.5">Usuario</th>
                    <th class="p-3.5">Persona / DNI</th>
                    <th class="p-3.5">Correo Electrónico</th>
                    <th class="p-3.5">Roles Asignados</th>
                    <th class="p-3.5">Estado</th>
                    <th class="p-3.5 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-800/60">
                  <tr *ngFor="let u of users" class="hover:bg-slate-900/50 transition-all">
                    <td class="p-3.5 font-bold font-mono text-cyan-400">{{ u.username }}</td>
                    <td class="p-3.5">
                      <div class="font-semibold text-slate-200">{{ u.person?.first_name }} {{ u.person?.last_name }}</div>
                      <div class="text-[10px] text-slate-500 font-mono">DNI: {{ u.person?.dni }}</div>
                    </td>
                    <td class="p-3.5 font-mono text-slate-400">{{ u.person?.email }}</td>
                    <td class="p-3.5">
                      <div class="flex flex-wrap gap-1">
                        <span *ngFor="let r of getRoleList(u.roles || u.user_roles)"
                          class="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase"
                          [class.bg-purple-950]="r === 'Root'" [class.text-purple-300]="r === 'Root'" [class.border]="r === 'Root'" [class.border-purple-800]="r === 'Root'"
                          [class.bg-blue-950]="r === 'Administrador'" [class.text-blue-300]="r === 'Administrador'" [class.border]="r === 'Administrador'" [class.border-blue-800]="r === 'Administrador'"
                          [class.bg-slate-800]="r === 'Cliente'" [class.text-slate-300]="r === 'Cliente'">
                          {{ r }}
                        </span>
                      </div>
                    </td>
                    <td class="p-3.5">
                      <span class="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-emerald-950 text-emerald-400 border border-emerald-800" *ngIf="u.active">
                        Activo
                      </span>
                      <span class="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-red-950 text-red-400 border border-red-800" *ngIf="!u.active">
                        Inactivo
                      </span>
                    </td>
                    <td class="p-3.5 text-right">
                      <button (click)="onDeleteUser(u.id_person)" [disabled]="u.username === 'root'"
                        class="px-2.5 py-1 bg-red-950 hover:bg-red-900 text-red-400 border border-red-800 rounded-lg text-[10px] font-bold transition-all disabled:opacity-30">
                        Eliminar
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Create User Modal -->
          <div *ngIf="showCreateUserModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
            <div class="glass-card max-w-lg w-full p-6 border border-slate-700 shadow-2xl space-y-4">
              <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 class="text-sm font-bold text-white flex items-center gap-2">
                  <i class="fa-solid fa-user-plus text-purple-400"></i> Crear Usuario
                </h3>
                <button (click)="showCreateUserModal = false" class="text-slate-400 hover:text-white">
                  <i class="fa-solid fa-xmark text-lg"></i>
                </button>
              </div>

              <form (ngSubmit)="onCreateUser()" class="space-y-3 text-xs">
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-slate-300 mb-1 font-semibold">DNI (10 dígitos)</label>
                    <input type="text" [(ngModel)]="newUser.person.dni" name="dni" required placeholder="1723456784"
                      class="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 outline-none font-mono">
                  </div>
                  <div>
                    <label class="block text-slate-300 mb-1 font-semibold">Correo Electrónico</label>
                    <input type="email" [(ngModel)]="newUser.person.email" name="email" required placeholder="usuario@parqueadero.com"
                      class="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 outline-none">
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-slate-300 mb-1 font-semibold">Primer Nombre</label>
                    <input type="text" [(ngModel)]="newUser.person.first_name" name="first_name" required placeholder="Jordan"
                      class="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 outline-none">
                  </div>
                  <div>
                    <label class="block text-slate-300 mb-1 font-semibold">Primer Apellido</label>
                    <input type="text" [(ngModel)]="newUser.person.last_name" name="last_name" required placeholder="Narvaez"
                      class="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 outline-none">
                  </div>
                </div>

                <div>
                  <label class="block text-slate-300 mb-1 font-semibold">Contraseña</label>
                  <input type="password" [(ngModel)]="newUser.password" name="password" required placeholder="••••••••"
                    class="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 outline-none">
                </div>

                <div>
                  <label class="block text-slate-300 mb-1 font-semibold">Rol Asignado</label>
                  <select [(ngModel)]="selectedRole" name="selectedRole" required
                    class="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 outline-none">
                    <option *ngFor="let role of roles" [value]="role.name">{{ role.name }}</option>
                  </select>
                </div>

                <button type="submit" 
                  class="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 font-bold text-white rounded-xl shadow-lg shadow-purple-500/20">
                  Guardar Usuario
                </button>
              </form>
            </div>
          </div>

    </section>
  `
})
export class UsersAdminComponent implements OnInit {
  users: User[] = [];
  roles: Role[] = [];
  loading = true;
  showCreateUserModal = false;
  selectedRole = 'Cliente';

  newUser = {
    password: '',
    person: {
      dni: '',
      email: '',
      first_name: '',
      last_name: '',
      middle_name: '',
      nationality: '',
            phone: '',
            address: ''
    },
    roles: ['Cliente']
  };

  private userService = inject(UserService);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: data => {
        this.users = data;
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.loading = false;
      }
    });

    this.userService.getRoles().subscribe({
      next: data => this.roles = data,
      error: err => console.error(err)
    });
  }

  getRoleList(roles?: any[]): string[] {
    if (!roles) return [];
    return roles.map(role => {
      if (typeof role === 'string') return role;
      const value = role.role ?? role;
      return typeof value === 'string' ? value : value.name;
    }).filter(Boolean);
  }

  onCreateUser(): void {
    if (!this.newUser.person.dni || !this.newUser.person.email || !this.newUser.password) return;
    this.newUser.roles = [this.selectedRole];
    this.userService.createUser(this.newUser).subscribe({
      next: () => {
        this.showCreateUserModal = false;
        this.loadData();
      },
      error: err => alert('Error al crear usuario: ' + (err.error?.detail || err.message))
    });
  }

  onDeleteUser(id: string): void {
    if (!confirm('¿Deseas eliminar este usuario?')) return;
    this.userService.deleteUser(id).subscribe({
      next: () => this.loadData(),
      error: err => alert('Error al eliminar usuario: ' + (err.error?.detail || err.message))
    });
  }
}
