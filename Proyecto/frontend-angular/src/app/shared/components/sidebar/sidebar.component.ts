import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../infrastructure/api/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
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
