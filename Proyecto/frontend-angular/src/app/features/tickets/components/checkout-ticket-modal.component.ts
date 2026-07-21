import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TicketService } from '../../../infrastructure/api/ticket.service';
import { Ticket } from '../../../core/models/ticket.model';

@Component({
  selector: 'app-checkout-ticket-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fadeIn font-sans select-none">
      <div class="bg-white rounded-2xl shadow-2xl border border-amber-400/80 max-w-md w-full overflow-hidden text-gray-900">
        
        <!-- Header -->
        <div class="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-amber-400 text-slate-950 font-black flex items-center justify-center shadow text-base">
              <i class="fa-solid fa-calculator"></i>
            </div>
            <div>
              <h3 class="text-base font-extrabold text-white">Desglose de Cobro de Estancia</h3>
              <p class="text-[10px] text-amber-400 font-mono">Ticket #{{ ticket.id.substring(0, 8) }}</p>
            </div>
          </div>
          <button (click)="close.emit()" class="text-slate-400 hover:text-white p-1 transition">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <!-- Fare Breakdown Body (H6) -->
        <div class="p-6 space-y-4 text-xs">
          
          <div *ngIf="modalErrorMessage" class="p-3.5 rounded-xl bg-red-50 border border-red-300 text-red-900 text-xs font-bold flex items-start gap-2 animate-fadeIn">
            <i class="fa-solid fa-circle-exclamation text-red-600 mt-0.5"></i>
            <span>{{ modalErrorMessage }}</span>
          </div>

          <div class="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2.5 font-mono">
            <div class="flex justify-between items-center">
              <span class="text-gray-500 font-bold">Vehículo:</span>
              <span class="font-extrabold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded border border-amber-300">
                {{ vehiclePlate }}
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-500 font-bold">Plaza Asignada:</span>
              <span class="font-bold text-gray-800">{{ spaceDesc }}</span>
            </div>
            <div class="flex justify-between items-center border-t border-gray-200 pt-2">
              <span class="text-gray-500 font-bold">Hora de Ingreso:</span>
              <span class="font-bold text-gray-800">{{ ticket.hora_ingreso | date:'short' }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-500 font-bold">Hora Actual de Salida:</span>
              <span class="font-bold text-gray-800">{{ nowTime | date:'short' }}</span>
            </div>
            <div class="flex justify-between items-center text-amber-800 font-bold pt-1">
              <span>Tiempo Estacionado:</span>
              <span>{{ calculatedDuration }}</span>
            </div>
            <div class="flex justify-between items-center pt-2 border-t border-gray-300 text-sm font-black">
              <span class="text-gray-900">Monto Total Calculado:</span>
              <span class="text-emerald-600 text-base font-bold">$ {{ calculatedTotal | number:'1.2-2' }} USD</span>
            </div>
          </div>

          <!-- Ticket Extraviado Checkbox Toggle -->
          <label class="flex items-center gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 cursor-pointer select-none">
            <input type="checkbox" [(ngModel)]="isLostTicket" (change)="recalculateTotal()"
              class="w-4 h-4 text-amber-600 rounded focus:ring-amber-500 accent-amber-600" />
            <div class="text-xs">
              <span class="font-extrabold text-amber-900 block">Ticket Extraviado (Tarifa Plana Máxima)</span>
              <span class="text-[10px] text-amber-700 font-medium">Aplica cobro plano de $15.00 USD con autorización de garita.</span>
            </div>
          </label>

          <!-- Actions with Barrier Confirmation (H3) -->
          <div class="pt-2 flex items-center gap-3">
            <button (click)="close.emit()"
              class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-xl text-xs transition">
              Cancelar
            </button>
            <button (click)="processPayment()" [disabled]="submitting"
              class="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3 rounded-xl text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer">
              <i class="fa-solid fa-barrier"></i>
              {{ submitting ? 'Procesando...' : 'Confirmar Pago & Abrir Barrera' }}
            </button>
          </div>
        </div>

      </div>
    </div>
  `
})
export class CheckoutTicketModalComponent implements OnInit {
  @Input() ticket!: Ticket;
  @Input() vehiclePlate = 'Sin placa';
  @Input() spaceDesc = 'Bahía';

  @Output() close = new EventEmitter<void>();
  @Output() paid = new EventEmitter<string>();

  isLostTicket = false;
  calculatedDuration = '0h 0m';
  calculatedTotal = 0;
  nowTime = new Date();
  submitting = false;
  modalErrorMessage: string | null = null;

  private ticketService = inject(TicketService);

  ngOnInit(): void {
    this.calculateFare();
  }

  calculateFare(): void {
    this.nowTime = new Date();
    const start = new Date(this.ticket.hora_ingreso).getTime();
    const diffMs = Math.max(0, this.nowTime.getTime() - start);
    const mins = Math.floor(diffMs / 60000);
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    this.calculatedDuration = `${hrs}h ${remMins}m`;

    const fractions = Math.max(1, Math.ceil(mins / 15));
    this.calculatedTotal = Number((fractions * 0.50).toFixed(2));
  }

  recalculateTotal(): void {
    if (this.isLostTicket) {
      this.calculatedTotal = 15.00;
    } else {
      this.calculateFare();
    }
  }

  processPayment(): void {
    if (this.submitting || !this.ticket) return;

    this.submitting = true;
    this.modalErrorMessage = null;

    this.ticketService.payTicket(this.ticket.id).subscribe({
      next: () => {
        setTimeout(() => {
          this.submitting = false;
          this.paid.emit(this.ticket.id);
        }, 500);
      },
      error: err => {
        this.submitting = false;
        const detail = err.error?.detail || err.message;
        this.modalErrorMessage = 'Error al procesar cobro: ' + detail;
      }
    });
  }
}
