import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UserService } from '../../../infrastructure/api/user.service';

@Component({
  selector: 'app-create-role-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-role-modal.component.html',
  styleUrl: './create-role-modal.component.css'
})
export class CreateRoleModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() created = new EventEmitter<void>();

  roleName = '';
  roleDescription = '';
  submitting = false;
  errorMessage: string | null = null;

  private userService = inject(UserService);

  onSubmit(): void {
    if (!this.roleName.trim() || this.submitting) return;

    this.submitting = true;
    this.errorMessage = null;

    this.userService.createRole({
      name: this.roleName.trim(),
      description: this.roleDescription.trim() || undefined
    } as any).subscribe({
      next: () => {
        this.submitting = false;
        this.created.emit();
      },
      error: err => {
        this.submitting = false;
        this.errorMessage = 'Error al crear rol: ' + (err.error?.detail || err.message);
      }
    });
  }
}
