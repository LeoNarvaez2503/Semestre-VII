import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../infrastructure/api/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="sticky top-0 z-30 flex justify-between items-center w-full px-4 sm:px-8 py-4 border-b border-gray-200 bg-[#f7f9fb]/95 backdrop-blur flex-shrink-0">
      <div class="flex items-center gap-3">
        <button type="button" (click)="menuToggle.emit()" aria-label="Abrir menú"
          class="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100">
          <span class="material-symbols-outlined">menu</span>
        </button>
        <h2 class="text-lg sm:text-2xl font-bold text-black tracking-tight" id="currentViewTitle">{{ pageTitle }}</h2>
      </div>
      <div class="flex items-center gap-4">
        <!-- Connection Status -->
        <div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="text-xs font-semibold uppercase tracking-wider">Conectado</span>
        </div>

      </div>
    </header>
  `
})
export class NavbarComponent {
  @Output() menuToggle = new EventEmitter<void>();

  authService = inject(AuthService);
  private router = inject(Router);

  get pageTitle(): string {
    const url = this.router.url;
    if (url.includes('dashboard')) return 'Vista Parqueadero';
    if (url.includes('parking-map')) return 'Mapa de Espacios';
    if (url.includes('tickets')) return 'Gestión de Tickets';
    if (url.includes('vehicles')) return 'Mis Vehículos';
    if (url.includes('users-admin')) return 'Roles y Permisos';
    if (url.includes('zones')) return 'Gestión de Zonas';
    if (url.includes('assignments')) return 'Asignaciones y Trazabilidad';
    return 'UrbanFlow';
  }
}
