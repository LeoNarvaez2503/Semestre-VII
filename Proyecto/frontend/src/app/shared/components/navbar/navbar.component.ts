import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../infrastructure/api/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  isUserMenuOpen = false;
  isDarkMode = false;
  showHelpModal = false;
  currentClock = '';
  private clockInterval: any;

  authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme === 'dark' || document.documentElement.classList.contains('dark');
    this.applyTheme();
    this.updateClock();
    this.clockInterval = setInterval(() => this.updateClock(), 1000);
  }

  updateClock(): void {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    const secs = String(now.getSeconds()).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    this.currentClock = `${hours}:${mins}:${secs} - ${day}/${month}/${year}`;
  }

  getInitial(): string {
    const username = this.authService.currentUser()?.username;
    return username ? username.charAt(0).toUpperCase() : 'I';
  }

  get userRoleTitle(): string {
    if (!this.authService.isAuthenticated()) return 'INVITADO';
    const roles = this.authService.userRoles();
    if (!roles || roles.length === 0) return 'CLIENTE';
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
