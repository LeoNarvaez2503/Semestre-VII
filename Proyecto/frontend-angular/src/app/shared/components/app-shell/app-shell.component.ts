import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <div class="min-h-screen bg-[#f4f5f7] text-slate-900 font-sans flex flex-col">
      <app-navbar />
      <main class="flex-1 w-full overflow-x-hidden">
        <router-outlet />
      </main>
      <footer class="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500 font-medium">
        UrbanFlow Logistics Dashboard &copy; 2026 &bull; Sistema de Control Operativo de Parqueadero
      </footer>
    </div>
  `
})
export class AppShellComponent {}
