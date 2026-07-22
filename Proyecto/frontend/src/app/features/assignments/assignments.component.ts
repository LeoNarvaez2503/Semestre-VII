import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, finalize, forkJoin, of } from 'rxjs';
import { Assignment, AssignmentTrace } from '../../core/models/assignment.model';
import { User } from '../../core/models/user.model';
import { Vehicle } from '../../core/models/vehicle.model';
import { AssignmentService } from '../../infrastructure/api/assignment.service';
import { UserService } from '../../infrastructure/api/user.service';
import { VehicleService } from '../../infrastructure/api/vehicle.service';

@Component({
  selector: 'app-assignments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './assignments.component.html',
  styleUrl: './assignments.component.css'
})
export class AssignmentsComponent implements OnInit {
  users: User[] = [];
  vehicles: Vehicle[] = [];
  traces: AssignmentTrace[] = [];
  loading = false;
  saving = false;
  processingKey: string | null = null;
  errorMessage = '';
  successMessage = '';

  private readonly assignmentOverrides = new Map<string, Assignment>();
  private readonly formBuilder = inject(FormBuilder);
  private readonly assignmentService = inject(AssignmentService);
  private readonly userService = inject(UserService);
  private readonly vehicleService = inject(VehicleService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly assignmentForm = this.formBuilder.nonNullable.group({
    userId: ['', Validators.required],
    vehicleId: ['', Validators.required]
  });

  ngOnInit(): void {
    this.loadData();
  }

  get assignments(): Assignment[] {
    const assignmentsByKey = new Map<string, Assignment>();

    for (const trace of this.traces) {
      const key = this.assignmentKey(trace.userId, trace.vehicleId);
      if (assignmentsByKey.has(key)) continue;

      const state = trace.payload?.newState ?? trace.payload?.previousState;
      assignmentsByKey.set(key, {
        userId: trace.userId,
        vehicleId: trace.vehicleId,
        createdAt: state?.createdAt,
        updatedAt: state?.updatedAt,
        active: trace.tipoAccion === 'ELIMINACION' ? false : (state?.active ?? false)
      });
    }

    for (const [key, assignment] of this.assignmentOverrides) {
      assignmentsByKey.set(key, assignment);
    }

    return [...assignmentsByKey.values()].sort((a, b) => Number(b.active) - Number(a.active));
  }

  loadData(): void {
    this.loading = true;
    this.clearMessages();
    this.cdr.markForCheck();
    const warnings: string[] = [];

    forkJoin({
      users: this.userService.getUsers().pipe(catchError(error => {
        warnings.push(this.getErrorMessage(error, 'No se pudieron cargar los usuarios.'));
        return of([] as User[]);
      })),
      vehicles: this.vehicleService.getVehicles().pipe(catchError(error => {
        warnings.push(this.getErrorMessage(error, 'No se pudieron cargar los vehículos.'));
        return of([] as Vehicle[]);
      })),
      traces: this.assignmentService.getTraceability().pipe(catchError(error => {
        warnings.push(this.getErrorMessage(error, 'No se pudo cargar la trazabilidad.'));
        return of([] as AssignmentTrace[]);
      }))
    }).pipe(finalize(() => {
      this.loading = false;
      this.cdr.markForCheck();
    })).subscribe(result => {
      this.users = result.users;
      this.vehicles = result.vehicles;
      this.traces = result.traces;
      this.errorMessage = warnings.join(' ');
      this.setInitialSelections();
      this.cdr.markForCheck();
    });
  }

  refreshTraceability(): void {
    this.loading = true;
    this.errorMessage = '';
    this.cdr.markForCheck();
    this.assignmentService.getTraceability().pipe(
      finalize(() => {
        this.loading = false;
        this.cdr.markForCheck();
      })
    ).subscribe({
      next: traces => {
        this.traces = traces;
        this.cdr.markForCheck();
      },
      error: error => {
        this.errorMessage = this.getErrorMessage(error, 'No se pudo actualizar la trazabilidad.');
        this.cdr.markForCheck();
      }
    });
  }

  createAssignment(): void {
    if (this.assignmentForm.invalid || this.saving) {
      this.assignmentForm.markAllAsTouched();
      return;
    }

    const request = this.assignmentForm.getRawValue();
    this.saving = true;
    this.clearMessages();
    this.cdr.markForCheck();
    this.assignmentService.createAssignment(request).pipe(
      finalize(() => {
        this.saving = false;
        this.cdr.markForCheck();
      })
    ).subscribe({
      next: assignment => {
        this.assignmentOverrides.set(this.assignmentKey(assignment.userId, assignment.vehicleId), assignment);
        this.successMessage = 'Asignación creada y activada correctamente.';
        this.refreshTraceabilitySilently();
        this.cdr.markForCheck();
      },
      error: error => {
        if (error.status === 409) {
          this.errorMessage = 'Ya existe una asignación registrada entre este usuario y vehículo.';
        } else {
          this.errorMessage = this.getErrorMessage(error, 'No fue posible crear la asignación.');
        }
        this.cdr.markForCheck();
      }
    });
  }

  toggleAssignment(assignment: Assignment): void {
    const key = this.assignmentKey(assignment.userId, assignment.vehicleId);
    if (this.processingKey) return;

    this.processingKey = key;
    this.clearMessages();
    this.cdr.markForCheck();
    this.assignmentService.updateAssignment(
      assignment.userId,
      assignment.vehicleId,
      { active: !assignment.active }
    ).pipe(finalize(() => {
      this.processingKey = null;
      this.cdr.markForCheck();
    })).subscribe({
      next: updated => {
        this.assignmentOverrides.set(key, updated);
        this.successMessage = updated.active ? 'Asignación activada.' : 'Asignación desactivada.';
        this.refreshTraceabilitySilently();
        this.cdr.markForCheck();
      },
      error: error => {
        this.errorMessage = this.getErrorMessage(error, 'No fue posible actualizar la asignación.');
        this.cdr.markForCheck();
      }
    });
  }

  deleteAssignment(assignment: Assignment): void {
    const key = this.assignmentKey(assignment.userId, assignment.vehicleId);
    if (this.processingKey || !confirm('¿Eliminar esta asignación? El microservicio la dejará inactiva.')) return;

    this.processingKey = key;
    this.clearMessages();
    this.cdr.markForCheck();
    this.assignmentService.deleteAssignment(assignment.userId, assignment.vehicleId).pipe(
      finalize(() => {
        this.processingKey = null;
        this.cdr.markForCheck();
      })
    ).subscribe({
      next: () => {
        this.assignmentOverrides.set(key, { ...assignment, active: false });
        this.successMessage = 'Asignación eliminada correctamente.';
        this.refreshTraceabilitySilently();
        this.cdr.markForCheck();
      },
      error: error => {
        this.errorMessage = this.getErrorMessage(error, 'No fue posible eliminar la asignación.');
        this.cdr.markForCheck();
      }
    });
  }

  getUserName(userId: string): string {
    const user = this.users.find(item => item.id_person === userId);
    const fullName = [user?.person?.first_name, user?.person?.last_name].filter(Boolean).join(' ');
    return fullName || user?.username || this.shortUuid(userId);
  }

  getVehicleLabel(vehicleId: string): string {
    const vehicle = this.vehicles.find(item => item.id === vehicleId);
    if (!vehicle) return this.shortUuid(vehicleId);
    return `${vehicle.data.plate} · ${vehicle.data.brand} ${vehicle.data.model}`;
  }

  shortUuid(uuid: string): string {
    return uuid.length > 12 ? `${uuid.slice(0, 8)}…` : uuid;
  }

  actionLabel(action: string): string {
    const labels: Record<string, string> = {
      CREACION: 'Creación',
      MODIFICACION: 'Modificación',
      ELIMINACION: 'Eliminación'
    };
    return labels[action] ?? action;
  }

  traceState(trace: AssignmentTrace): string {
    if (trace.tipoAccion === 'ELIMINACION') return 'Inactiva';
    return trace.payload?.newState?.active ? 'Activa' : 'Inactiva';
  }

  rowKey(userId: string, vehicleId: string): string {
    return this.assignmentKey(userId, vehicleId);
  }

  private setInitialSelections(): void {
    const current = this.assignmentForm.getRawValue();
    this.assignmentForm.setValue({
      userId: current.userId || this.users[0]?.id_person || '',
      vehicleId: current.vehicleId || this.vehicles[0]?.id || ''
    });
  }

  private refreshTraceabilitySilently(): void {
    this.assignmentService.getTraceability().subscribe({
      next: traces => this.traces = traces,
      error: () => undefined
    });
  }

  private assignmentKey(userId: string, vehicleId: string): string {
    return `${userId}:${vehicleId}`;
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  private getErrorMessage(error: unknown, fallback: string): string {
    if (typeof error === 'object' && error !== null && 'error' in error) {
      const response = (error as { error?: { detail?: string; message?: string | string[] } | string }).error;
      if (typeof response === 'string') return response || fallback;
      if (response?.detail) return response.detail;
      if (Array.isArray(response?.message)) return response.message.join(' ');
      if (response?.message) return response.message;
    }
    return fallback;
  }
}
