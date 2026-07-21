import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
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
    <section class="p-4 sm:p-8 bg-[#f4f5f7] min-h-[calc(100vh-70px)] space-y-6">
      <div class="max-w-7xl mx-auto space-y-6">

        <!-- Zone Overview Summary Cards matching MapaEspaciosView.tsx -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div *ngFor="let z of zones"
            (click)="selectedZoneId = z.zoneId"
            [class.ring-2]="selectedZoneId === z.zoneId"
            class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm transition cursor-pointer hover:shadow-md">
            
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                {{ z.code || z.name }}
              </span>
              <span class="text-xs font-extrabold text-gray-500">
                Capacidad: <span class="text-slate-900">{{ z.capacidad || 100 }}</span>
              </span>
            </div>

            <h3 class="text-lg font-bold text-gray-900 mb-1">{{ z.name }}</h3>
            <p class="text-xs text-gray-500 mb-4">{{ z.description || 'Zona de parqueo logístico de alta rotación.' }}</p>

            <!-- Progress Bar -->
            <div class="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden mb-3 flex">
              <div [style.width.%]="getZoneCount(z.zoneId, 'OCUPADO') * 10" class="bg-red-500 h-full"></div>
              <div [style.width.%]="getZoneCount(z.zoneId, 'RESERVADO') * 10" class="bg-amber-400 h-full"></div>
              <div [style.width.%]="getZoneCount(z.zoneId, 'DISPONIBLE') * 10" class="bg-emerald-500 h-full"></div>
            </div>

            <!-- Stats pill footer -->
            <div class="grid grid-cols-3 gap-1 text-center text-xs pt-1 border-t border-gray-100">
              <div class="bg-emerald-50 p-1.5 rounded">
                <span class="block text-[10px] text-emerald-700 font-bold uppercase">Libres</span>
                <span class="font-extrabold text-emerald-800">{{ getZoneCount(z.zoneId, 'DISPONIBLE') }}</span>
              </div>
              <div class="bg-red-50 p-1.5 rounded">
                <span class="block text-[10px] text-red-700 font-bold uppercase">Ocupados</span>
                <span class="font-extrabold text-red-800">{{ getZoneCount(z.zoneId, 'OCUPADO') }}</span>
              </div>
              <div class="bg-amber-50 p-1.5 rounded">
                <span class="block text-[10px] text-amber-800 font-bold uppercase">Reservados</span>
                <span class="font-extrabold text-amber-900">{{ getZoneCount(z.zoneId, 'RESERVADO') }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Filter Toolbar -->
        <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="relative w-full md:w-72">
            <i class="fa-solid fa-magnifying-glass text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 text-xs"></i>
            <input type="text" [(ngModel)]="searchQuery" (input)="filterSpaces()"
              placeholder="Buscar por ID de espacio o Placa..."
              class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none" />
          </div>

          <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <select [(ngModel)]="selectedZoneId" (change)="filterSpaces()"
              class="border border-gray-300 rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold text-gray-700 bg-white">
              <option value="">Todas las Zonas</option>
              <option *ngFor="let z of zones" [value]="z.zoneId">{{ z.name }}</option>
            </select>

            <select [(ngModel)]="selectedStatus" (change)="filterSpaces()"
              class="border border-gray-300 rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold text-gray-700 bg-white">
              <option value="">Todos los Estados</option>
              <option value="DISPONIBLE">Disponibles / Libres</option>
              <option value="OCUPADO">Ocupados</option>
              <option value="RESERVADO">Reservados</option>
            </select>

            <button *ngIf="authService.hasRole('Administrador') || authService.hasRole('Root')" (click)="showCreateModal = true"
              class="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition shadow-sm">
              <i class="fa-solid fa-plus"></i> Nueva Plaza
            </button>
          </div>
        </div>

        <!-- Grid of Spaces -->
        <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div class="flex items-center justify-between mb-4 pb-2 border-b">
            <h3 class="text-base font-bold text-gray-900">
              Mapa de Espacios Filtrados ({{ filteredSpaces.length }} plazas encontradas)
            </h3>
            <span class="text-xs text-gray-500">
              Haz clic en un espacio para gestionarlo
            </span>
          </div>

          <div *ngIf="loading" class="text-center py-12">
            <i class="fa-solid fa-circle-notch fa-spin text-3xl text-amber-500 mb-2"></i>
            <p class="text-xs text-gray-500 font-mono">Cargando espacios del parqueadero...</p>
          </div>

          <div *ngIf="!loading && filteredSpaces.length === 0" class="p-12 text-center text-gray-400">
            <i class="fa-solid fa-car-rear text-4xl mb-3"></i>
            <p class="text-sm font-semibold">No se encontraron espacios con los filtros seleccionados.</p>
          </div>

          <div *ngIf="!loading && filteredSpaces.length > 0"
            class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            <app-space-slot *ngFor="let space of filteredSpaces"
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
  selectedStatus = '';
  searchQuery = '';
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
  private cdr = inject(ChangeDetectorRef);
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
    this.cdr.markForCheck();

    this.parkingService.getZones().subscribe({
      next: data => {
        this.zones = data;
        if (data.length > 0) this.newSpace.zoneId = data[0].zoneId;
        this.cdr.markForCheck();
      },
      error: err => {
        console.error(err);
        this.cdr.markForCheck();
      }
    });

    this.parkingService.getSpaces().subscribe({
      next: data => {
        this.spaces = data;
        this.filterSpaces();
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
          this.cdr.markForCheck();
        }
      },
      error: err => console.warn('SSE warning:', err)
    });
  }

  filterSpaces(): void {
    this.filteredSpaces = this.spaces.filter(s => {
      if (this.selectedZoneId && s.zoneId !== this.selectedZoneId) return false;
      if (this.selectedStatus && s.estado !== this.selectedStatus) return false;
      if (this.searchQuery.trim()) {
        const q = this.searchQuery.toLowerCase();
        const matchId = (s.numero || s.description || s.id).toLowerCase().includes(q);
        const matchPlate = s.vehiculoId?.toLowerCase().includes(q);
        if (!matchId && !matchPlate) return false;
      }
      return true;
    });
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
