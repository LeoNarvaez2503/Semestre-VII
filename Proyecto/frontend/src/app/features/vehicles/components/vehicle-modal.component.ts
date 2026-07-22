import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { VehicleService } from '../../../infrastructure/api/vehicle.service';
import { AssignmentService } from '../../../infrastructure/api/assignment.service';
import { AuthService } from '../../../infrastructure/api/auth.service';
import { VehicleType } from '../../../core/models/vehicle.model';

@Component({
  selector: 'app-vehicle-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicle-modal.component.html',
  styleUrl: './vehicle-modal.component.css'
})
export class VehicleModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() created = new EventEmitter<void>();

  currentYear = new Date().getFullYear();
  submitting = false;

  newVehicle = {
    type: 'Auto' as VehicleType,
    data: {
      plate: '',
      brand: '',
      model: '',
      color: '',
      year: new Date().getFullYear(),
      classification: 'Gasolina',
      doors: 4,
      fuelType: 'Gasolina',
      trunkCapacity: 350,
      cylinderCapacity: 1500,
      cabin: 1,
      loadCapacity: 1000,
      motorcycleType: 'Scooter'
    }
  };

  private vehicleService = inject(VehicleService);
  private assignmentService = inject(AssignmentService);
  private authService = inject(AuthService);

  errorMessage = '';

  onTypeChange(): void {
    if (this.newVehicle.type === 'Moto') {
      this.newVehicle.data.motorcycleType = 'Scooter';
    }
  }

  onPlateInput(): void {
    let raw = this.newVehicle.data.plate.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (raw.length >= 3 && !raw.includes('-')) {
      const match = raw.match(/^([A-Z]{2,3})(\d.*)$/);
      if (match) {
        raw = match[1] + '-' + match[2];
      }
    }
    this.newVehicle.data.plate = raw;
  }

  onSubmit(): void {
    if (!this.newVehicle.data.plate || !this.newVehicle.data.brand || this.submitting) return;

    this.errorMessage = '';

    const maxAllowedYear = this.currentYear + 1;
    if (this.newVehicle.data.year > maxAllowedYear) {
      this.errorMessage = `Año inválido. El año del vehículo no puede ser superior a 1 año más del año actual (${maxAllowedYear}).`;
      return;
    }
    if (this.newVehicle.data.year < 1900) {
      this.errorMessage = 'Año inválido. El año del vehículo debe ser mayor o igual a 1900.';
      return;
    }

    this.submitting = true;

    this.vehicleService.createVehicle({ type: this.newVehicle.type, data: this.newVehicle.data }).subscribe({
      next: (createdVehicle) => {
        const attachAssignment = (userId: string) => {
          if (userId && createdVehicle?.id) {
            this.assignmentService.createAssignment({ userId, vehicleId: createdVehicle.id }).subscribe({
              next: () => {
                this.submitting = false;
                this.created.emit();
              },
              error: () => {
                this.submitting = false;
                this.created.emit();
              }
            });
          } else {
            this.submitting = false;
            this.created.emit();
          }
        };

        const curUser = this.authService.currentUser();
        if (curUser?.id_person) {
          attachAssignment(curUser.id_person);
        } else {
          this.authService.fetchProfile().subscribe({
            next: (profile) => attachAssignment(profile.id_person),
            error: () => {
              this.submitting = false;
              this.created.emit();
            }
          });
        }
      },
      error: err => {
        this.submitting = false;
        if (err.status === 409) {
          this.errorMessage = 'Ya existe un vehículo registrado con la placa ingresada.';
        } else {
          this.errorMessage = 'Error al registrar vehículo: ' + (err.error?.detail || err.error?.message || err.message);
        }
      }
    });
  }
}
