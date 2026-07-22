import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CreateUserModalComponent } from './components/create-user-modal.component';
import { CreateRoleModalComponent } from './components/create-role-modal.component';

import { UserService } from '../../infrastructure/api/user.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-users-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CreateUserModalComponent,
    CreateRoleModalComponent
  ],
  templateUrl: './users-admin.component.html',
  styleUrl: './users-admin.component.css'
})
export class UsersAdminComponent implements OnInit {
  users: User[] = [];
  loading = true;
  showCreateUserModal = false;
  showCreateRoleModal = false;

  notificationMessage = '';
  notificationType: 'success' | 'error' = 'success';

  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
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
        this.showNotification('Error al cargar usuarios: ' + (err.error?.detail || err.message), 'error');
      }
    });
  }

  getRoleList(rolesObj: any): string[] {
    if (!rolesObj) return ['Cliente'];
    if (Array.isArray(rolesObj)) {
      return rolesObj.map(r => typeof r === 'string' ? r : r.name);
    }
    return ['Cliente'];
  }

  onUserCreated(): void {
    this.showCreateUserModal = false;
    this.showNotification('¡Usuario creado y asignado correctamente!', 'success');
    this.loadUsers();
  }

  onRoleCreated(): void {
    this.showCreateRoleModal = false;
    this.showNotification('¡Nuevo Rol de Sistema creado exitosamente!', 'success');
  }

  onDeleteUser(personId: string): void {
    if (!confirm('¿Desea eliminar permanentemente este usuario?')) return;

    this.userService.deleteUser(personId).subscribe({
      next: () => {
        this.showNotification('Usuario eliminado del sistema.', 'success');
        this.loadUsers();
      },
      error: err => this.showNotification('Error al eliminar usuario: ' + (err.error?.detail || err.message), 'error')
    });
  }

  private showNotification(msg: string, type: 'success' | 'error'): void {
    this.notificationMessage = msg;
    this.notificationType = type;
    this.cdr.markForCheck();
    setTimeout(() => {
      this.notificationMessage = '';
      this.cdr.markForCheck();
    }, 6000);
  }
}
