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
  templateUrl: './create-ticket-modal.component.html',
  styleUrl: './create-ticket-modal.component.css'
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
