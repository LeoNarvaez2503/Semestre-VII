import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UserService } from '../../../infrastructure/api/user.service';
import { Role } from '../../../core/models/user.model';

@Component({
  selector: 'app-create-user-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fadeIn font-sans select-none">
      <div class="bg-white rounded-2xl shadow-2xl border border-gray-300 max-w-lg w-full p-6 space-y-4 text-gray-900">
        
        <div class="flex items-center justify-between border-b border-gray-200 pb-3">
          <h3 class="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <i class="fa-solid fa-user-plus text-amber-500"></i> Crear Nuevo Usuario
          </h3>
          <button (click)="close.emit()" class="text-gray-400 hover:text-gray-900 transition">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <form (ngSubmit)="onSubmit()" class="space-y-3.5 text-xs">
          
          <div *ngIf="modalErrorMessage" class="p-3.5 rounded-xl bg-red-50 border border-red-300 text-red-900 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <i class="fa-solid fa-circle-exclamation text-red-600"></i>
            <span>{{ modalErrorMessage }}</span>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-gray-700 font-bold mb-1">Cédula / DNI *</label>
              <input type="text" [(ngModel)]="newUser.person.dni" name="dni" required placeholder="1723456784"
                class="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 outline-none font-mono font-bold">
            </div>
            <div>
              <label class="block text-gray-700 font-bold mb-1">Correo Electrónico *</label>
              <input type="email" [(ngModel)]="newUser.person.email" name="email" required placeholder="usuario@parqueadero.com"
                class="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 outline-none">
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-gray-700 font-bold mb-1">Primer Nombre *</label>
              <input type="text" [(ngModel)]="newUser.person.first_name" name="first_name" required placeholder="Juan"
                class="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 outline-none">
            </div>
            <div>
              <label class="block text-gray-700 font-bold mb-1">Primer Apellido *</label>
              <input type="text" [(ngModel)]="newUser.person.last_name" name="last_name" required placeholder="Pérez"
                class="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 outline-none">
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-gray-700 font-bold mb-1">Contraseña de Acceso *</label>
              <input type="password" [(ngModel)]="newUser.password" name="password" required placeholder="••••••••"
                class="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 outline-none">
            </div>
            <div>
              <label class="block text-gray-700 font-bold mb-1">Teléfono Móvil</label>
              <input type="text" [(ngModel)]="newUser.person.phone" name="phone" placeholder="0991234567"
                class="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 outline-none font-mono">
            </div>
          </div>

          <!-- Roles Selection Checkboxes -->
          <div>
            <label class="block text-gray-700 font-bold mb-1.5">Asignar Roles RBAC *</label>
            <div class="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-200">
              <label *ngFor="let r of availableRoles" class="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" [checked]="isRoleSelected(r.name)" (change)="toggleRole(r.name)"
                  class="w-4 h-4 text-amber-500 rounded focus:ring-amber-500 accent-amber-500">
                <span class="font-bold text-gray-800">{{ r.name }}</span>
              </label>
            </div>
          </div>

          <button type="submit" [disabled]="submitting"
            class="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs rounded-xl shadow transition flex items-center justify-center gap-2 cursor-pointer mt-2">
            <i class="fa-solid fa-check"></i>
            {{ submitting ? 'Guardando Usuario...' : 'Confirmar Registro de Usuario' }}
          </button>
        </form>

      </div>
    </div>
  `
})
export class CreateUserModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() created = new EventEmitter<void>();

  submitting = false;
  modalErrorMessage: string | null = null;
  availableRoles: Array<{ name: string }> = [{ name: 'Cliente' }, { name: 'Administrador' }, { name: 'Operador' }];
  selectedRoleNames: string[] = ['Cliente'];

  newUser = {
    password: '',
    person: {
      dni: '',
      first_name: '',
      middle_name: '',
      last_name: '',
      second_last_name: '',
      email: '',
      phone: '',
      address: '',
      nationality: 'Ecuatoriana'
    }
  };

  private userService = inject(UserService);

  isRoleSelected(roleName: string): boolean {
    return this.selectedRoleNames.includes(roleName);
  }

  toggleRole(roleName: string): void {
    if (this.isRoleSelected(roleName)) {
      this.selectedRoleNames = this.selectedRoleNames.filter(r => r !== roleName);
    } else {
      this.selectedRoleNames.push(roleName);
    }
  }

  onSubmit(): void {
    if (!this.newUser.person.dni || !this.newUser.person.email || !this.newUser.password || this.submitting) return;

    this.submitting = true;
    this.modalErrorMessage = null;

    const payload = {
      ...this.newUser,
      roles: this.selectedRoleNames
    };

    this.userService.createUser(payload).subscribe({
      next: () => {
        this.submitting = false;
        this.created.emit();
      },
      error: err => {
        this.submitting = false;
        this.modalErrorMessage = 'Error al crear usuario: ' + (err.error?.detail || err.message);
      }
    });
  }
}
