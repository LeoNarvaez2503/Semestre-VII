import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../infrastructure/api/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <button *ngIf="open" type="button" aria-label="Cerrar menú" (click)="closeMenu.emit()"
      class="fixed inset-0 z-40 bg-slate-950/60 lg:hidden"></button>
    <aside class="fixed top-0 left-0 z-50 h-full w-[280px] flex flex-col py-6 bg-[#000000] transition-transform duration-200 lg:translate-x-0"
      [class.translate-x-0]="open" [class.-translate-x-full]="!open">
      <!-- Brand Header -->
      <div class="px-6 mb-10 flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-[#131b2e] flex items-center justify-center">
          <span class="material-symbols-outlined text-white" style="font-variation-settings: 'FILL' 1;">directions_car</span>
        </div>
        <div>
          <h1 class="text-2xl font-black text-white tracking-tight">UrbanFlow</h1>
          <p class="text-xs text-[#bec6e0] opacity-70 uppercase tracking-wider">Parking Management</p>
        </div>
      </div>

      <!-- Nav Items -->
      <nav class="flex-grow flex flex-col gap-1">
        <a routerLink="/dashboard" (click)="closeMenu.emit()" routerLinkActive="bg-[#3f465c] text-white"
          class="mx-2 flex items-center gap-3 px-4 py-3 rounded-lg text-[#bec6e0] hover:text-white hover:bg-[#3f465c]/50 transition-all text-xs font-semibold uppercase tracking-wider">
          <span class="material-symbols-outlined" style="font-size: 20px;">dashboard</span>
          Vista Parqueadero
        </a>
        <a routerLink="/parking-map" (click)="closeMenu.emit()" routerLinkActive="bg-[#3f465c] text-white"
          class="mx-2 flex items-center gap-3 px-4 py-3 rounded-lg text-[#bec6e0] hover:text-white hover:bg-[#3f465c]/50 transition-all text-xs font-semibold uppercase tracking-wider">
          <span class="material-symbols-outlined" style="font-size: 20px;">local_parking</span>
          Mapa de Espacios
        </a>
        <a routerLink="/tickets" (click)="closeMenu.emit()" routerLinkActive="bg-[#3f465c] text-white"
          class="mx-2 flex items-center gap-3 px-4 py-3 rounded-lg text-[#bec6e0] hover:text-white hover:bg-[#3f465c]/50 transition-all text-xs font-semibold uppercase tracking-wider">
          <span class="material-symbols-outlined" style="font-size: 20px;">receipt_long</span>
          Gestión de Tickets
        </a>
        <a routerLink="/vehicles" (click)="closeMenu.emit()" routerLinkActive="bg-[#3f465c] text-white"
          class="mx-2 flex items-center gap-3 px-4 py-3 rounded-lg text-[#bec6e0] hover:text-white hover:bg-[#3f465c]/50 transition-all text-xs font-semibold uppercase tracking-wider">
          <span class="material-symbols-outlined" style="font-size: 20px;">directions_car</span>
          Mis Vehículos
        </a>

        <div *ngIf="authService.hasRole('Administrador') || authService.hasRole('Root')" class="mt-4 pt-4 border-t border-[#3f465c]/30 mx-2 space-y-1">
          <a routerLink="/zones" (click)="closeMenu.emit()" routerLinkActive="bg-[#3f465c] text-white"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-[#bec6e0] hover:text-white hover:bg-[#3f465c]/50 transition-all text-xs font-semibold uppercase tracking-wider">
            <span class="material-symbols-outlined" style="font-size: 20px;">map</span>
            Gestión de Zonas
          </a>
          <a routerLink="/assignments" (click)="closeMenu.emit()" routerLinkActive="bg-[#3f465c] text-white"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-[#bec6e0] hover:text-white hover:bg-[#3f465c]/50 transition-all text-xs font-semibold uppercase tracking-wider">
            <span class="material-symbols-outlined" style="font-size: 20px;">assignment_ind</span>
            Asignaciones
          </a>
          <a routerLink="/users-admin" (click)="closeMenu.emit()" routerLinkActive="bg-[#3f465c] text-white"
            class="mx-0 flex items-center gap-3 px-4 py-3 rounded-lg text-[#bec6e0] hover:text-white hover:bg-[#3f465c]/50 transition-all text-xs font-semibold uppercase tracking-wider">
            <span class="material-symbols-outlined" style="font-size: 20px;">lock_person</span>
            Roles y Permisos
          </a>
        </div>
      </nav>

      <!-- Footer Profile -->
      <div class="mt-auto px-4 border-t border-[#3f465c]/30 pt-6">
        <div class="flex items-center gap-3 px-2 mb-6">
          <div class="w-10 h-10 rounded-full bg-[#3f465c] flex items-center justify-center font-bold text-white text-base uppercase">
            {{ getInitial() }}
          </div>
          <div class="flex flex-col">
            <span class="text-white text-xs font-semibold truncate max-w-[150px]">{{ authService.currentUser()?.username || 'Usuario' }}</span>
            <span class="text-[#bec6e0] text-[10px] uppercase tracking-wider truncate max-w-[150px]">
              {{ authService.userRoles()?.[0] || 'Sin Rol' }}
            </span>
          </div>
        </div>
        <button (click)="logout()"
          class="w-full flex items-center justify-center gap-2 bg-[#3f465c]/20 hover:bg-[#3f465c]/40 text-white py-3 rounded-lg transition-all text-xs font-semibold uppercase tracking-wider">
          <span class="material-symbols-outlined" style="font-size: 18px;">logout</span>
          Cerrar sesión
        </button>
      </div>
    </aside>
  `
})
export class SidebarComponent {
  @Input() open = false;
  @Output() closeMenu = new EventEmitter<void>();

  authService = inject(AuthService);
  private router = inject(Router);

  getInitial(): string {
    const username = this.authService.currentUser()?.username;
    return username ? username.charAt(0).toUpperCase() : 'U';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
