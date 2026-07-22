import { Component, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UserService } from '../../../infrastructure/api/user.service';
import { Role } from '../../../core/models/user.model';
import { COUNTRIES_LIST, VALID_NATIONALITIES } from '../../../core/constants/countries.constant';

@Component({
  selector: 'app-create-user-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-user-modal.component.html',
  styleUrl: './create-user-modal.component.css'
})
export class CreateUserModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() created = new EventEmitter<void>();

  countries = COUNTRIES_LIST;
  submitting = false;
  modalErrorMessage: string | null = null;
  availableRoles: Array<{ name: string }> = [{ name: 'Cliente' }, { name: 'Administrador' }, { name: 'Operador' }];
  selectedRoleNames: string[] = ['Cliente'];

  newUser = {
    password: '',
    person: {
      dni: '',
      first_name: '',
      middle_name: '',
      last_name: '',
      email: '',
      phone: '',
      address: '',
      nationality: 'Ecuatoriana'
    }
  };

  private userService = inject(UserService);

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.userService.getRoles().subscribe({
      next: roles => {
        if (roles && roles.length > 0) {
          this.availableRoles = roles.map(r => ({ name: r.name }));
        }
      },
      error: () => {
        // Fallback default roles
      }
    });
  }

  isRoleSelected(roleName: string): boolean {
    return this.selectedRoleNames.includes(roleName);
  }

  toggleRole(roleName: string): void {
    if (this.isRoleSelected(roleName)) {
      this.selectedRoleNames = this.selectedRoleNames.filter(r => r !== roleName);
    } else {
      this.selectedRoleNames.push(roleName);
    }
  }

  onSubmit(): void {
    if (!this.newUser.person.dni || !this.newUser.person.email || !this.newUser.person.first_name || !this.newUser.person.last_name || !this.newUser.password || this.submitting) {
      this.modalErrorMessage = 'Por favor completa todos los campos requeridos (*).';
      return;
    }

    if (!VALID_NATIONALITIES.includes(this.newUser.person.nationality)) {
      this.modalErrorMessage = 'Debe elegir una nacionalidad de la lista permitida.';
      return;
    }

    this.submitting = true;
    this.modalErrorMessage = null;

    const personClean: Record<string, string> = {
      dni: this.newUser.person.dni.trim(),
      email: this.newUser.person.email.trim().toLowerCase(),
      first_name: this.newUser.person.first_name.trim(),
      last_name: this.newUser.person.last_name.trim(),
      nationality: this.newUser.person.nationality
    };

    if (this.newUser.person.middle_name?.trim()) {
      personClean['middle_name'] = this.newUser.person.middle_name.trim();
    }
    if (this.newUser.person.phone?.trim()) {
      personClean['phone'] = this.newUser.person.phone.trim();
    }
    if (this.newUser.person.address?.trim()) {
      personClean['address'] = this.newUser.person.address.trim();
    }

    const payload = {
      password: this.newUser.password,
      person: personClean,
      roles: this.selectedRoleNames
    };

    this.userService.createUser(payload).subscribe({
      next: () => {
        this.submitting = false;
        this.created.emit();
      },
      error: err => {
        this.submitting = false;
        const detail = err.error?.detail;
        if (Array.isArray(detail)) {
          this.modalErrorMessage = 'Error al crear usuario: ' + detail.map(d => d.msg).join(' ');
        } else {
          this.modalErrorMessage = 'Error al crear usuario: ' + (detail || err.message);
        }
      }
    });
  }
}
