import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../infrastructure/api/auth.service';
import { UserService } from '../../infrastructure/api/user.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="p-4 sm:p-8 bg-[#f4f5f7] min-h-[calc(100vh-70px)] space-y-6">
      <div class="max-w-4xl mx-auto space-y-6">

        <!-- Top Header Banner matching UrbanFlow style -->
        <div class="bg-slate-900 text-white rounded-xl p-6 shadow-md border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-full bg-slate-800 border-2 border-amber-400 flex items-center justify-center text-amber-400 font-extrabold text-2xl uppercase shadow">
              {{ getInitial() }}
            </div>
            <div>
              <h2 class="text-xl sm:text-2xl font-black text-white tracking-tight">
                {{ user?.person?.first_name }} {{ user?.person?.last_name }}
              </h2>
              <p class="text-xs text-slate-300 font-mono mt-0.5">
                &#64;{{ user?.username || 'usuario' }} &bull; ID: {{ user?.id_person || '--' }}
              </p>
              <div class="flex items-center gap-2 mt-2">
                <span *ngFor="let role of userRoles" class="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-bold uppercase tracking-wider">
                  ● {{ role }}
                </span>
                <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold uppercase">
                  ✓ Cuenta Activa
                </span>
              </div>
            </div>
          </div>

          <button (click)="isEditing = !isEditing"
            class="bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold px-4 py-2 rounded-lg text-xs flex items-center gap-2 transition shadow-sm self-stretch sm:self-auto justify-center">
            <i class="fa-solid" [class.fa-pen-to-square]="!isEditing" [class.fa-xmark]="isEditing"></i>
            {{ isEditing ? 'Cancelar Edición' : 'Editar Datos Personales' }}
          </button>
        </div>

        <!-- Feedback Alert Toast -->
        <div *ngIf="successMessage" class="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-bounce">
          <i class="fa-solid fa-circle-check text-emerald-600 text-base"></i>
          <span>{{ successMessage }}</span>
        </div>

        <div *ngIf="errorMessage" class="p-4 rounded-xl bg-red-50 border border-red-300 text-red-900 text-xs font-bold flex items-center gap-2">
          <i class="fa-solid fa-circle-exclamation text-red-600 text-base"></i>
          <span>{{ errorMessage }}</span>
        </div>

        <!-- Main Card: View / Edit Form -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          
          <div class="p-5 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <h3 class="text-sm font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <i class="fa-solid fa-address-card text-amber-500"></i>
              Información de la Cuenta y Persona
            </h3>
            <span class="text-xs text-gray-500 font-semibold">
              {{ isEditing ? 'Modo Edición Activado' : 'Modo Lectura' }}
            </span>
          </div>

          <form (ngSubmit)="onSaveProfile()" class="p-6 space-y-6">
            
            <!-- Read-Only Identifiers -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-gray-100">
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Nombre de Usuario (Username)
                </label>
                <input type="text" [value]="user?.username || ''" disabled
                  class="w-full bg-gray-100 border border-gray-300 rounded-lg p-2.5 text-xs sm:text-sm font-bold text-gray-700 cursor-not-allowed" />
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Cédula / DNI Identificador
                </label>
                <input type="text" [value]="user?.person?.dni || ''" disabled
                  class="w-full bg-gray-100 border border-gray-300 rounded-lg p-2.5 text-xs sm:text-sm font-mono font-bold text-gray-700 cursor-not-allowed" />
              </div>
            </div>

            <!-- Editable Fields -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-bold text-gray-700 mb-1">
                  Primer Nombre *
                </label>
                <input type="text" [(ngModel)]="formData.first_name" name="first_name" [disabled]="!isEditing" required
                  class="w-full border border-gray-300 rounded-lg p-2.5 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-600" />
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-700 mb-1">
                  Segundo Nombre
                </label>
                <input type="text" [(ngModel)]="formData.middle_name" name="middle_name" [disabled]="!isEditing"
                  class="w-full border border-gray-300 rounded-lg p-2.5 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-600" />
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-700 mb-1">
                  Apellidos *
                </label>
                <input type="text" [(ngModel)]="formData.last_name" name="last_name" [disabled]="!isEditing" required
                  class="w-full border border-gray-300 rounded-lg p-2.5 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-600" />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-gray-700 mb-1">
                  Correo Electrónico *
                </label>
                <input type="email" [(ngModel)]="formData.email" name="email" [disabled]="!isEditing" required
                  class="w-full border border-gray-300 rounded-lg p-2.5 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-600" />
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-700 mb-1">
                  Número de Teléfono
                </label>
                <input type="text" [(ngModel)]="formData.phone" name="phone" [disabled]="!isEditing" placeholder="0991234567"
                  class="w-full border border-gray-300 rounded-lg p-2.5 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-600" />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-gray-700 mb-1">
                  Dirección de Domicilio / Empresa
                </label>
                <input type="text" [(ngModel)]="formData.address" name="address" [disabled]="!isEditing" placeholder="Av. Principal 123"
                  class="w-full border border-gray-300 rounded-lg p-2.5 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-600" />
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-700 mb-1">
                  Nacionalidad
                </label>
                <input type="text" [(ngModel)]="formData.nationality" name="nationality" [disabled]="!isEditing" placeholder="Ecuatoriana"
                  class="w-full border border-gray-300 rounded-lg p-2.5 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-600" />
              </div>
            </div>

            <!-- Form Action Footer -->
            <div *ngIf="isEditing" class="pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
              <button type="button" (click)="isEditing = false; resetForm()"
                class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold px-4 py-2.5 rounded-lg text-xs transition">
                Cancelar
              </button>
              <button type="submit" [disabled]="saving"
                class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-lg text-xs shadow transition flex items-center gap-2">
                <i class="fa-solid fa-floppy-disk"></i>
                {{ saving ? 'Guardando...' : 'Guardar Cambios' }}
              </button>
            </div>

          </form>
        </div>

      </div>
    </section>
  `
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  userRoles: string[] = [];
  isEditing = false;
  saving = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  formData = {
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    nationality: ''
  };

  authService = inject(AuthService);
  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    this.authService.fetchProfile().subscribe({
      next: user => {
        this.user = user;
        this.userRoles = this.authService.userRoles();
        this.resetForm();
        this.cdr.markForCheck();
      },
      error: err => {
        console.error('Error fetching profile:', err);
        this.cdr.markForCheck();
      }
    });
  }

  resetForm(): void {
    if (!this.user?.person) return;
    const p = this.user.person;
    this.formData = {
      first_name: p.first_name || '',
      middle_name: p.middle_name || '',
      last_name: p.last_name || '',
      email: p.email || '',
      phone: p.phone || '',
      address: p.address || '',
      nationality: p.nationality || ''
    };
  }

  getInitial(): string {
    const u = this.user?.username || this.user?.person?.first_name;
    return u ? u.charAt(0).toUpperCase() : 'U';
  }

  onSaveProfile(): void {
    if (!this.user?.id_person) return;

    this.saving = true;
    this.successMessage = null;
    this.errorMessage = null;

    const payload = {
      person: {
        first_name: this.formData.first_name.trim(),
        middle_name: this.formData.middle_name.trim() || undefined,
        last_name: this.formData.last_name.trim(),
        email: this.formData.email.trim(),
        phone: this.formData.phone.trim() || undefined,
        address: this.formData.address.trim() || undefined,
        nationality: this.formData.nationality.trim() || undefined
      }
    };

    this.userService.updateMyProfile(payload).subscribe({
      next: () => {
        this.saving = false;
        this.isEditing = false;
        this.successMessage = '¡Datos personales actualizados correctamente!';
        this.loadUserData();
        setTimeout(() => this.successMessage = null, 4000);
      },
      error: err => {
        this.saving = false;
        let msg = err.error?.detail || err.message;
        if (Array.isArray(err.error?.detail)) {
          msg = err.error.detail.map((d: any) => d.msg || d).join(', ');
        }
        this.errorMessage = 'Error al actualizar el perfil: ' + msg;
        this.cdr.markForCheck();
      }
    });
  }
}
