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
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
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
