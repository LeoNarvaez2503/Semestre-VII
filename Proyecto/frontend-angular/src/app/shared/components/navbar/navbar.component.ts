import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../infrastructure/api/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="bg-slate-900 text-white shadow-xl border-b border-slate-800 select-none sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16 gap-4">
          
          <!-- Logo & Brand matching Login Page -->
          <div class="flex items-center gap-3">
            <a routerLink="/dashboard" (click)="isUserMenuOpen = false" class="flex items-center gap-2.5 group">
              <div class="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 group-hover:border-amber-400 text-white group-hover:text-amber-400 flex items-center justify-center shadow-md transition">
                <span class="material-symbols-outlined text-xl" style="font-variation-settings: 'FILL' 1;">directions_car</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-xl font-black text-white group-hover:text-amber-400 tracking-tight transition">UrbanFlow</span>
                <span class="text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-800 border border-slate-700/80 px-2.5 py-0.5 rounded-full hidden sm:inline-block">
                  Logistics
                </span>
              </div>
            </a>
          </div>

          <!-- Navigation Tabs - Spanish labels with login-style pills -->
          <nav class="hidden md:flex items-center gap-1 lg:gap-2">
            <a routerLink="/dashboard" (click)="isUserMenuOpen = false" routerLinkActive="bg-amber-400 text-slate-950 font-black shadow-md"
              class="px-3.5 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all text-slate-300 hover:text-white hover:bg-slate-800">
              VISTA PARQUEADERO
            </a>

            <a routerLink="/parking-map" (click)="isUserMenuOpen = false" routerLinkActive="bg-amber-400 text-slate-950 font-black shadow-md"
              class="px-3.5 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all text-slate-300 hover:text-white hover:bg-slate-800">
              MAPA DE ESPACIOS
            </a>

            <a routerLink="/tickets" (click)="isUserMenuOpen = false" routerLinkActive="bg-amber-400 text-slate-950 font-black shadow-md"
              class="px-3.5 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all text-slate-300 hover:text-white hover:bg-slate-800">
              GESTIÓN DE TICKETS
            </a>

            <a routerLink="/vehicles" (click)="isUserMenuOpen = false" routerLinkActive="bg-amber-400 text-slate-950 font-black shadow-md"
              class="px-3.5 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all text-slate-300 hover:text-white hover:bg-slate-800">
              MIS VEHÍCULOS
            </a>

            <!-- Admin Extra Menu Items -->
            <ng-container *ngIf="authService.hasRole('Administrador') || authService.hasRole('Root')">
              <a routerLink="/zones" (click)="isUserMenuOpen = false" routerLinkActive="bg-amber-400 text-slate-950 font-black shadow-md"
                class="px-3 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all text-slate-300 hover:text-white hover:bg-slate-800">
                ZONAS
              </a>
              <a routerLink="/users-admin" (click)="isUserMenuOpen = false" routerLinkActive="bg-amber-400 text-slate-950 font-black shadow-md"
                class="px-3 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all text-slate-300 hover:text-white hover:bg-slate-800">
                ROLES
              </a>
            </ng-container>
          </nav>

          <!-- Right Profile Badge & Actions -->
          <div class="flex items-center gap-3 relative">
            
            <!-- Quick Ticket Action Button -->
            <a routerLink="/tickets" (click)="isUserMenuOpen = false"
              class="bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm">
              <i class="fa-solid fa-plus font-bold"></i>
              <span class="hidden sm:inline">Nuevo Ticket</span>
            </a>

            <!-- Live SSE Status Indicator -->
            <div class="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700/80 text-emerald-400 text-xs font-medium">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>En Línea</span>
            </div>

            <!-- Profile Badge with Dropdown Trigger -->
            <button type="button" (click)="isUserMenuOpen = !isUserMenuOpen" title="Opciones de Usuario"
              class="flex items-center gap-2.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-400 px-3 py-1.5 rounded-2xl transition group cursor-pointer shadow-sm">
              <div class="w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-black flex items-center justify-center text-xs uppercase shadow-sm">
                {{ getInitial() }}
              </div>
              <div class="hidden sm:flex flex-col text-left">
                <span class="text-xs font-black text-white group-hover:text-amber-400 leading-tight truncate max-w-[110px]">
                  {{ authService.currentUser()?.username || 'lvnarvaez' }}
                </span>
                <span class="text-[9px] font-extrabold tracking-wider text-amber-400 uppercase truncate max-w-[110px]">
                  {{ userRoleTitle }}
                </span>
              </div>
              <i class="fa-solid fa-chevron-down text-slate-400 text-xs transition-transform" [class.rotate-180]="isUserMenuOpen"></i>
            </button>

            <!-- Dropdown Menu -->
            <div *ngIf="isUserMenuOpen"
              class="absolute right-0 top-14 w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden text-gray-900 z-50 animate-fadeIn font-sans">
              
              <!-- Dropdown User Info Header -->
              <div class="p-4 bg-slate-900 text-white border-b border-slate-800">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center shadow">
                    {{ getInitial() }}
                  </div>
                  <div class="flex flex-col truncate">
                    <span class="text-sm font-extrabold text-white truncate">
                      {{ authService.currentUser()?.person?.first_name || authService.currentUser()?.username || 'Usuario' }}
                    </span>
                    <span class="text-[10px] text-amber-400 font-bold uppercase tracking-wider truncate">
                      ● {{ userRoleTitle }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Menu Items List -->
              <div class="py-2 text-xs">
                
                <!-- Option 1: Ver Mis Datos -->
                <a routerLink="/profile" (click)="isUserMenuOpen = false"
                  class="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition group">
                  <div class="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition">
                    <i class="fa-solid fa-user-gear text-sm"></i>
                  </div>
                  <div>
                    <div class="font-extrabold text-gray-900 group-hover:text-amber-700">Ver mis datos (Perfil)</div>
                    <div class="text-[10px] text-gray-500 font-medium">Cédula, nombre, correo, teléfono y dirección</div>
                  </div>
                </a>

                <!-- Option 2: Recibos y Tickets -->
                <a routerLink="/tickets" (click)="isUserMenuOpen = false"
                  class="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition group">
                  <div class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition">
                    <i class="fa-solid fa-receipt text-sm"></i>
                  </div>
                  <div>
                    <div class="font-extrabold text-gray-900 group-hover:text-emerald-700">Mis tickets y recibos</div>
                    <div class="text-[10px] text-gray-500 font-medium">Comprobantes de pago e historial de parqueo</div>
                  </div>
                </a>

                <!-- Option 3: Personalizar Tema (Claro / Oscuro) -->
                <button type="button" (click)="toggleTheme()"
                  class="w-full text-left flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition group">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition">
                      <i class="fa-solid" [class.fa-sun]="isDarkMode" [class.fa-moon]="!isDarkMode"></i>
                    </div>
                    <div>
                      <div class="font-extrabold text-gray-900">Personalizar Tema</div>
                      <div class="text-[10px] text-gray-500 font-medium">
                        {{ isDarkMode ? 'Modo Oscuro Activo' : 'Modo Claro Activo' }}
                      </div>
                    </div>
                  </div>
                  <span class="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {{ isDarkMode ? 'Oscuro' : 'Claro' }}
                  </span>
                </button>

              </div>

              <!-- Menu Footer / Logout -->
              <div class="p-2 border-t border-gray-100 bg-gray-50">
                <button (click)="logout(); isUserMenuOpen = false"
                  class="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-extrabold text-xs transition">
                  <i class="fa-solid fa-right-from-bracket"></i>
                  Cerrar Sesión
                </button>
              </div>

            </div>

          </div>
        </div>

        <!-- Mobile Sub-Menu -->
        <div class="md:hidden flex overflow-x-auto gap-2 py-2 border-t border-slate-800 text-xs font-bold scrollbar-none">
          <a routerLink="/dashboard" (click)="isUserMenuOpen = false" routerLinkActive="bg-amber-400 text-slate-950 font-black"
            class="whitespace-nowrap px-3 py-1.5 rounded-lg text-slate-300 bg-slate-800">
            VISTA PARQUEADERO
          </a>
          <a routerLink="/parking-map" (click)="isUserMenuOpen = false" routerLinkActive="bg-amber-400 text-slate-950 font-black"
            class="whitespace-nowrap px-3 py-1.5 rounded-lg text-slate-300 bg-slate-800">
            MAPA DE ESPACIOS
          </a>
          <a routerLink="/tickets" (click)="isUserMenuOpen = false" routerLinkActive="bg-amber-400 text-slate-950 font-black"
            class="whitespace-nowrap px-3 py-1.5 rounded-lg text-slate-300 bg-slate-800">
            GESTIÓN DE TICKETS
          </a>
          <a routerLink="/vehicles" (click)="isUserMenuOpen = false" routerLinkActive="bg-amber-400 text-slate-950 font-black"
            class="whitespace-nowrap px-3 py-1.5 rounded-lg text-slate-300 bg-slate-800">
            MIS VEHÍCULOS
          </a>
        </div>

      </div>
    </header>
  `
})
export class NavbarComponent implements OnInit {
  isUserMenuOpen = false;
  isDarkMode = false;

  authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme === 'dark' || document.documentElement.classList.contains('dark');
    this.applyTheme();
  }

  getInitial(): string {
    const username = this.authService.currentUser()?.username;
    return username ? username.charAt(0).toUpperCase() : 'L';
  }

  get userRoleTitle(): string {
    const roles = this.authService.userRoles();
    if (!roles || roles.length === 0) return 'LOGISTICS MANAGER';
    const mainRole = roles[0];
    if (mainRole === 'Root' || mainRole === 'Administrador') return 'LOGISTICS MANAGER';
    return mainRole.toUpperCase();
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    this.applyTheme();
  }

  private applyTheme(): void {
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
