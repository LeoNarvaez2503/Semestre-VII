import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { SpaceSlotComponent } from '../../shared/components/space-slot/space-slot.component';
import { ParkingService } from '../../infrastructure/api/parking.service';
import { SpaceSseService } from '../../infrastructure/sse/space-sse.service';
import { AuthService } from '../../infrastructure/api/auth.service';
import { ParkingSpace, SpaceStatus } from '../../core/models/space.model';
import { Zone } from '../../core/models/zone.model';

@Component({
  selector: 'app-parking-map',
  standalone: true,
  imports: [CommonModule, FormsModule, SpaceSlotComponent],
  template: `
    <section class="feature-dark min-h-[calc(100vh-73px)] p-4 sm:p-6 space-y-6">
          
          <!-- Header Bar -->
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-2xl font-extrabold text-white">Mapa 2D de Parqueadero</h2>
                <span class="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono font-bold flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Live SSE
                </span>
              </div>
              <p class="text-xs text-slate-400 mt-1">
                Monitoreo interactivo de bahías y actualización en tiempo real mediante Server-Sent Events.
              </p>
            </div>

            <div class="flex items-center gap-3">
              <!-- Filter by Zone -->
              <select [(ngModel)]="selectedZoneId" (change)="filterSpaces()"
                class="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 outline-none focus:border-cyan-500">
                <option value="">Todas las Zonas</option>
                <option *ngFor="let z of zones" [value]="z.zoneId">{{ z.name }}</option>
              </select>

              <!-- New Zone/Space (Admin Only) -->
              <button *ngIf="authService.hasRole('Administrador')" (click)="showCreateModal = true"
                class="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 transition-all">
                <i class="fa-solid fa-plus"></i> Nueva Plaza
              </button>
            </div>
          </div>

          <!-- Zones & Spaces Grid Container -->
          <div *ngIf="loading" class="text-center py-12">
            <i class="fa-solid fa-circle-notch fa-spin text-3xl text-cyan-400 mb-2"></i>
            <p class="text-xs text-slate-400 font-mono">Cargando espacios del parqueadero...</p>
          </div>

          <div *ngIf="!loading && filteredSpaces.length === 0" class="glass-card p-12 text-center">
            <i class="fa-solid fa-car-rear text-4xl text-slate-600 mb-3"></i>
            <p class="text-sm font-semibold text-slate-400">No se encontraron espacios configurados.</p>
          </div>

          <div *ngIf="!loading && filteredSpaces.length > 0" class="space-y-8">
            <div *ngFor="let z of visibleZones" class="glass-card p-5 border border-slate-800 space-y-4">
              <div class="flex items-center justify-between pb-3 border-b border-slate-800/80">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 font-bold text-sm">
                    <i class="fa-solid fa-warehouse"></i>
                  </div>
                  <div>
                    <h3 class="text-sm font-bold text-slate-200">{{ z.name }}</h3>
                    <p class="text-[10px] text-slate-400 font-mono">{{ z.description }} (Capacidad: {{ z.capacidad }})</p>
                  </div>
                </div>

                <div class="flex items-center gap-4 text-xs font-mono">
                  <span class="text-emerald-400"><i class="fa-solid fa-circle text-[8px] mr-1"></i> Libre: {{ getZoneCount(z.zoneId, 'DISPONIBLE') }}</span>
                  <span class="text-red-400"><i class="fa-solid fa-circle text-[8px] mr-1"></i> Ocupado: {{ getZoneCount(z.zoneId, 'OCUPADO') }}</span>
                  <span class="text-amber-400"><i class="fa-solid fa-circle text-[8px] mr-1"></i> Reservado: {{ getZoneCount(z.zoneId, 'RESERVADO') }}</span>
                </div>
              </div>

              <!-- 2D Slot Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                <app-space-slot *ngFor="let space of getSpacesByZone(z.zoneId)" 
                  [space]="space"
                  (selectSpace)="openSpaceDetails($event)">
                </app-space-slot>
              </div>
            </div>
          </div>

          <!-- Space Action Modal -->
          <div *ngIf="selectedSpace" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
            <div class="glass-card max-w-md w-full p-6 border border-slate-700 shadow-2xl space-y-5">
              <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-400">
                    {{ selectedSpace.description }}
                  </span>
                  <h3 class="text-sm font-bold text-white">Detalle de Espacio</h3>
                </div>
                <button (click)="selectedSpace = null" class="text-slate-400 hover:text-white">
                  <i class="fa-solid fa-xmark text-lg"></i>
                </button>
              </div>

              <div class="space-y-3 text-xs">
                <div class="flex justify-between py-1.5 border-b border-slate-800/60 text-slate-300">
                  <span class="text-slate-400">ID Espacio:</span>
                  <span class="font-mono">{{ selectedSpace.id }}</span>
                </div>
                <div class="flex justify-between py-1.5 border-b border-slate-800/60 text-slate-300">
                  <span class="text-slate-400">Tipo de Plaza:</span>
                  <span class="font-bold text-cyan-400">{{ selectedSpace.type }}</span>
                </div>
                <div class="flex justify-between py-1.5 border-b border-slate-800/60 text-slate-300">
                  <span class="text-slate-400">Estado Actual:</span>
                  <span class="font-bold uppercase"
                    [class.text-emerald-400]="selectedSpace.estado === 'DISPONIBLE'"
                    [class.text-red-400]="selectedSpace.estado === 'OCUPADO'"
                    [class.text-amber-400]="selectedSpace.estado === 'RESERVADO'">
                    {{ selectedSpace.estado }}
                  </span>
                </div>
                <div class="flex justify-between py-1.5 border-b border-slate-800/60 text-slate-300" *ngIf="selectedSpace.vehiculoId">
                  <span class="text-slate-400">ID Vehículo Estacionado:</span>
                  <span class="font-mono text-amber-300">{{ selectedSpace.vehiculoId }}</span>
                </div>
              </div>

              <!-- Quick Status Change Actions -->
              <div *ngIf="authService.hasRole('Administrador')" class="space-y-2 pt-2 border-t border-slate-800">
                <p class="text-[10px] font-mono text-slate-400 uppercase">Cambiar Estado Manualmente:</p>
                <div class="grid grid-cols-3 gap-2 text-xs">
                  <button (click)="updateState('DISPONIBLE')" 
                    class="py-2 px-2 bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-800 rounded-xl font-bold transition-all">
                    DISPONIBLE
                  </button>
                  <button (click)="updateState('OCUPADO')" 
                    class="py-2 px-2 bg-red-950 hover:bg-red-900 text-red-400 border border-red-800 rounded-xl font-bold transition-all">
                    OCUPADO
                  </button>
                  <button (click)="updateState('RESERVADO')" 
                    class="py-2 px-2 bg-amber-950 hover:bg-amber-900 text-amber-400 border border-amber-800 rounded-xl font-bold transition-all">
                    RESERVADO
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Create Space Modal -->
          <div *ngIf="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
            <div class="glass-card max-w-md w-full p-6 border border-slate-700 shadow-2xl space-y-4">
              <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 class="text-sm font-bold text-white flex items-center gap-2">
                  <i class="fa-solid fa-plus text-cyan-400"></i> Crear Nueva Plaza
                </h3>
                <button (click)="showCreateModal = false" class="text-slate-400 hover:text-white">
                  <i class="fa-solid fa-xmark text-lg"></i>
                </button>
              </div>

              <form (ngSubmit)="onCreateSpace()" class="space-y-4 text-xs">
                <div>
                  <label class="block text-slate-300 mb-1 font-semibold">Zona</label>
                  <select [(ngModel)]="newSpace.zoneId" name="zoneId" required
                    class="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 outline-none">
                    <option *ngFor="let z of zones" [value]="z.zoneId">{{ z.name }}</option>
                  </select>
                </div>

                <div>
                  <label class="block text-slate-300 mb-1 font-semibold">Descripción / Código (ej. E-104)</label>
                  <input type="text" [(ngModel)]="newSpace.description" name="description" required placeholder="E-104"
                    class="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 outline-none">
                </div>

                <div>
                  <label class="block text-slate-300 mb-1 font-semibold">Tipo de Vehículo Permitido</label>
                  <select [(ngModel)]="newSpace.type" name="type" required
                    class="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 outline-none">
                    <option value="AUTO">AUTO 🚗</option>
                    <option value="MOTO">MOTO 🏍️</option>
                    <option value="CAMIONETA">CAMIONETA 🛻</option>
                    <option value="ELECTRICO">ELECTRICO ⚡</option>
                  </select>
                </div>

                <button type="submit" 
                  class="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-white rounded-xl shadow-lg shadow-cyan-500/20">
                  Guardar Plaza
                </button>
              </form>
            </div>
          </div>

    </section>
  `
})
export class ParkingMapComponent implements OnInit, OnDestroy {
  spaces: ParkingSpace[] = [];
  filteredSpaces: ParkingSpace[] = [];
  zones: Zone[] = [];

