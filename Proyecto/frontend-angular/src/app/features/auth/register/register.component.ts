import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RegisterPayload, User } from '../../../core/models/user.model';
import { AuthService } from '../../../infrastructure/api/auth.service';

function passwordsMatch(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmation = control.get('passwordConfirmation')?.value;
  return password === confirmation ? null : { passwordsMismatch: true };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <main class="min-h-screen bg-slate-50 dot-pattern px-4 py-6 sm:px-6 sm:py-10">
      <div class="mx-auto w-full max-w-4xl">
        <header class="mb-6 flex items-center justify-between gap-4">
          <a routerLink="/login" class="flex items-center gap-2.5" aria-label="Volver al inicio de sesión">
            <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-md">
              <span class="material-symbols-outlined">directions_car</span>
            </span>
            <span class="text-lg font-black tracking-tight text-slate-900">UrbanFlow</span>
          </a>
          <a routerLink="/login" class="inline-flex items-center gap-1 text-sm font-bold text-amber-700 transition-colors hover:text-amber-800">
            <span class="material-symbols-outlined text-lg">arrow_back</span>
            Iniciar sesión
          </a>
        </header>

        <section class="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-2xl shadow-slate-200/80">
          <div class="border-b border-slate-100 px-6 py-7 sm:px-10">
            <p class="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-700">Registro público</p>
            <h1 class="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Crea tu cuenta</h1>
            <p class="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
              Completa tus datos personales. Tu cuenta se creará con acceso de cliente; los permisos administrativos no se asignan desde este formulario.
            </p>
          </div>

          <div *ngIf="createdUser" class="p-6 sm:p-10" aria-live="polite">
            <div class="mx-auto max-w-lg rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
              <span class="material-symbols-outlined mb-3 text-5xl text-emerald-600">check_circle</span>
              <h2 class="text-xl font-black text-slate-900">Cuenta creada correctamente</h2>
              <p class="mt-2 text-sm text-slate-600">
                Tu usuario de acceso es <strong class="text-slate-900">{{ createdUser.username }}</strong>.
                Guárdalo para iniciar sesión.
              </p>
              <a routerLink="/login" class="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-black">
                Ir al inicio de sesión
                <span class="material-symbols-outlined text-lg">arrow_forward</span>
              </a>
            </div>
          </div>

          <form *ngIf="!createdUser" [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-8 p-6 sm:p-10" novalidate>
            <div *ngIf="errorMessage" class="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
              <span class="material-symbols-outlined text-xl text-red-500">warning</span>
              <span>{{ errorMessage }}</span>
            </div>

            <fieldset class="space-y-5">
              <legend class="mb-4 text-sm font-black uppercase tracking-wider text-slate-800">Datos de identidad</legend>
              <div class="grid gap-5 sm:grid-cols-2">
                <label class="field-label">
                  Primer nombre <span class="required">*</span>
                  <input formControlName="firstName" type="text" maxlength="30" autocomplete="given-name" class="field-input" placeholder="María">
                  <span *ngIf="isInvalid('firstName')" class="field-error">Ingresa tu primer nombre (máximo 30 caracteres).</span>
                </label>

                <label class="field-label">
                  Segundo nombre <span class="optional">Opcional</span>
                  <input formControlName="middleName" type="text" maxlength="30" autocomplete="additional-name" class="field-input" placeholder="Fernanda">
                </label>

                <label class="field-label">
                  Apellido <span class="required">*</span>
                  <input formControlName="lastName" type="text" maxlength="30" autocomplete="family-name" class="field-input" placeholder="López">
                  <span *ngIf="isInvalid('lastName')" class="field-error">Ingresa tu apellido (máximo 30 caracteres).</span>
                </label>

                <label class="field-label">
                  Cédula / DNI <span class="required">*</span>
                  <input formControlName="dni" type="text" maxlength="30" inputmode="numeric" autocomplete="off" class="field-input" placeholder="Número de identificación">
                  <span *ngIf="isInvalid('dni')" class="field-error">Ingresa un número de identificación válido.</span>
                </label>

                <label class="field-label sm:col-span-2">
                  Nacionalidad <span class="optional">Opcional</span>
                  <input formControlName="nationality" type="text" maxlength="30" autocomplete="country-name" class="field-input" placeholder="Ecuatoriana">
                </label>
              </div>
            </fieldset>

            <fieldset class="space-y-5 border-t border-slate-100 pt-8">
              <legend class="mb-4 text-sm font-black uppercase tracking-wider text-slate-800">Contacto</legend>
              <div class="grid gap-5 sm:grid-cols-2">
                <label class="field-label">
                  Correo electrónico <span class="required">*</span>
                  <input formControlName="email" type="email" maxlength="50" autocomplete="email" class="field-input" placeholder="nombre@correo.com">
                  <span *ngIf="isInvalid('email')" class="field-error">Ingresa un correo electrónico válido.</span>
                </label>

                <label class="field-label">
                  Teléfono <span class="optional">Opcional</span>
                  <input formControlName="phone" type="tel" maxlength="15" autocomplete="tel" class="field-input" placeholder="0991234567">
                </label>

                <label class="field-label sm:col-span-2">
                  Dirección <span class="optional">Opcional</span>
                  <input formControlName="address" type="text" autocomplete="street-address" class="field-input" placeholder="Calle, número y ciudad">
                </label>
              </div>
            </fieldset>

            <fieldset class="space-y-5 border-t border-slate-100 pt-8">
              <legend class="mb-4 text-sm font-black uppercase tracking-wider text-slate-800">Seguridad</legend>
              <div class="grid gap-5 sm:grid-cols-2">
                <label class="field-label">
                  Contraseña <span class="required">*</span>
                  <span class="relative mt-2 block">
                    <input formControlName="password" [type]="showPassword ? 'text' : 'password'" minlength="8" maxlength="72" autocomplete="new-password" class="field-input !mt-0 pr-12" placeholder="Mínimo 8 caracteres">
                    <button type="button" (click)="showPassword = !showPassword" class="absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 hover:text-slate-700" [attr.aria-label]="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'">
                      <span class="material-symbols-outlined text-xl">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
                    </button>
                  </span>
                  <span *ngIf="isInvalid('password')" class="field-error">La contraseña debe tener entre 8 y 72 caracteres.</span>
                </label>

                <label class="field-label">
                  Confirmar contraseña <span class="required">*</span>
                  <input formControlName="passwordConfirmation" [type]="showPassword ? 'text' : 'password'" minlength="8" maxlength="72" autocomplete="new-password" class="field-input" placeholder="Repite tu contraseña">
                  <span *ngIf="isInvalid('passwordConfirmation')" class="field-error">Confirma tu contraseña.</span>
                  <span *ngIf="registerForm.hasError('passwordsMismatch') && registerForm.controls.passwordConfirmation.touched" class="field-error">Las contraseñas no coinciden.</span>
                </label>
              </div>
            </fieldset>

            <div class="flex flex-col-reverse items-stretch justify-between gap-4 border-t border-slate-100 pt-7 sm:flex-row sm:items-center">
              <p class="text-xs leading-relaxed text-slate-500 sm:max-w-md">Al registrarte confirmas que los datos ingresados son correctos.</p>
              <button type="submit" [disabled]="loading" class="inline-flex min-w-48 items-center justify-center gap-2 rounded-2xl bg-slate-900 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-slate-900/20 transition-all hover:bg-black disabled:cursor-not-allowed disabled:opacity-60">
                <span *ngIf="loading" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                {{ loading ? 'Creando cuenta...' : 'Crear cuenta' }}
                <span *ngIf="!loading" class="material-symbols-outlined text-lg">person_add</span>
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  `,
  styles: [`
    .dot-pattern {
      background-color: #f8fafc;
      background-image: radial-gradient(#e2e8f0 1.25px, transparent 1.25px);
      background-size: 24px 24px;
    }
    .field-label {
      display: block;
      color: #334155;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.025em;
    }
    .field-input {
      display: block;
      width: 100%;
      margin-top: 0.5rem;
      padding: 0.875rem 1rem;
      border: 1px solid #e2e8f0;
      border-radius: 1rem;
      background: #f8fafc;
      color: #1e293b;
      font-size: 0.875rem;
      font-weight: 500;
      outline: none;
      transition: 160ms ease;
    }
    .field-input:focus {
      border-color: #0f172a;
      background: white;
      box-shadow: 0 0 0 2px #0f172a;
    }
    .field-input.ng-invalid.ng-touched {
      border-color: #fca5a5;
      background: #fffafa;
    }
    .field-error {
      display: block;
      margin-top: 0.375rem;
      color: #b91c1c;
      font-size: 0.7rem;
      font-weight: 600;
      letter-spacing: normal;
    }
    .required { color: #b45309; }
    .optional {
      margin-left: 0.25rem;
      color: #94a3b8;
      font-size: 0.625rem;
      font-weight: 600;
      text-transform: uppercase;
    }
  `]
})
export class RegisterComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  loading = false;
  showPassword = false;
  errorMessage = '';
  createdUser: User | null = null;

  readonly registerForm = this.formBuilder.nonNullable.group({
    firstName: ['', [Validators.required, Validators.maxLength(30)]],
    middleName: ['', Validators.maxLength(30)],
    lastName: ['', [Validators.required, Validators.maxLength(30)]],
    dni: ['', [Validators.required, Validators.maxLength(30)]],
    nationality: ['', Validators.maxLength(30)],
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
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.errorMessage = this.getErrorMessage(error);
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
