import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Ticket } from '../../../core/models/ticket.model';

@Component({
  selector: 'app-ticket-receipt-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ticket-receipt-modal.component.html',
  styleUrl: './ticket-receipt-modal.component.css'
})
export class TicketReceiptModalComponent {
  @Input() ticket!: Ticket;
  @Input() vehiclePlate = 'Sin placa';
  @Input() spaceDesc = 'Bahía';
  @Input() userName = 'Cliente';

  @Output() close = new EventEmitter<void>();

  printReceipt(): void {
    window.print();
  }
}
