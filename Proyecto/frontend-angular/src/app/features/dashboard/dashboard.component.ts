import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { SpaceSlotComponent } from '../../shared/components/space-slot/space-slot.component';
import { ParkingService } from '../../infrastructure/api/parking.service';
import { TicketService } from '../../infrastructure/api/ticket.service';
import { VehicleService } from '../../infrastructure/api/vehicle.service';
import { AuthService } from '../../infrastructure/api/auth.service';
import { ParkingSpace, SpaceStatus } from '../../core/models/space.model';
import { Ticket } from '../../core/models/ticket.model';
import { Vehicle } from '../../core/models/vehicle.model';
import { Zone } from '../../core/models/zone.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SpaceSlotComponent],
  template: `
    <section class="p-4 sm:p-8 bg-[#f4f5f7] min-h-[calc(100vh-70px)]">
      <div class="max-w-7xl mx-auto space-y-6">

        <!-- 4 Bento KPI Cards matching KpiCards.tsx -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- TOTAL PLAZAS -->
          <div (click)="filterStatus = 'TODOS'"
            [class.ring-2]="filterStatus === 'TODOS'"
            class="bg-white rounded-lg p-5 border shadow-sm transition-all duration-200 cursor-pointer border-l-[6px] border-l-amber-400 hover:shadow-md border-gray-200">
            <div class="text-gray-500 font-bold text-xs sm:text-sm tracking-wider uppercase mb-1">
              TOTAL PLAZAS
            </div>
            <div class="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              {{ spaces.length || 300 }}
            </div>
          </div>

          <!-- DISPONIBLES -->
          <div (click)="filterStatus = 'DISPONIBLE'"
            [class.ring-2]="filterStatus === 'DISPONIBLE'"
            class="bg-white rounded-lg p-5 border shadow-sm transition-all duration-200 cursor-pointer border-l-[6px] border-l-emerald-600 hover:shadow-md flex items-center justify-between border-gray-200">
            <div>
              <div class="text-gray-500 font-bold text-xs sm:text-sm tracking-wider uppercase mb-1">
                DISPONIBLES
              </div>
              <div class="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                {{ availableCount }}
              </div>
            </div>
            <div class="p-2 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
              <i class="fa-solid fa-circle-check text-2xl"></i>
            </div>
          </div>

          <!-- OCUPADAS -->
          <div (click)="filterStatus = 'OCUPADO'"
            [class.ring-2]="filterStatus === 'OCUPADO'"
            class="bg-white rounded-lg p-5 border shadow-sm transition-all duration-200 cursor-pointer border-l-[6px] border-l-red-600 hover:shadow-md flex items-center justify-between border-gray-200">
            <div>
              <div class="text-gray-500 font-bold text-xs sm:text-sm tracking-wider uppercase mb-1">
                OCUPADAS
              </div>
              <div class="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                {{ occupiedCount }}
              </div>
            </div>
            <div class="p-2 rounded-full bg-red-50 text-red-600 border border-red-200">
              <i class="fa-solid fa-car text-2xl"></i>
            </div>
          </div>

          <!-- RESERVADAS -->
          <div (click)="filterStatus = 'RESERVADO'"
            [class.ring-2]="filterStatus === 'RESERVADO'"
            class="bg-white rounded-lg p-5 border shadow-sm transition-all duration-200 cursor-pointer border-l-[6px] border-l-amber-500 hover:shadow-md flex items-center justify-between border-gray-200">
            <div>
              <div class="text-gray-500 font-bold text-xs sm:text-sm tracking-wider uppercase mb-1">
                RESERVADAS
              </div>
              <div class="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                {{ reservedCount }}
              </div>
            </div>
            <div class="p-2 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
              <i class="fa-solid fa-clock text-2xl"></i>
            </div>
          </div>
        </div>

        <!-- Floor Map Component Container matching FloorMap.tsx -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
          
          <!-- Control Bar -->
          <div class="p-4 sm:p-5 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="flex flex-wrap items-center gap-3">
              <h2 class="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                Miniature Floor Map: <span class="text-amber-600">{{ activeZoneName }}</span>
              </h2>

              <select [(ngModel)]="selectedZoneId"
                class="bg-white border border-gray-300 font-semibold text-xs sm:text-sm text-gray-700 py-1.5 px-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer">
                <option value="">Todas las Zonas</option>
                <option *ngFor="let z of zones" [value]="z.zoneId">{{ z.name }}</option>
              </select>
            </div>

            <!-- Search & Filters -->
            <div class="flex flex-wrap items-center gap-3">
              <div class="relative flex-1 sm:w-64">
                <i class="fa-solid fa-magnifying-glass text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 text-xs"></i>
                <input type="text" [(ngModel)]="searchQuery"
                  placeholder="Buscar placa o espacio (ej. P-1234, A-101)..."
                  class="w-full bg-white border border-gray-300 rounded-md pl-8 pr-3 py-1.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm" />
              </div>

              <!-- Status Buttons -->
              <div class="flex items-center gap-1 bg-gray-200 p-1 rounded-md text-xs font-bold">
                <button (click)="filterStatus = 'TODOS'"
                  [class]="filterStatus === 'TODOS' ? 'bg-white text-gray-900 shadow-sm px-2.5 py-1 rounded' : 'px-2.5 py-1 text-gray-600 hover:text-gray-900'">
                  Todos
                </button>
                <button (click)="filterStatus = 'DISPONIBLE'"
                  [class]="filterStatus === 'DISPONIBLE' ? 'bg-emerald-600 text-white shadow-sm px-2.5 py-1 rounded' : 'px-2.5 py-1 text-emerald-700 hover:bg-emerald-100'">
                  Libres
                </button>
                <button (click)="filterStatus = 'OCUPADO'"
                  [class]="filterStatus === 'OCUPADO' ? 'bg-red-600 text-white shadow-sm px-2.5 py-1 rounded' : 'px-2.5 py-1 text-red-700 hover:bg-red-100'">
                  Ocupados
                </button>
                <button (click)="filterStatus = 'RESERVADO'"
                  [class]="filterStatus === 'RESERVADO' ? 'bg-amber-500 text-slate-900 shadow-sm px-2.5 py-1 rounded' : 'px-2.5 py-1 text-amber-800 hover:bg-amber-100'">
                  Reservados
                </button>
              </div>
            </div>
          </div>

          <!-- Asphalt Ground Canvas -->
          <div class="relative bg-[#bdc1c6] p-6 sm:p-8 overflow-x-auto border-t border-gray-300 shadow-inner">
            <div class="absolute inset-0 opacity-20 bg-[radial-gradient(#475569_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none"></div>

            <div *ngIf="loadingSpaces" class="text-center py-16">
              <i class="fa-solid fa-circle-notch fa-spin text-3xl text-slate-700 mb-2"></i>
              <p class="text-xs font-bold text-slate-800">Cargando plano y bahías de estacionamiento...</p>
            </div>

            <!-- Floor Layout Grid matching FloorMap.tsx -->
            <div *ngIf="!loadingSpaces" class="relative max-w-6xl mx-auto flex items-stretch justify-between gap-2 sm:gap-4 min-w-[820px] select-none">
              
              <!-- Columns with Driving Aisles -->
              <ng-container *ngFor="let col of columns; let colIdx = index">
                
                <div class="flex-1 flex flex-col justify-between">
                  <!-- Top Block -->
                  <div class="flex flex-col gap-3">
                    <app-space-slot *ngFor="let spot of col.slice(0, 3)" [space]="spot" (selectSpace)="openSpotDetail($event)"></app-space-slot>
                  </div>

                  <!-- Horizontal Zebra Buffer Row -->
                  <div class="my-4 h-6 w-full bg-[repeating-linear-gradient(135deg,#e2e8f0,#e2e8f0_10px,#94a3b8_10px,#94a3b8_20px)] rounded border border-slate-400 opacity-70"></div>

                  <!-- Bottom Block -->
                  <div class="flex flex-col gap-3">
                    <app-space-slot *ngFor="let spot of col.slice(3, 5)" [space]="spot" (selectSpace)="openSpotDetail($event)"></app-space-slot>
                  </div>
                </div>

                <!-- Drive Aisle Arrow -->
                <div *ngIf="colIdx < 4" class="w-10 sm:w-12 flex flex-col items-center justify-around py-4 text-white drop-shadow">
                  <svg width="22" height="38" viewBox="0 0 28 42" fill="white" class="drop-shadow opacity-90 my-auto">
                    <path [attr.d]="colIdx % 2 === 0 ? 'M10 0H18V24H26L14 42L2 24H10V0Z' : 'M18 42H10V18H2L14 0L26 18H18V42Z'" fill="white"/>
                  </svg>
                  <svg width="22" height="38" viewBox="0 0 28 42" fill="white" class="drop-shadow opacity-90 my-auto">
                    <path [attr.d]="colIdx % 2 === 0 ? 'M10 0H18V24H26L14 42L2 24H10V0Z' : 'M18 42H10V18H2L14 0L26 18H18V42Z'" fill="white"/>
                  </svg>
                </div>

              </ng-container>

            </div>
          </div>

          <!-- Map Legend Footer -->
          <div class="bg-gray-100 px-6 py-3 border-t border-gray-300 flex flex-wrap items-center justify-between text-xs text-gray-700 font-semibold gap-4">
            <div class="flex items-center gap-6">
              <div class="flex items-center gap-2">
                <span class="w-4 h-4 rounded bg-[#e6f4ea] border-2 border-[#15803d] inline-block"></span>
                <span>Espacio Libre</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-4 h-4 rounded bg-[#e6f4ea] border-2 border-[#15803d] inline-flex items-center justify-center">
                  <span class="w-2.5 h-1.5 bg-red-600 rounded-sm"></span>
                </span>
                <span>Espacio Ocupado (con vehículo)</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-4 h-4 rounded bg-[#f59e0b] border-2 border-[#d97706] inline-block"></span>
                <span>Espacio Reservado</span>
              </div>
            </div>

            <div class="text-gray-500 font-medium">
              Flechas blancas indican sentido de circulación. Haz clic en una plaza para gestionarla.
            </div>
          </div>

        </div>

      </div>

      <!-- Spot Detail Modal -->
      <div *ngIf="selectedSpot" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <div class="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-lg w-full overflow-hidden">
          <div class="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="text-amber-400 font-extrabold text-xl">{{ selectedSpot.numero || selectedSpot.id }}</span>
              <span class="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded font-semibold border border-slate-700">
                Plaza {{ selectedSpot.tipo || selectedSpot.type || 'ESTÁNDAR' }}
              </span>
            </div>
            <button (click)="selectedSpot = null" class="text-slate-400 hover:text-white">
              <i class="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>

          <div class="p-6 space-y-5">
            <div class="flex items-center justify-between p-3.5 rounded-lg border">
              <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">Estado Actual</span>
              <span class="font-extrabold text-xs px-3 py-1 rounded-full border uppercase"
                [class.bg-emerald-100]="selectedSpot.estado === 'DISPONIBLE'" [class.text-emerald-800]="selectedSpot.estado === 'DISPONIBLE'"
                [class.bg-red-100]="selectedSpot.estado === 'OCUPADO'" [class.text-red-800]="selectedSpot.estado === 'OCUPADO'"
                [class.bg-amber-100]="selectedSpot.estado === 'RESERVADO'" [class.text-amber-900]="selectedSpot.estado === 'RESERVADO'">
                ● {{ selectedSpot.estado }}
              </span>
            </div>

            <div *ngIf="selectedSpot.vehiculoId" class="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-2 text-xs">
              <div class="flex justify-between items-center">
                <span class="text-gray-500 font-bold">Vehículo Registrado:</span>
                <span class="font-mono font-extrabold text-gray-900 bg-amber-100 px-2.5 py-0.5 rounded border border-amber-300">
                  {{ selectedSpot.vehiculoId }}
                </span>
              </div>
            </div>

            <!-- Action buttons for editing space status -->
            <div *ngIf="authService.hasRole('Administrador') || authService.hasRole('Root')" class="space-y-2 pt-2 border-t border-gray-200">
              <p class="text-[10px] font-bold text-gray-500 uppercase">Cambiar Estado de la Plaza:</p>
              <div class="grid grid-cols-3 gap-2 text-xs">
                <button (click)="changeSpotState('DISPONIBLE')" class="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow">
                  LIBRE
                </button>
                <button (click)="changeSpotState('OCUPADO')" class="py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow">
                  OCUPADO
                </button>
                <button (click)="changeSpotState('RESERVADO')" class="py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg shadow">
                  RESERVADO
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class DashboardComponent implements OnInit {
  spaces: ParkingSpace[] = [];
  zones: Zone[] = [];
  loadingSpaces = true;

  selectedZoneId = '';
  searchQuery = '';
  filterStatus = 'TODOS';
  selectedSpot: ParkingSpace | null = null;

  availableCount = 0;
  occupiedCount = 0;
  reservedCount = 0;

  authService = inject(AuthService);
  private parkingService = inject(ParkingService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.parkingService.getSpaces().subscribe({
      next: data => {
        this.spaces = data;
        this.updateCounts();
        this.loadingSpaces = false;
        this.cdr.markForCheck();
      },
      error: err => {
        console.error(err);
        this.loadingSpaces = false;
        this.cdr.markForCheck();
      }
    });

    this.parkingService.getZones().subscribe({
      next: data => {
        this.zones = data;
        this.cdr.markForCheck();
      },
      error: err => console.error(err)
    });
  }

  updateCounts(): void {
    this.availableCount = this.spaces.filter(s => s.estado === 'DISPONIBLE').length;
    this.occupiedCount = this.spaces.filter(s => s.estado === 'OCUPADO').length;
    this.reservedCount = this.spaces.filter(s => s.estado === 'RESERVADO').length;
  }

  get activeZoneName(): string {
    if (!this.selectedZoneId) return 'Zona Industrial A';
    const z = this.zones.find(item => item.zoneId === this.selectedZoneId);
    return z ? z.name : 'Zona Industrial A';
  }

  get filteredSpaces(): ParkingSpace[] {
    return this.spaces.filter(spot => {
      if (this.selectedZoneId && spot.zoneId !== this.selectedZoneId) return false;
      if (this.filterStatus !== 'TODOS' && spot.estado !== this.filterStatus) return false;
      if (this.searchQuery.trim()) {
        const q = this.searchQuery.toLowerCase();
        const matchId = (spot.numero || spot.id).toLowerCase().includes(q);
        const matchPlate = spot.vehiculoId?.toLowerCase().includes(q);
        if (!matchId && !matchPlate) return false;
      }
      return true;
    });
  }

  get columns(): ParkingSpace[][] {
    const cols: ParkingSpace[][] = [[], [], [], [], []];
    this.filteredSpaces.forEach((spot, idx) => {
      cols[idx % 5].push(spot);
    });
    return cols;
  }

  openSpotDetail(spot: ParkingSpace): void {
    this.selectedSpot = spot;
    this.cdr.markForCheck();
  }

  changeSpotState(newStatus: SpaceStatus): void {
    if (!this.selectedSpot) return;
    const spotId = this.selectedSpot.id;
    this.parkingService.updateSpaceState(spotId, newStatus).subscribe({
      next: updated => {
        this.spaces = this.spaces.map(s => s.id === spotId ? { ...s, estado: newStatus } : s);
        this.updateCounts();
        this.selectedSpot = null;
        this.cdr.markForCheck();
      },
      error: err => console.error(err)
    });
  }
}
