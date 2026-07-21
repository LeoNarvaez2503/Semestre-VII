import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
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
            <span class="material-symbols-outlined text-purple-400">group_add</span>
            Administración de Usuarios y Roles (RBAC)
          </h2>
          <p class="text-xs text-slate-400 mt-1">
            Control de usuarios, datos personales (DNI, Nombres, Correo) y asignación de roles.
          </p>
        </div>

        <button (click)="openCreateUserModal()"
          class="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/20 flex items-center gap-2 transition-all cursor-pointer">
          <span class="material-symbols-outlined text-sm">person_add</span>
          Crear Nuevo Usuario
        </button>
      </div>

      <!-- Alert Notification Banner -->
      <div *ngIf="notificationMessage" 
        [class.bg-emerald-950]="notificationType === 'success'" [class.border-emerald-800]="notificationType === 'success'" [class.text-emerald-300]="notificationType === 'success'"
        [class.bg-red-950]="notificationType === 'error'" [class.border-red-800]="notificationType === 'error'" [class.text-red-300]="notificationType === 'error'"
        class="p-4 rounded-2xl border text-xs font-medium flex items-center justify-between gap-3 animate-fade-in">
        <div class="flex items-center gap-2.5">
          <span class="material-symbols-outlined text-base">
            {{ notificationType === 'success' ? 'check_circle' : 'warning' }}
          </span>
          <span>{{ notificationMessage }}</span>
        </div>
        <button (click)="notificationMessage = ''" class="hover:opacity-75">
          <span class="material-symbols-outlined text-base">close</span>
        </button>
      </div>

      <!-- Users Table -->
      <div class="glass-card border border-slate-800 overflow-hidden">
        <div class="p-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
          <h3 class="text-xs font-bold text-slate-200 uppercase tracking-wider">Usuarios del Sistema</h3>
          <span class="text-[10px] font-mono text-slate-400">{{ users.length }} Registrados</span>
        </div>

        <div *ngIf="loading" class="text-center py-12 text-xs text-slate-400 font-mono">
          <div class="inline-block animate-spin rounded-full h-6 w-6 border-2 border-purple-400 border-t-transparent mb-2"></div>
          <p>Cargando lista de usuarios...</p>
        </div>

        <div *ngIf="!loading && users.length > 0" class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-300">
            <thead class="bg-slate-950 text-[10px] font-mono uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th class="p-3.5">Usuario Generado</th>
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
                    class="px-2.5 py-1 bg-red-950 hover:bg-red-900 text-red-400 border border-red-800 rounded-lg text-[10px] font-bold transition-all disabled:opacity-30 cursor-pointer">
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
        <div class="glass-card max-w-lg w-full p-6 border border-slate-700 shadow-2xl space-y-4 animate-fade-in">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 class="text-sm font-bold text-white flex items-center gap-2">
              <span class="material-symbols-outlined text-purple-400">person_add</span>
              Crear Nuevo Usuario
            </h3>
            <button (click)="showCreateUserModal = false" class="text-slate-400 hover:text-white cursor-pointer">
              <span class="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          <form (ngSubmit)="onCreateUser()" class="space-y-3.5 text-xs">
            
            <div *ngIf="modalErrorMessage" class="p-3 rounded-xl bg-red-950/90 border border-red-800 text-red-300 text-xs flex items-center gap-2">
              <span class="material-symbols-outlined text-base text-red-400">warning</span>
              <span>{{ modalErrorMessage }}</span>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-slate-300 mb-1 font-semibold">Cédula / DNI (10 dígitos) *</label>
                <input type="text" [(ngModel)]="newUser.person.dni" name="dni" required placeholder="1723456784"
                  class="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 outline-none font-mono focus:border-purple-500">
              </div>
              <div>
                <label class="block text-slate-300 mb-1 font-semibold">Correo Electrónico *</label>
                <input type="email" [(ngModel)]="newUser.person.email" name="email" required placeholder="usuario@parqueadero.com"
                  class="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 outline-none focus:border-purple-500">
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-slate-300 mb-1 font-semibold">Primer Nombre *</label>
                <input type="text" [(ngModel)]="newUser.person.first_name" name="first_name" required placeholder="Jordan"
                  class="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 outline-none focus:border-purple-500">
              </div>
              <div>
                <label class="block text-slate-300 mb-1 font-semibold">Primer Apellido *</label>
                <input type="text" [(ngModel)]="newUser.person.last_name" name="last_name" required placeholder="Narvaez"
                  class="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 outline-none focus:border-purple-500">
              </div>
            </div>

            <div>
              <label class="block text-slate-300 mb-1 font-semibold">Contraseña (Mínimo 8 caracteres) *</label>
              <input type="password" [(ngModel)]="newUser.password" name="password" required placeholder="••••••••"
                class="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 outline-none focus:border-purple-500">
            </div>

            <div>
              <label class="block text-slate-300 mb-1 font-semibold">Rol Asignado *</label>
              <select [(ngModel)]="selectedRole" name="selectedRole" required
                class="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 outline-none focus:border-purple-500">
                <option *ngFor="let role of roles" [value]="role.name">{{ role.name }} - {{ role.description }}</option>
              </select>
            </div>

            <div class="pt-2 flex justify-end gap-2">
              <button type="button" (click)="showCreateUserModal = false"
                class="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition-all font-semibold cursor-pointer">
                Cancelar
              </button>
              <button type="submit" [disabled]="saving"
                class="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-purple-500/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50">
                <span *ngIf="saving" class="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                <span>{{ saving ? 'Registrando...' : 'Crear Usuario' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- SUCCESS MODAL FOR CREATED USER WITH GENERATED USERNAME -->
      <div *ngIf="createdUserSuccess" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4">
        <div class="glass-card max-w-md w-full p-6 border border-emerald-500/40 shadow-2xl space-y-4 text-center animate-fade-in">
          <div class="w-14 h-14 rounded-2xl bg-emerald-950 border border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto text-2xl">
            <span class="material-symbols-outlined text-3xl">check_circle</span>
          </div>
          
          <div>
            <h3 class="text-xl font-extrabold text-white">¡Usuario Creado Exitosamente!</h3>
            <p class="text-xs text-slate-400 mt-1">El backend generó automáticamente las credenciales de acceso:</p>
          </div>

          <!-- Highlight Generated Username Box -->
          <div class="p-4 rounded-2xl bg-slate-900 border border-emerald-500/30 text-left space-y-2">
            <div class="flex items-center justify-between border-b border-slate-800 pb-2">
              <span class="text-[11px] font-mono text-slate-400 uppercase">Usuario Generado:</span>
              <span class="text-sm font-bold font-mono text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded border border-cyan-800">
                {{ createdUserSuccess.username }}
              </span>
            </div>
            <div class="flex justify-between text-xs text-slate-300">
              <span class="text-slate-400">Nombre:</span>
              <span class="font-semibold">{{ createdUserSuccess.person?.first_name }} {{ createdUserSuccess.person?.last_name }}</span>
            </div>
            <div class="flex justify-between text-xs text-slate-300">
              <span class="text-slate-400">Correo:</span>
              <span class="font-mono text-slate-300">{{ createdUserSuccess.person?.email }}</span>
            </div>
            <div class="flex justify-between text-xs text-slate-300">
              <span class="text-slate-400">DNI:</span>
              <span class="font-mono text-slate-300">{{ createdUserSuccess.person?.dni }}</span>
            </div>
            <div class="flex justify-between text-xs text-slate-300">
              <span class="text-slate-400">Rol:</span>
              <span class="font-bold text-purple-400">{{ selectedRole }}</span>
            </div>
          </div>

          <button (click)="createdUserSuccess = null"
            class="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 cursor-pointer">
            Entendido
          </button>
        </div>
      </div>

    </section>
  `,
  styles: [`
    .glass-card {
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(12px);
      border-radius: 1rem;
    }
  `]
})
export class UsersAdminComponent implements OnInit {
  users: User[] = [];
  roles: Role[] = [];
  loading = true;
  saving = false;
  showCreateUserModal = false;
  selectedRole = 'Cliente';

  notificationMessage = '';
  notificationType: 'success' | 'error' = 'success';
  modalErrorMessage = '';

  createdUserSuccess: User | null = null;

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
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.cdr.markForCheck();
    this.userService.getUsers().subscribe({
      next: data => {
        this.users = data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: err => {
        console.error(err);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });

    this.userService.getRoles().subscribe({
      next: data => {
        this.roles = data;
        this.cdr.markForCheck();
      },
      error: err => console.error(err)
    });
  }

  openCreateUserModal(): void {
    this.modalErrorMessage = '';
    this.newUser = {
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
    this.showCreateUserModal = true;
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
    if (this.saving) return;

    if (!this.newUser.person.dni || !this.newUser.person.email || !this.newUser.password || !this.newUser.person.first_name || !this.newUser.person.last_name) {
      this.modalErrorMessage = 'Por favor completa todos los campos requeridos (*).';
      return;
    }

    this.saving = true;
    this.modalErrorMessage = '';
    this.newUser.roles = [this.selectedRole];

    this.userService.createUser(this.newUser).subscribe({
      next: (resUser) => {
        this.saving = false;
        this.showCreateUserModal = false;
        this.createdUserSuccess = resUser;
        this.notificationMessage = `Usuario "${resUser.username}" registrado correctamente con rol ${this.selectedRole}.`;
        this.notificationType = 'success';
        this.loadData();
      },
      error: err => {
        this.saving = false;
        console.error(err);
        this.modalErrorMessage = err.error?.detail || err.message || 'Error al registrar el usuario.';
      }
    });
  }

  onDeleteUser(id: string): void {
    if (!confirm('¿Deseas eliminar este usuario?')) return;
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.notificationMessage = 'Usuario eliminado del sistema.';
        this.notificationType = 'success';
        this.loadData();
      },
      error: err => {
        this.notificationMessage = 'Error al eliminar usuario: ' + (err.error?.detail || err.message);
        this.notificationType = 'error';
      }
    });
  }
}