  loading = true;
  selectedZoneId = '';
  selectedSpace: ParkingSpace | null = null;
  showCreateModal = false;

  newSpace = {
    zoneId: '',
    description: '',
    type: 'AUTO',
    estado: 'DISPONIBLE'
  };

  private sseSub?: Subscription;

  private parkingService = inject(ParkingService);
  private spaceSseService = inject(SpaceSseService);
  authService = inject(AuthService);

  ngOnInit(): void {
    this.loadData();
    this.subscribeToSSE();
  }

  ngOnDestroy(): void {
    this.sseSub?.unsubscribe();
  }

  loadData(): void {
    this.loading = true;
    this.parkingService.getZones().subscribe({
      next: data => {
        this.zones = data;
        if (data.length > 0) this.newSpace.zoneId = data[0].zoneId;
      },
      error: err => console.error(err)
    });

    this.parkingService.getSpaces().subscribe({
      next: data => {
        this.spaces = data;
        this.filteredSpaces = data;
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  subscribeToSSE(): void {
    this.sseSub = this.spaceSseService.getSpaceStream().subscribe({
      next: msg => {
        console.log('⚡ SSE Event Received:', msg);
        const idx = this.spaces.findIndex(s => s.id === msg.id);
        if (idx !== -1) {
          this.spaces[idx].estado = msg.estado;
          if (msg.vehiculoId !== undefined) {
            this.spaces[idx].vehiculoId = msg.vehiculoId;
          }
          this.filterSpaces();
        }
      },
      error: err => console.warn('SSE warning:', err)
    });
  }

  filterSpaces(): void {
    if (!this.selectedZoneId) {
      this.filteredSpaces = this.spaces;
    } else {
      this.filteredSpaces = this.spaces.filter(s => s.zoneId === this.selectedZoneId);
    }
  }

  get visibleZones(): Zone[] {
    return this.zones.filter(zone => this.getSpacesByZone(zone.zoneId).length > 0);
  }

  getSpacesByZone(zoneId: string): ParkingSpace[] {
    return this.filteredSpaces.filter(s => s.zoneId === zoneId);
  }

  getZoneCount(zoneId: string, status: SpaceStatus): number {
    return this.spaces.filter(s => s.zoneId === zoneId && s.estado === status).length;
  }

  openSpaceDetails(space: ParkingSpace): void {
    this.selectedSpace = space;
  }

  updateState(newState: SpaceStatus): void {
    if (!this.selectedSpace) return;
    this.parkingService.updateSpaceState(this.selectedSpace.id, newState).subscribe({
      next: () => {
        if (this.selectedSpace) this.selectedSpace.estado = newState;
        this.selectedSpace = null;
        this.loadData();
      },
      error: err => alert('Error al actualizar estado: ' + (err.error?.detail || err.message))
    });
  }

  onCreateSpace(): void {
    if (!this.newSpace.description || !this.newSpace.zoneId) return;
    this.parkingService.createSpace(this.newSpace).subscribe({
      next: () => {
        this.showCreateModal = false;
        this.loadData();
      },
      error: err => alert('Error al crear plaza: ' + (err.error?.detail || err.message))
    });
  }
}
