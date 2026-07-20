import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, SidebarComponent],
  template: `
    <div class="min-h-screen bg-[#f7f9fb]">
      <app-sidebar [open]="menuOpen" (closeMenu)="menuOpen = false" />
      <div class="min-h-screen lg:ml-[280px]">
        <app-navbar (menuToggle)="menuOpen = !menuOpen" />
        <main class="min-h-[calc(100vh-73px)] overflow-x-hidden">
          <router-outlet />
        </main>
      </div>
    </div>
  `
})
export class AppShellComponent {
  menuOpen = false;
}
