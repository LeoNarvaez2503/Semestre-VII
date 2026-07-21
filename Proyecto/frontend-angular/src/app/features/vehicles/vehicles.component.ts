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
    <section class="p-4 sm:p-8 bg-[#f4f5f7] min-h-[calc(100vh-70px)] space-y-6">
      <div class="max-w-7xl mx-auto space-y-6">

        <!-- Top Banner matching MisVehiculosView.tsx -->
        <div class="bg-slate-900 text-white rounded-xl p-6 shadow-md border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 class="text-xl font-extrabold flex items-center gap-2">
              <i class="fa-solid fa-truck text-amber-400"></i>
              Flota de Vehículos Registrados
            </h2>
            <p class="text-xs text-slate-300 mt-1">
              Administración centralizada de flotas comerciales, asignación directa de plazas y contacto.
            </p>
          </div>

          <button (click)="showCreateModal = true"
            class="bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold px-4 py-2.5 rounded-lg text-sm flex items-center gap-2 transition shadow-sm">
            <i class="fa-solid fa-plus font-bold"></i>
            Registrar Vehículo en Flota
          </button>
        </div>

        <!-- Toolbar -->
        <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div class="relative w-full sm:w-80">
            <i class="fa-solid fa-magnifying-glass text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 text-xs"></i>
            <input type="text" [(ngModel)]="searchQuery"
              placeholder="Buscar vehículo por placa, marca o modelo..."
              class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none" />
          </div>

          <span class="text-xs font-bold text-gray-500">
            Total Flota: <strong class="text-gray-900">{{ filteredVehicles.length }} vehículos</strong>
          </span>
        </div>

        <!-- Vehicles Grid -->
        <div *ngIf="loading" class="text-center py-12 text-xs text-gray-500 font-mono">
          <i class="fa-solid fa-circle-notch fa-spin text-amber-500 text-2xl mb-2"></i>
          <p>Cargando vehículos de la flota...</p>
        </div>

        <div *ngIf="!loading && filteredVehicles.length === 0" class="bg-white p-12 rounded-xl border border-gray-200 text-center text-xs text-gray-400 font-medium">
          No hay vehículos registrados en la plataforma.
        </div>

        <div *ngIf="!loading && filteredVehicles.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div *ngFor="let v of filteredVehicles"
            class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition space-y-3">
            
            <div class="flex items-center justify-between border-b border-gray-200 pb-3">
              <div>
                <span class="font-mono font-extrabold text-base text-gray-900 bg-amber-100 px-2.5 py-0.5 rounded border border-amber-300">
                  {{ v.data?.plate || 'P-1234-UF' }}
                </span>
                <div class="text-xs text-gray-500 font-bold mt-1">{{ v.data?.brand }} {{ v.data?.model }}</div>
              </div>

              <span class="text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase bg-slate-100 text-slate-800 border border-slate-300">
                {{ v.type }}
              </span>
            </div>

            <div class="space-y-1.5 text-xs text-gray-600">
              <div class="flex justify-between">
                <span class="font-medium">Año / Modelo:</span>
                <span class="font-bold text-gray-800">{{ v.data?.year || '2024' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-medium">Color / Tipo:</span>
                <span class="font-bold text-gray-800">{{ v.data?.color || 'Gris' }} - {{ v.data?.classification || 'Comercial' }}</span>
              </div>
            </div>

            <div class="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
              <span class="text-emerald-700 font-extrabold flex items-center gap-1">
                <i class="fa-solid fa-circle-check text-emerald-600"></i>
                Registrado en Flota
              </span>

              <button (click)="onDeleteVehicle(v.id)" class="text-slate-400 hover:text-red-600 transition">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>

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
  vehicles: Vehicle[] = [];
  loading = true;
  showCreateModal = false;
  searchQuery = '';
  currentYear = new Date().getFullYear();

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

  get filteredVehicles(): Vehicle[] {
    if (!this.searchQuery.trim()) return this.vehicles;
    const q = this.searchQuery.toLowerCase();
    return this.vehicles.filter(v =>
      (v.data?.plate || '').toLowerCase().includes(q) ||
      (v.data?.brand || '').toLowerCase().includes(q) ||
      (v.data?.model || '').toLowerCase().includes(q)
    );
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
