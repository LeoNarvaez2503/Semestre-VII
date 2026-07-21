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
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fadeIn font-sans select-none">
      <div class="bg-white rounded-2xl shadow-2xl border border-gray-300 max-w-md w-full p-6 space-y-4 text-gray-900">
        
        <div class="flex items-center justify-between border-b border-gray-200 pb-3">
          <h3 class="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <i class="fa-solid fa-car text-amber-500"></i> Registrar Vehículo en Flota
          </h3>
          <button (click)="close.emit()" class="text-gray-400 hover:text-gray-900 transition">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <form (ngSubmit)="onSubmit()" class="space-y-3 text-xs">
          
          <div>
            <label class="block text-gray-700 font-bold mb-1">Tipo de Vehículo *</label>
            <select [(ngModel)]="newVehicle.type" (change)="onTypeChange()" name="type" required
              class="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 font-semibold focus:ring-2 focus:ring-amber-500 outline-none">
              <option value="Auto">Auto 🚗</option>
              <option value="Moto">Moto 🏍️</option>
              <option value="Camioneta">Camioneta 🛻</option>
            </select>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-gray-700 font-bold mb-1">
                Placa *
                <span class="text-[10px] text-amber-600 font-mono">
                  ({{ newVehicle.type === 'Moto' ? 'Ej. AB-123C' : 'Ej. PBA-1234' }})
                </span>
              </label>
              <input type="text" [(ngModel)]="newVehicle.data.plate" (input)="onPlateInput()" name="plate" required 
                [placeholder]="newVehicle.type === 'Moto' ? 'AB-123C' : 'PBA-1234'"
                class="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 outline-none uppercase font-mono font-bold">
            </div>
            <div>
              <label class="block text-gray-700 font-bold mb-1">Marca *</label>
              <input type="text" [(ngModel)]="newVehicle.data.brand" name="brand" required placeholder="Yamaha / Toyota"
                class="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 outline-none">
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-gray-700 font-bold mb-1">Modelo *</label>
              <input type="text" [(ngModel)]="newVehicle.data.model" name="model" required placeholder="FZ / Yaris / Hilux"
                class="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 outline-none">
            </div>
            <div>
              <label class="block text-gray-700 font-bold mb-1">Color *</label>
              <input type="text" [(ngModel)]="newVehicle.data.color" name="color" required placeholder="Negro / Rojo"
                class="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 outline-none">
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-gray-700 font-bold mb-1">Año *</label>
              <input type="number" [(ngModel)]="newVehicle.data.year" name="year" min="1900" [max]="currentYear + 1" required
                class="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 outline-none font-mono">
            </div>
            <div>
              <label class="block text-gray-700 font-bold mb-1">Clasificación *</label>
              <select [(ngModel)]="newVehicle.data.classification" name="classification" required
                class="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 font-semibold focus:ring-2 focus:ring-amber-500 outline-none">
                <option value="Gasolina">Gasolina ⛽</option>
                <option value="Diesel">Diesel 🚛</option>
                <option value="Hibrido">Híbrido 🔋</option>
                <option value="Electrico">Eléctrico ⚡</option>
              </select>
            </div>
          </div>

          <!-- Motorcycle Specific Dropdown (Custom, Cruiser, Scooter, Deportiva, Motocross) -->
          <div *ngIf="newVehicle.type === 'Moto'">
            <label class="block text-amber-800 font-extrabold mb-1">Estilo de Motocicleta *</label>
            <select [(ngModel)]="newVehicle.data.motorcycleType" name="motorcycleType" required
              class="w-full p-2.5 bg-amber-50 border border-amber-300 rounded-lg text-gray-900 font-bold focus:ring-2 focus:ring-amber-500 outline-none">
              <option value="Custom">Custom / Chopper (Ej. Harley-Davidson) 🏍️</option>
              <option value="Cruiser">Cruiser / Turismo 🛣️</option>
              <option value="Scooter">Scooter 🛵</option>
              <option value="Deportiva">Deportiva 🏁</option>
              <option value="Motocross">Motocross / Off-Road 🚵</option>
            </select>
          </div>

          <!-- Car Specific Options -->
          <div *ngIf="newVehicle.type === 'Auto'" class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label class="block text-gray-700 font-bold mb-1">Puertas</label>
              <input type="number" [(ngModel)]="newVehicle.data.doors" name="doors" min="2" placeholder="4"
                class="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 outline-none">
            </div>
            <div>
              <label class="block text-gray-700 font-bold mb-1">Combustible</label>
              <input type="text" [(ngModel)]="newVehicle.data.fuelType" name="fuelType" placeholder="Super"
                class="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 outline-none">
            </div>
            <div>
              <label class="block text-gray-700 font-bold mb-1">Maletero (L)</label>
              <input type="number" [(ngModel)]="newVehicle.data.trunkCapacity" name="trunkCapacity" min="50" placeholder="350"
                class="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 outline-none">
            </div>
          </div>

          <button type="submit" [disabled]="submitting"
            class="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs rounded-xl shadow transition flex items-center justify-center gap-2 cursor-pointer mt-2">
            <i class="fa-solid fa-check font-bold"></i>
            {{ submitting ? 'Registrando...' : 'Confirmar Registro de Vehículo' }}
          </button>
        </form>

      </div>
    </div>
  `
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
        alert('Error al registrar vehículo: ' + (err.error?.detail || err.message));
      }
    });
  }
}
