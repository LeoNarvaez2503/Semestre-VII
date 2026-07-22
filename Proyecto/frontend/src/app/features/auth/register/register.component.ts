import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RegisterPayload, User } from '../../../core/models/user.model';
import { AuthService } from '../../../infrastructure/api/auth.service';

import { COUNTRIES_LIST, VALID_NATIONALITIES } from '../../../core/constants/countries.constant';

function passwordsMatch(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmation = control.get('passwordConfirmation')?.value;
  return password === confirmation ? null : { passwordsMismatch: true };
}

function validNationalityValidator(control: AbstractControl): ValidationErrors | null {
  const val = control.value;
  if (!val || VALID_NATIONALITIES.includes(val)) {
    return null;
  }
  return { invalidNationality: true };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly changeDetector = inject(ChangeDetectorRef);

  countries = COUNTRIES_LIST;
  loading = false;
  showPassword = false;
  errorMessage = '';
  createdUser: User | null = null;

  readonly registerForm = this.formBuilder.nonNullable.group({
    firstName: ['', [Validators.required, Validators.maxLength(30)]],
    middleName: ['', Validators.maxLength(30)],
    lastName: ['', [Validators.required, Validators.maxLength(30)]],
    dni: ['', [Validators.required, Validators.maxLength(30)]],
    nationality: ['Ecuatoriana', [Validators.required, validNationalityValidator]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
    phone: ['', Validators.maxLength(15)],
    address: [''],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(72)]],
    passwordConfirmation: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(72)]]
  }, { validators: passwordsMatch });

  isInvalid(controlName: keyof typeof this.registerForm.controls): boolean {
    const control = this.registerForm.controls[controlName];
    return control.invalid && control.touched;
  }

  onSubmit(): void {
    // The button is disabled once change detection runs, but this guard also
    // protects against double clicks and Enter being pressed twice.
    if (this.loading || this.createdUser) return;

    this.errorMessage = '';
    this.registerForm.markAllAsTouched();

    if (this.registerForm.invalid) {
      this.errorMessage = this.registerForm.hasError('passwordsMismatch')
        ? 'Las contraseñas deben coincidir.'
        : 'Revisa los campos marcados antes de continuar.';
      return;
    }

    const value = this.registerForm.getRawValue();
    const payload: RegisterPayload = {
      password: value.password,
      person: {
        dni: value.dni.trim(),
        email: value.email.trim().toLowerCase(),
        first_name: value.firstName.trim(),
        last_name: value.lastName.trim(),
        ...this.optionalPersonFields(value)
      }
    };

    this.loading = true;
    this.authService.register(payload).subscribe({
      next: user => {
        this.loading = false;
        this.createdUser = user;
        // HttpClient callbacks do not update plain component fields by
        // themselves when zoneless change detection is enabled.
        this.changeDetector.markForCheck();
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.errorMessage = this.getErrorMessage(error);
        this.changeDetector.markForCheck();
      }
    });
  }

  private optionalPersonFields(value: ReturnType<typeof this.registerForm.getRawValue>): Partial<RegisterPayload['person']> {
    const fields: Partial<RegisterPayload['person']> = {};
    const optionalValues: Array<[keyof RegisterPayload['person'], string]> = [
      ['middle_name', value.middleName],
      ['phone', value.phone],
      ['address', value.address],
      ['nationality', value.nationality]
    ];

    for (const [key, rawValue] of optionalValues) {
      const cleanValue = rawValue.trim();
      if (cleanValue) fields[key] = cleanValue;
    }
    return fields;
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    const detail: unknown = error.error?.detail;
    if (typeof detail === 'string') return detail;

    if (Array.isArray(detail)) {
      const messages = detail
        .map(item => typeof item?.msg === 'string' ? item.msg.replace(/^Value error,\s*/i, '') : null)
        .filter((message): message is string => Boolean(message));
      if (messages.length) return messages.join(' ');
    }

    if (error.status === 0) return 'No fue posible conectar con el servicio. Intenta nuevamente en unos minutos.';
    return 'No pudimos crear tu cuenta. Revisa los datos e intenta nuevamente.';
  }
}
