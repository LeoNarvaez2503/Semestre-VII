import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TicketService } from '../../../infrastructure/api/ticket.service';
import { Ticket } from '../../../core/models/ticket.model';

@Component({
  selector: 'app-checkout-ticket-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout-ticket-modal.component.html',
  styleUrl: './checkout-ticket-modal.component.css'
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
