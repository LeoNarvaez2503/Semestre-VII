import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../../infrastructure/api/auth.service';
import { ParkingSpace, SpaceStatus } from '../../../core/models/space.model';

@Component({
  selector: 'app-spot-detail-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm font-sans select-none animate-fadeIn">
      <div class="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-lg w-full overflow-hidden">
        
        <div class="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="text-amber-400 font-extrabold text-xl">{{ spot.numero || spot.id }}</span>
            <span class="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded font-semibold border border-slate-700">
              Plaza {{ spot.tipo || spot.type || 'ESTÁNDAR' }}
            </span>
          </div>
          <button (click)="close.emit()" class="text-slate-400 hover:text-white p-1 transition">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <div class="p-6 space-y-5">
          <div class="flex items-center justify-between p-3.5 rounded-xl border border-gray-200 bg-gray-50">
            <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">Estado Actual</span>
            <span class="font-extrabold text-xs px-3 py-1 rounded-full border uppercase"
              [class.bg-emerald-100]="spot.estado === 'DISPONIBLE'" [class.text-emerald-800]="spot.estado === 'DISPONIBLE'" [class.border-emerald-300]="spot.estado === 'DISPONIBLE'"
              [class.bg-red-100]="spot.estado === 'OCUPADO'" [class.text-red-800]="spot.estado === 'OCUPADO'" [class.border-red-300]="spot.estado === 'OCUPADO'"
              [class.bg-amber-100]="spot.estado === 'RESERVADO'" [class.text-amber-900]="spot.estado === 'RESERVADO'" [class.border-amber-300]="spot.estado === 'RESERVADO'">
              ● {{ spot.estado }}
            </span>
          </div>

          <div *ngIf="spot.vehiculoId" class="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-2 text-xs">
            <div class="flex justify-between items-center">
              <span class="text-gray-500 font-bold">Vehículo Registrado:</span>
              <span class="font-mono font-extrabold text-gray-900 bg-amber-100 px-2.5 py-0.5 rounded border border-amber-300">
                {{ spot.vehiculoId }}
              </span>
            </div>
          </div>

          <!-- Action buttons for editing space status -->
          <div *ngIf="authService.hasRole('Administrador') || authService.hasRole('Root')" class="space-y-2 pt-2 border-t border-gray-200">
            <p class="text-[10px] font-bold text-gray-500 uppercase">Cambiar Estado de la Plaza:</p>
            <div class="grid grid-cols-3 gap-2 text-xs">
              <button (click)="stateChange.emit('DISPONIBLE')" class="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow transition cursor-pointer">
                LIBRE
              </button>
              <button (click)="stateChange.emit('OCUPADO')" class="py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl shadow transition cursor-pointer">
                OCUPADO
              </button>
              <button (click)="stateChange.emit('RESERVADO')" class="py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold rounded-xl shadow transition cursor-pointer">
                RESERVADO
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  `
})
export class SpotDetailModalComponent {
  @Input() spot!: ParkingSpace;

  @Output() close = new EventEmitter<void>();
  @Output() stateChange = new EventEmitter<SpaceStatus>();

  authService = inject(AuthService);
}
