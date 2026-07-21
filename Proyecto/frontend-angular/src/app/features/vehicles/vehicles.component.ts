import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { map, switchMap, of } from 'rxjs';

import { LicensePlateComponent } from '../../shared/components/license-plate/license-plate.component';
import { VehicleService } from '../../infrastructure/api/vehicle.service';
import { AssignmentService } from '../../infrastructure/api/assignment.service';
import { AuthService } from '../../infrastructure/api/auth.service';
import { Vehicle, VehicleType } from '../../core/models/vehicle.model';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [CommonModule, FormsModule, LicensePlateComponent],
  template: `
    <section class="feature-dark min-h-[calc(100vh-73px)] p-4 sm:p-6 space-y-6">
          
          <!-- Header Bar -->
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h2 class="text-2xl font-extrabold text-white flex items-center gap-2">
                <i class="fa-solid fa-car-side text-blue-400"></i> Garaje de Vehículos
              </h2>
              <p class="text-xs text-slate-400 mt-1">
                Catálogo y registro de vehículos asociados (Autos, Motos, SUVs y Eléctricos).
              </p>
            </div>

            <button (click)="showCreateModal = true"
              class="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all">
              <i class="fa-solid fa-plus-circle"></i> Registrar Nuevo Vehículo
            </button>
          </div>

          <!-- Vehicles Grid -->
          <div *ngIf="loading" class="text-center py-12 text-xs text-slate-400 font-mono">
            <i class="fa-solid fa-circle-notch fa-spin text-blue-400 text-2xl mb-2"></i>
            <p>Cargando vehículos del sistema...</p>
          </div>

          <div *ngIf="!loading && vehicles.length === 0" class="glass-card p-12 text-center text-xs text-slate-500">
            No hay vehículos registrados en la plataforma.
          </div>

          <div *ngIf="!loading && vehicles.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div *ngFor="let v of vehicles" class="glass-card p-5 border border-slate-800 hover:border-blue-500/40 space-y-4 flex flex-col justify-between">
              
              <div class="space-y-3">
                <!-- Top Header Type & Delete -->
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-blue-400">
                    <i [class]="getTypeIcon(v.type)" class="mr-1"></i> {{ v.type }}
                  </span>
                  <button (click)="onDeleteVehicle(v.id)" class="text-slate-500 hover:text-red-400 text-xs">
                    <i class="fa-solid fa-trash-can"></i>
                  </button>
                </div>

                <!-- License Plate Badge -->
                <div class="flex justify-center py-2">
                  <app-license-plate [plateNumber]="v.data?.plate" [vehicleType]="v.type" size="lg"></app-license-plate>
                </div>

                <!-- Specs Details -->
                <div class="space-y-1 text-xs border-t border-slate-800/80 pt-3">
                  <div class="flex justify-between text-slate-300 font-semibold">
                    <span>{{ v.data?.brand }} {{ v.data?.model }}</span>
                    <span class="text-slate-400 font-mono">{{ v.data?.year }}</span>
                  </div>
                  <div class="flex justify-between text-[11px] text-slate-400">
                    <span>Color: <strong class="text-slate-200">{{ v.data?.color }}</strong></span>
                    <span>Tipo: <strong class="text-slate-200">{{ v.data?.classification || 'Gasolina' }}</strong></span>
                  </div>
                </div>
              </div>

              <!-- ID Footer -->
              <div class="pt-2 border-t border-slate-800/60 text-[10px] font-mono text-slate-500 flex justify-between">
                <span>ID: {{ v.id.substring(0, 8) }}...</span>
                <span class="text-blue-400 font-bold">Registrado</span>
              </div>

            </div>
          </div>

          <!-- Create Vehicle Modal -->
          <div *ngIf="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
            <div class="glass-card max-w-md w-full p-6 border border-slate-700 shadow-2xl space-y-4">
              <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 class="text-sm font-bold text-white flex items-center gap-2">
                  <i class="fa-solid fa-car text-blue-400"></i> Registrar Vehículo
                </h3>
                <button (click)="showCreateModal = false" class="text-slate-400 hover:text-white">
                  <i class="fa-solid fa-xmark text-lg"></i>
                </button>
              </div>

              <form (ngSubmit)="onCreateVehicle()" class="space-y-3 text-xs">
                <div>
                  <label class="block text-slate-300 mb-1 font-semibold">Tipo de Vehículo</label>
                  <select [(ngModel)]="newVehicle.type" name="type" required
                    class="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 outline-none">
                    <option value="Auto">Auto 🚗</option>
                    <option value="Moto">Moto 🏍️</option>
                    <option value="Camioneta">Camioneta 🛻</option>

                  </select>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label class="block text-slate-300 mb-1 font-semibold">
                      Placa 
                      <span class="text-[10px] text-cyan-400 font-mono">
                        ({{ newVehicle.type === 'Moto' ? 'Formato Moto: AB-123C' : 'Formato Auto: PBA1234' }})
                      </span>
                    </label>
                    <input type="text" [(ngModel)]="newVehicle.data.plate" name="plate" required 
                      [placeholder]="newVehicle.type === 'Moto' ? 'AB-123C' : 'PBA1234'"
                      class="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 outline-none uppercase font-mono">
                  </div>
                  <div>
                    <label class="block text-slate-300 mb-1 font-semibold">Marca</label>
                    <input type="text" [(ngModel)]="newVehicle.data.brand" name="brand" required placeholder="Toyota / Chevrolet"
                      class="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 outline-none">
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label class="block text-slate-300 mb-1 font-semibold">Modelo</label>
                                        <input type="text" [(ngModel)]="newVehicle.data.model" name="model" required placeholder="Yaris / Sail"
                      class="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 outline-none">
                  </div>
                  <div>
                    <label class="block text-slate-300 mb-1 font-semibold">Color</label>
                    <input type="text" [(ngModel)]="newVehicle.data.color" name="color" required placeholder="Gris / Azul / Negro"
                      class="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 outline-none">
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label class="block text-slate-300 mb-1 font-semibold">Año</label>
                    <input type="number" [(ngModel)]="newVehicle.data.year" name="year" min="1900" [max]="currentYear + 1" required
                      class="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 outline-none">
                  </div>
                  <div>
                    <label class="block text-slate-300 mb-1 font-semibold">Clasificación</label>
                    <select [(ngModel)]="newVehicle.data.classification" name="classification" required
                      class="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 outline-none">
                      <option value="Gasolina">Gasolina ⛽</option>
                      <option value="Diesel">Diesel 🚛</option>
                      <option value="Hibrido">Híbrido 🔋</option>
                      <option value="Electrico">Eléctrico ⚡</option>
                    </select>
                  </div>
                </div>

                <div *ngIf="newVehicle.type === 'Auto'" class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label class="block text-slate-300 mb-1 font-semibold">Puertas</label>
                    <input type="number" [(ngModel)]="newVehicle.data.doors" name="doors" min="2" required placeholder="4"
                      class="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 outline-none">
                  </div>
                  <div>
                    <label class="block text-slate-300 mb-1 font-semibold">Combustible</label>
                    <input type="text" [(ngModel)]="newVehicle.data.fuelType" name="fuelType" required placeholder="Gasolina / Super"
                      class="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 outline-none">
                  </div>
                  <div>
                    <label class="block text-slate-300 mb-1 font-semibold">Maletero (L)</label>
                    <input type="number" [(ngModel)]="newVehicle.data.trunkCapacity" name="trunkCapacity" min="2" required placeholder="350"
                      class="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 outline-none">
                  </div>
                </div>
                <div *ngIf="newVehicle.type === 'Moto'">
                  <label class="block text-slate-300 mb-1 font-semibold">Tipo de Moto (ej. Scooter)</label>
                  <input type="text" [(ngModel)]="newVehicle.data.motorcycleType" name="motorcycleType" required placeholder="Scooter / Urbana"
                    class="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 outline-none">
                </div>
                <div *ngIf="newVehicle.type === 'Camioneta'" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label class="block text-slate-300 mb-1 font-semibold">Cabina (1 ó 2)</label>
                    <input type="number" [(ngModel)]="newVehicle.data.cabin" name="cabin" min="1" max="2" required placeholder="2"
                      class="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 outline-none">
                  </div>
                  <div>
                    <label class="block text-slate-300 mb-1 font-semibold">Carga (kg)</label>
                    <input type="number" [(ngModel)]="newVehicle.data.loadCapacity" name="loadCapacity" min="1" required placeholder="800"
                      class="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 outline-none">
                  </div>
                </div>

                <button type="submit" 
                  class="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 font-bold text-white rounded-xl shadow-lg shadow-blue-500/20">
                  Guardar Vehículo
                </button>
              </form>
            </div>
          </div>

    </section>
  `
})
export class VehiclesComponent implements OnInit {
  readonly currentYear = new Date().getFullYear();
  vehicles: Vehicle[] = [];
  loading = true;
  showCreateModal = false;

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
      trunkCapacity: 400,
      motorcycleType: 'Urbana',
      cabin: 2,
      loadCapacity: 800
    }
  };

  private vehicleService = inject(VehicleService);
  private assignmentService = inject(AssignmentService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.cdr.markForCheck();
    const source = (this.authService.hasRole('Administrador') || this.authService.hasRole('Root'))
      ? this.vehicleService.getVehicles()
      : this.vehicleService.getMyVehicles();
    source.subscribe({
      next: data => {
        this.vehicles = data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: err => {
        console.error(err);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  getTypeIcon(type: string): string {
    switch (type?.toLowerCase()) {
      case 'moto': return 'fa-solid fa-motorcycle';
      case 'camioneta': return 'fa-solid fa-truck-pickup';
      case 'electrico': return 'fa-solid fa-charging-station';
      default: return 'fa-solid fa-car-side';
    }
  }

  onCreateVehicle(): void {
    if (!this.newVehicle.data.plate || !this.newVehicle.data.brand) return;

    // Clean payload fields
    let rawPlate = this.newVehicle.data.plate.trim().toUpperCase().replace(/\s+/g, '');
    
    // Auto-insert dash for Moto if user typed e.g. AB123C
    if (this.newVehicle.type === 'Moto' && /^[A-Z]{2}\d{3}[A-Z]{1}$/.test(rawPlate)) {
      rawPlate = `${rawPlate.slice(0, 2)}-${rawPlate.slice(2)}`;
    }

    this.newVehicle.data.plate = rawPlate;
    this.newVehicle.data.brand = this.newVehicle.data.brand.trim().replace(/\s+/g, '');
    this.newVehicle.data.model = this.newVehicle.data.model.trim().replace(/\s+/g, '');
    this.newVehicle.data.color = this.newVehicle.data.color.trim().replace(/\s+/g, '');

    if (this.newVehicle.type === 'Auto') {
      this.newVehicle.data.fuelType = (this.newVehicle.data.fuelType || 'Gasolina').trim().replace(/\s+/g, '');
    } else if (this.newVehicle.type === 'Moto') {
      this.newVehicle.data.motorcycleType = (this.newVehicle.data.motorcycleType || 'Urbana').trim().replace(/\s+/g, '');
    }

    const currentUserId = (this.authService.hasRole('Administrador') || this.authService.hasRole('Root'))
      ? undefined 
      : this.authService.currentUser()?.id_person;

    this.vehicleService.createVehicle(this.newVehicle).pipe(
      switchMap(vehicle => currentUserId
        ? this.assignmentService.createAssignment({ userId: currentUserId, vehicleId: vehicle.id }).pipe(map(() => vehicle))
        : of(vehicle))
    ).subscribe({
      next: () => {
        this.showCreateModal = false;
        this.loadData();
      },
      error: err => {
        let msg = err.error?.message;
        if (Array.isArray(msg)) {
          msg = msg.map((m: string) => m.replace(/^data\./, '')).join('\n• ');
        }
        alert('Error de validación al crear vehículo:\n• ' + (msg || err.error?.detail || err.message));
      }
    });
  }

  onDeleteVehicle(id: string): void {
    if (!confirm('¿Deseas eliminar este vehículo del garaje?')) return;
    this.vehicleService.deleteVehicle(id).subscribe({
      next: () => this.loadData(),
      error: err => alert('Error al eliminar vehículo: ' + (err.error?.detail || err.message))
    });
  }
}
