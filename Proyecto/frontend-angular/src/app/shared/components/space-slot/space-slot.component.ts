import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParkingSpace } from '../../../core/models/space.model';

@Component({
  selector: 'app-space-slot',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="space-slot-bay relative rounded-xl p-4 transition-all duration-300 cursor-pointer flex flex-col justify-between"
      [class.glow-available]="space.estado === 'DISPONIBLE'"
      [class.glow-occupied]="space.estado === 'OCUPADO'"
      [class.glow-reserved]="space.estado === 'RESERVADO'"
      (click)="selectSpace.emit(space)">
      
      <!-- Top Indicator & Slot Name -->
      <div class="flex items-center justify-between mb-3">
        <span class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700 text-slate-300">
          {{ space.description }}
        </span>
        <div class="flex items-center gap-1.5">
          <span class="w-2.5 h-2.5 rounded-full animate-pulse-subtle"
            [class.bg-emerald-500]="space.estado === 'DISPONIBLE'"
            [class.bg-red-500]="space.estado === 'OCUPADO'"
            [class.bg-amber-500]="space.estado === 'RESERVADO'">
          </span>
          <span class="text-[10px] font-bold tracking-wider uppercase"
            [class.text-emerald-400]="space.estado === 'DISPONIBLE'"
            [class.text-red-400]="space.estado === 'OCUPADO'"
            [class.text-amber-400]="space.estado === 'RESERVADO'">
            {{ space.estado }}
          </span>
        </div>
      </div>

      <!-- Center Vehicle Graphic/Icon -->
      <div class="my-4 flex flex-col items-center justify-center py-3 rounded-lg bg-slate-900/50 border border-slate-800/80">
        <i [class]="getTypeIcon()" class="text-3xl mb-1 transition-transform group-hover:scale-110"
          [class.text-emerald-400]="space.estado === 'DISPONIBLE'"
          [class.text-red-400]="space.estado === 'OCUPADO'"
          [class.text-amber-400]="space.estado === 'RESERVADO'">
        </i>
        <span class="text-[11px] font-medium text-slate-400 uppercase tracking-widest">
          {{ space.type }}
        </span>
      </div>

      <!-- Bottom Details -->
      <div class="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
        <span class="truncate max-w-[120px]" *ngIf="space.vehiculoId">
          <i class="fa-solid fa-car text-[10px] mr-1 text-slate-500"></i>
          ID: {{ space.vehiculoId.substring(0, 6) }}...
        </span>
        <span class="italic text-slate-500" *ngIf="!space.vehiculoId">
          Libre
        </span>
        <i class="fa-solid fa-chevron-right text-[10px] text-slate-600"></i>
      </div>
    </div>
  `,
  styles: [`
    .space-slot-bay {
      background: linear-gradient(145deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.7) 100%);
      min-height: 150px;
    }
    .space-slot-bay:hover {
      transform: translateY(-3px);
      background: linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.9) 100%);
    }
  `]
})
export class SpaceSlotComponent {
  @Input() space!: ParkingSpace;
  @Output() selectSpace = new EventEmitter<ParkingSpace>();

  getTypeIcon(): string {
    switch (this.space.type?.toUpperCase()) {
      case 'MOTO': return 'fa-solid fa-motorcycle';
      case 'CAMIONETA': return 'fa-solid fa-truck-pickup';
      case 'ELECTRICO': return 'fa-solid fa-charging-station';
      default: return 'fa-solid fa-car-side';
    }
  }
}
