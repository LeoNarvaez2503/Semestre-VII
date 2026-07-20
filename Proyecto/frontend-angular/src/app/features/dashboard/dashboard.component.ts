import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ParkingService } from '../../infrastructure/api/parking.service';
import { TicketService } from '../../infrastructure/api/ticket.service';
import { VehicleService } from '../../infrastructure/api/vehicle.service';
import { ParkingSpace } from '../../core/models/space.model';
import { Ticket } from '../../core/models/ticket.model';
import { Vehicle } from '../../core/models/vehicle.model';
import { Zone } from '../../core/models/zone.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="p-4 sm:p-8 bg-[#f7f9fb]">
          <!-- KPI Stats Grid (5 columns like the classic dashboard) -->
          <div class="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <!-- Total Plazas -->
            <div class="bg-white p-6 rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-gray-200/30 relative overflow-hidden group">
              <div class="relative z-10">
                <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Plazas</span>
                <div class="text-3xl font-bold text-black mt-1">{{ spaces.length || '--' }}</div>
              </div>
              <div class="absolute -right-2 -bottom-2 opacity-5 group-hover:scale-110 transition-transform duration-500">
                <span class="material-symbols-outlined text-[80px]">local_parking</span>
              </div>
            </div>
            <!-- Disponibles -->
            <div class="bg-white p-6 rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-gray-200/30 relative overflow-hidden group">
              <div class="relative z-10">
                <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Disponibles</span>
                <div class="text-3xl font-bold text-emerald-600 mt-1">{{ availableCount }}</div>
              </div>
              <div class="absolute -right-2 -bottom-2 opacity-5 group-hover:scale-110 transition-transform duration-500 text-emerald-600">
                <span class="material-symbols-outlined text-[80px]">check_circle</span>
              </div>
            </div>
            <!-- Ocupadas -->
            <div class="bg-white p-6 rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-gray-200/30 relative overflow-hidden group">
              <div class="relative z-10">
                <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Ocupadas</span>
                <div class="text-3xl font-bold text-red-600 mt-1">{{ occupiedCount }}</div>
              </div>
              <div class="absolute -right-2 -bottom-2 opacity-5 group-hover:scale-110 transition-transform duration-500 text-red-600">
                <span class="material-symbols-outlined text-[80px]">directions_car</span>
              </div>
            </div>
            <!-- Reservadas -->
            <div class="bg-white p-6 rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-gray-200/30 relative overflow-hidden group">
              <div class="relative z-10">
                <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Reservadas</span>
                <div class="text-3xl font-bold text-amber-500 mt-1">{{ reservedCount }}</div>
              </div>
              <div class="absolute -right-2 -bottom-2 opacity-5 group-hover:scale-110 transition-transform duration-500 text-amber-500">
                <span class="material-symbols-outlined text-[80px]">schedule</span>
              </div>
            </div>
            <!-- Ocupación % -->
            <div class="bg-white p-6 rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-gray-200/30 relative overflow-hidden group flex flex-col justify-between">
              <div class="relative z-10 flex justify-between items-center w-full">
                <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Ocupación</span>
                <div class="text-xl font-bold text-black">{{ occupancyPercentage }}%</div>
              </div>
              <div class="w-full bg-slate-100 rounded-full h-2 mt-4 overflow-hidden">
                <div class="bg-black h-2 rounded-full transition-all duration-500"
                  [style.width.%]="occupancyPercentage"></div>
              </div>
            </div>
          </div>

          <!-- Plazas de Estacionamiento -->
          <div>
            <h3 class="text-xl font-semibold text-black mb-4 flex items-center gap-2">
              <span>Plazas de Estacionamiento</span>
              <span class="text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                {{ spaces.length }} espacios
              </span>
            </h3>

            <!-- Loading Spinner -->
            <div *ngIf="loadingSpaces" class="text-center py-12">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-black border-t-transparent"></div>
              <p class="text-gray-500 text-sm mt-3 font-medium">Obteniendo distribución de espacios...</p>
            </div>

            <!-- Spaces Grid -->
            <div *ngIf="!loadingSpaces" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              <div *ngFor="let space of spaces" 
                class="bg-white rounded-xl border border-gray-200/30 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] p-5 relative overflow-hidden group hover:shadow-lg transition-all duration-200 cursor-pointer">
                
                <!-- Status indicator dot -->
                <div class="flex items-start justify-between mb-3">
                  <div>
                    <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Espacio</span>
                    <h4 class="text-lg font-bold text-black">{{ space.numero || space.description }}</h4>
                  </div>
                  <div class="w-3 h-3 rounded-full mt-1"
                    [class.bg-emerald-500]="space.estado === 'DISPONIBLE'"
                    [class.bg-red-500]="space.estado === 'OCUPADO'"
                    [class.bg-amber-500]="space.estado === 'RESERVADO'"
                    [ngClass]="{
                      'pulse-green': space.estado === 'DISPONIBLE',
                      'pulse-red': space.estado === 'OCUPADO',
                      'pulse-yellow': space.estado === 'RESERVADO'
                    }">
                  </div>
                </div>

                <!-- Space type icon -->
                <div class="flex items-center gap-2 mb-3">
                  <span class="material-symbols-outlined text-gray-400" style="font-size: 18px;">
                    {{ space.type === 'MOTO' ? 'two_wheeler' : 'directions_car' }}
                  </span>
                  <span class="text-xs text-gray-500 font-medium">{{ space.type }}</span>
                </div>

                <!-- Status badge -->
                <div class="px-3 py-1.5 rounded-lg text-xs font-semibold text-center uppercase tracking-wider"
                  [class.bg-emerald-50]="space.estado === 'DISPONIBLE'" [class.text-emerald-700]="space.estado === 'DISPONIBLE'"
                  [class.bg-red-50]="space.estado === 'OCUPADO'" [class.text-red-700]="space.estado === 'OCUPADO'"
                  [class.bg-amber-50]="space.estado === 'RESERVADO'" [class.text-amber-700]="space.estado === 'RESERVADO'">
                  {{ space.estado }}
                </div>
              </div>
            </div>
          </div>
    </section>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
    .pulse-green {
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
      animation: pulse-g 2s infinite;
    }
    @keyframes pulse-g {
      0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
      70% { transform: scale(1); box-shadow: 0 0 0 5px rgba(16, 185, 129, 0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }
    .pulse-red {
      box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
      animation: pulse-r 2s infinite;
    }
    @keyframes pulse-r {
      0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
      70% { transform: scale(1); box-shadow: 0 0 0 5px rgba(239, 68, 68, 0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
    }
    .pulse-yellow {
      box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.4);
      animation: pulse-y 2s infinite;
    }
    @keyframes pulse-y {
      0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7); }
      70% { transform: scale(1); box-shadow: 0 0 0 5px rgba(245, 158, 11, 0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
    }
  `]
})
export class DashboardComponent implements OnInit {
  spaces: ParkingSpace[] = [];
  zones: Zone[] = [];
  recentTickets: Ticket[] = [];
  vehiclesCount = 0;
  loadingSpaces = true;

  availableCount = 0;
  occupiedCount = 0;
  reservedCount = 0;
  activeTicketsCount = 0;

  private parkingService = inject(ParkingService);
  private ticketService = inject(TicketService);
  private vehicleService = inject(VehicleService);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.parkingService.getSpaces().subscribe({
      next: data => {
        this.spaces = data;
        this.availableCount = data.filter(s => s.estado === 'DISPONIBLE').length;
        this.occupiedCount = data.filter(s => s.estado === 'OCUPADO').length;
        this.reservedCount = data.filter(s => s.estado === 'RESERVADO').length;
        this.loadingSpaces = false;
      },
      error: err => {
        console.error(err);
        this.loadingSpaces = false;
      }
    });

    this.parkingService.getZones().subscribe({
      next: data => this.zones = data,
      error: err => console.error(err)
    });

    this.ticketService.getAllTickets().subscribe({
      next: data => {
        this.recentTickets = data.slice(0, 5);
        this.activeTicketsCount = data.filter(t => t.estado === 'ACTIVO').length;
      },
      error: err => console.error(err)
    });

    this.vehicleService.getVehicles().subscribe({
      next: data => this.vehiclesCount = data.length,
      error: err => console.error(err)
    });
  }

  get occupancyPercentage(): number {
    if (this.spaces.length === 0) return 0;
    return Math.round((this.occupiedCount / this.spaces.length) * 100);
  }
}
