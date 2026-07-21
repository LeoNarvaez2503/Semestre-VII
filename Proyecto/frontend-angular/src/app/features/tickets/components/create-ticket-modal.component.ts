import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TicketService } from '../../../infrastructure/api/ticket.service';
import { ParkingSpace } from '../../../core/models/space.model';
import { Vehicle } from '../../../core/models/vehicle.model';
import { User } from '../../../core/models/user.model';
import { Ticket } from '../../../core/models/ticket.model';

@Component({
  selector: 'app-create-ticket-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fadeIn font-sans select-none">
      <div class="bg-white rounded-2xl shadow-2xl border border-gray-300 max-w-md w-full p-6 space-y-4 text-gray-900">
        
        <div class="flex items-center justify-between border-b border-gray-200 pb-3">
          <h3 class="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <i class="fa-solid fa-ticket text-amber-500"></i> Expedir Nuevo Ticket de Ingreso
          </h3>
          <button (click)="close.emit()" class="text-gray-400 hover:text-gray-900 transition">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <form (ngSubmit)="onSubmit()" class="space-y-4 text-xs">
          
          <!-- Inline Modal Error Alert Banner (H9) -->
          <div *ngIf="modalErrorMessage" class="p-3.5 rounded-xl bg-red-50 border border-red-300 text-red-900 text-xs font-bold flex items-start gap-2.5 animate-fadeIn">
            <i class="fa-solid fa-triangle-exclamation text-red-600 text-base mt-0.5"></i>
            <div class="flex-1 leading-snug">
              <span>{{ modalErrorMessage }}</span>
            </div>
            <button type="button" (click)="modalErrorMessage = null" class="text-red-700 hover:text-red-950 font-black">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <!-- User Selection -->
          <div>
            <label class="block text-gray-700 font-bold mb-1">Usuario / Conductor Propietario *</label>
            <select [(ngModel)]="newTicket.id_usuario" (change)="onUserSelect()" name="id_usuario" required
              class="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 font-semibold focus:ring-2 focus:ring-amber-500 outline-none">
              <option *ngFor="let u of users" [value]="u.id_person">
                {{ u.username }} ({{ u.person?.first_name }} {{ u.person?.last_name }})
              </option>
            </select>
          </div>

          <!-- Registered Vehicles Select Dropdown -->
          <div *ngIf="vehicles && vehicles.length > 0">
            <label class="block text-gray-700 font-bold mb-1">Vehículos Registrados del Usuario *</label>
            <select [(ngModel)]="selectedVehicleId" (change)="onVehicleSelect()" name="vehicleSelect"
              class="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 font-semibold focus:ring-2 focus:ring-amber-500 outline-none">
              <option *ngFor="let v of vehicles" [value]="v.id">
                [{{ v.type.toUpperCase() }}] Placa: {{ v.data?.plate }} ({{ v.data?.brand }} {{ v.data?.model }})
              </option>
              <option value="MANUAL">+ Ingrese otra placa manualmente</option>
            </select>
          </div>

          <!-- Vehicle License Plate Input Mask (H5) -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="block text-gray-700 font-bold">
                Placa del Vehículo *
              </label>
              <span class="text-[10px] text-gray-500 font-mono">
                Auto: PBA-1234 | Moto: AB-123C
              </span>
            </div>
            <div class="relative">
              <input type="text" [(ngModel)]="customPlateInput" (input)="onPlateInputChange()" name="customPlate" required
                placeholder="Ej. PBA-1234 o AB-123C" maxlength="9"
                class="w-full p-2.5 bg-gray-50 border rounded-lg text-gray-900 font-mono font-bold tracking-wider uppercase focus:ring-2 focus:ring-amber-500 outline-none"
                [class.border-emerald-500]="isPlateValid" [class.border-gray-300]="!isPlateValid" />
              <span *ngIf="isPlateValid" class="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 font-bold text-xs flex items-center gap-1">
                <i class="fa-solid fa-circle-check"></i> VÁLIDA
              </span>
            </div>
            <p *ngIf="plateErrorMessage" class="text-[11px] text-red-600 font-bold mt-1">
              <i class="fa-solid fa-triangle-exclamation"></i> {{ plateErrorMessage }}
            </p>
          </div>

          <!-- Space Selection with Automatic Vehicle Type Filter (H5) -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="block text-gray-700 font-bold">Espacio / Plaza Compatible *</label>
              <span class="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                <i class="fa-solid fa-filter"></i> Solo Plazas para {{ detectedVehicleType }}
              </span>
            </div>
            <select [(ngModel)]="newTicket.id_espacio" name="id_espacio" required
              class="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 font-semibold focus:ring-2 focus:ring-amber-500 outline-none">
              <option *ngFor="let s of filteredAvailableSpaces" [value]="s.id">
                {{ s.description }} ({{ s.type }})
              </option>
            </select>
            <p *ngIf="filteredAvailableSpaces.length === 0" class="text-[11px] text-red-600 font-bold mt-1">
              <i class="fa-solid fa-circle-exclamation"></i> No hay plazas disponibles para tipo {{ detectedVehicleType }}.
            </p>
          </div>

          <!-- Submit Button Disabled until Valid (H5) -->
          <button type="submit" [disabled]="!isFormValid || submitting"
            class="w-full py-3 font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            [class.bg-amber-400]="isFormValid && !submitting" [class.text-slate-950]="isFormValid && !submitting" [class.hover:bg-amber-300]="isFormValid && !submitting"
            [class.bg-gray-200]="!isFormValid || submitting" [class.text-gray-400]="!isFormValid || submitting" [class.cursor-not-allowed]="!isFormValid || submitting">
            <i class="fa-solid fa-check"></i>
            {{ submitting ? 'Emitiendo Ticket...' : 'Confirmar Ingreso de Vehículo' }}
          </button>
        </form>
      </div>
    </div>
  `
})
export class CreateTicketModalComponent implements OnInit {
  @Input() availableSpaces: ParkingSpace[] = [];
  @Input() vehicles: Vehicle[] = [];
  @Input() users: User[] = [];
  @Input() existingTickets: Ticket[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() created = new EventEmitter<void>();

  selectedVehicleId = '';
  customPlateInput = '';
  isPlateValid = false;
  plateErrorMessage = '';
  modalErrorMessage: string | null = null;
  submitting = false;

  newTicket = {
    id_usuario: '',
    id_vehiculo: '',
    id_espacio: ''
  };

  private ticketService = inject(TicketService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    if (this.users.length > 0) this.newTicket.id_usuario = this.users[0].id_person;
    if (this.vehicles.length > 0) {
      this.selectedVehicleId = this.vehicles[0].id;
      this.newTicket.id_vehiculo = this.vehicles[0].id;
      this.customPlateInput = this.vehicles[0].data?.plate || '';
      this.onPlateInputChange();
    }
    const compatible = this.filteredAvailableSpaces;
    if (compatible.length > 0) this.newTicket.id_espacio = compatible[0].id;
  }

  onUserSelect(): void {
    if (this.vehicles.length > 0) {
      this.selectedVehicleId = this.vehicles[0].id;
      this.onVehicleSelect();
    }
  }

  onVehicleSelect(): void {
    if (this.selectedVehicleId === 'MANUAL') {
      this.newTicket.id_vehiculo = '';
      this.customPlateInput = '';
      this.isPlateValid = false;
      return;
    }
    const found = this.vehicles.find(v => v.id === this.selectedVehicleId);
    if (found) {
      this.newTicket.id_vehiculo = found.id;
      this.customPlateInput = found.data?.plate || '';
      this.onPlateInputChange();
    }
  }

  get detectedVehicleType(): string {
    const selectedVehicle = this.vehicles.find(v => v.id === this.newTicket.id_vehiculo || (v.data?.plate && v.data.plate.toUpperCase() === this.customPlateInput.toUpperCase()));
    if (selectedVehicle) {
      return selectedVehicle.type.toUpperCase();
    }
    // Infer by plate structure: 2 letters + numbers + letter = MOTO (e.g. AB-123C)
    const clean = this.customPlateInput.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (/^[A-Z]{2}\d{3,4}[A-Z]?$/.test(clean)) {
      return 'MOTO';
    }
    return 'AUTO';
  }

  get filteredAvailableSpaces(): ParkingSpace[] {
    const vType = this.detectedVehicleType;

    const list = this.availableSpaces.filter(s => {
      const spaceDesc = (s.description || '').toUpperCase();
      const spaceType = (s.type || '').toUpperCase();
      const isMotoSpace = spaceDesc.includes('MOTO') || spaceType.includes('MOTO') || spaceDesc.startsWith('M-');

      if (vType === 'MOTO') {
        return isMotoSpace;
      } else {
        return !isMotoSpace;
      }
    });

    if (list.length > 0 && !list.some(s => s.id === this.newTicket.id_espacio)) {
      this.newTicket.id_espacio = list[0].id;
    }

    return list;
  }

  onPlateInputChange(): void {
    let raw = this.customPlateInput.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (raw.length >= 3 && !raw.includes('-')) {
      const match = raw.match(/^([A-Z]{2,3})(\d.*)$/);
      if (match) {
        raw = match[1] + '-' + match[2];
      }
    }
    this.customPlateInput = raw;
    this.modalErrorMessage = null;

    // Supports both Car (PBA-1234) and Moto (AB-123C / AB-1234) plates
    const plateRegex = /^[A-Z]{2,3}-\d{3,4}[A-Z]?$/;
    this.isPlateValid = plateRegex.test(raw);

    if (raw.length >= 5 && !this.isPlateValid) {
      this.plateErrorMessage = 'Formato de placa invalido (Ej: PBA-1234 para Auto, AB-123C para Moto).';
    } else {
      this.plateErrorMessage = '';
    }

    const activeDuplicate = this.existingTickets.find(t => t.estado === 'ACTIVO' && this.getVehiclePlate(t.id_vehiculo).toUpperCase() === raw);
    if (activeDuplicate) {
      this.isPlateValid = false;
      this.plateErrorMessage = `El vehículo con placa ${raw} ya tiene una estancia activa en la bahía ${activeDuplicate.id_espacio}.`;
    }

    const matchedVehicle = this.vehicles.find(v => (v.data?.plate || '').toUpperCase() === raw);
    if (matchedVehicle) {
      this.newTicket.id_vehiculo = matchedVehicle.id;
      this.selectedVehicleId = matchedVehicle.id;
    }

    const compatible = this.filteredAvailableSpaces;
    if (compatible.length > 0 && !compatible.some(s => s.id === this.newTicket.id_espacio)) {
      this.newTicket.id_espacio = compatible[0].id;
    }
  }

  get isFormValid(): boolean {
    return !!(this.newTicket.id_usuario && this.newTicket.id_espacio && (this.isPlateValid || this.newTicket.id_vehiculo));
  }

  private getVehiclePlate(vehiculoId: string): string {
    const found = this.vehicles.find(v => v.id === vehiculoId);
    return found?.data?.plate || 'Sin placa';
  }

  onSubmit(): void {
    this.modalErrorMessage = null;

    if (!this.isFormValid || this.submitting) return;

    const selectedSpace = this.availableSpaces.find(s => s.id === this.newTicket.id_espacio);
    const selectedVehicle = this.vehicles.find(v => v.id === this.newTicket.id_vehiculo || v.data?.plate === this.customPlateInput);

    if (selectedSpace) {
      const spaceDesc = (selectedSpace.description || '').toUpperCase();
      const spaceType = (selectedSpace.type || '').toUpperCase();
      const isMotoSpace = spaceDesc.includes('MOTO') || spaceType.includes('MOTO') || spaceDesc.startsWith('M-');

      const vehType = (selectedVehicle?.type || this.detectedVehicleType).toUpperCase();

      if (vehType === 'AUTO' && isMotoSpace) {
        this.submitting = false;
        this.modalErrorMessage = `Incompatibilidad detectada: El espacio "${selectedSpace.description}" es exclusivo para MOTOCICLETAS. Un automóvil (AUTO) no puede estacionarse en esta plaza. Por favor seleccione un espacio para automóvil.`;
        this.cdr.markForCheck();
        return;
      }
    }

    this.submitting = true;
    this.ticketService.createTicket(this.newTicket).subscribe({
      next: () => {
        setTimeout(() => {
          this.submitting = false;
          this.created.emit();
        }, 500);
      },
      error: err => {
        this.submitting = false;
        let detail = err.error?.detail || err.message;
        if (Array.isArray(err.error?.detail)) {
          detail = err.error.detail.map((d: any) => d.msg || d).join(', ');
        }
        this.modalErrorMessage = 'No se pudo emitir el ticket: ' + detail;
        this.cdr.markForCheck();
      }
    });
  }
}
