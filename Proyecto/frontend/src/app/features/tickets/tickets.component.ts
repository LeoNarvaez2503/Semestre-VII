import { Component, OnInit, inject, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TicketService } from '../../infrastructure/api/ticket.service';
import { ParkingService } from '../../infrastructure/api/parking.service';
import { VehicleService } from '../../infrastructure/api/vehicle.service';
import { UserService } from '../../infrastructure/api/user.service';
import { AuthService } from '../../infrastructure/api/auth.service';

import { Ticket } from '../../core/models/ticket.model';
import { ParkingSpace } from '../../core/models/space.model';
import { Vehicle } from '../../core/models/vehicle.model';
import { User } from '../../core/models/user.model';

import { CreateTicketModalComponent } from './components/create-ticket-modal.component';
import { CheckoutTicketModalComponent } from './components/checkout-ticket-modal.component';
import { TicketReceiptModalComponent } from './components/ticket-receipt-modal.component';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CreateTicketModalComponent,
    CheckoutTicketModalComponent,
    TicketReceiptModalComponent
  ],
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.css'
})
export class TicketsComponent implements OnInit {
  tickets: Ticket[] = [];
  spaces: ParkingSpace[] = [];
  availableSpaces: ParkingSpace[] = [];
  vehicles: Vehicle[] = [];
  users: User[] = [];

  loading = true;
  filterStatus = 'TODOS';
  searchQuery = '';
  showOnlyMyTickets = false;
  showCreateModal = false;
  selectedTicketForCheckout: Ticket | null = null;
  selectedTicketForReceipt: Ticket | null = null;

  toastMessage: string | null = null;
  toastType: 'success' | 'error' = 'success';
  canUndoAction = false;
  lastActionTicketId: string | null = null;

  private ticketService = inject(TicketService);
  private parkingService = inject(ParkingService);
  private vehicleService = inject(VehicleService);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  @HostListener('window:keydown', ['$event'])
  handleKeyboardShortcut(event: KeyboardEvent): void {
    if (event.altKey && (event.key === 'r' || event.key === 'R')) {
      event.preventDefault();
      this.showCreateModal = true;
    }
  }

  ngOnInit(): void {
    const isAdmin = this.authService.hasRole('Administrador') || this.authService.hasRole('Root');
    if (!isAdmin) {
      this.showOnlyMyTickets = true;
    }
    this.loadData();
  }

  toggleMyTicketsFilter(): void {
    this.showOnlyMyTickets = !this.showOnlyMyTickets;
    this.cdr.markForCheck();
  }

  loadData(): void {
    this.loading = true;
    this.cdr.markForCheck();

    const isAdmin = this.authService.hasRole('Administrador') || this.authService.hasRole('Root');

    this.ticketService.getAllTickets().subscribe({
      next: data => {
        this.tickets = data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: err => {
        console.error(err);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });

    this.parkingService.getSpaces().subscribe({
      next: data => {
        this.spaces = data;
        this.availableSpaces = data.filter(s => s.estado === 'DISPONIBLE');
        this.cdr.markForCheck();
      },
      error: err => console.error(err)
    });

    const vehicleSource = isAdmin ? this.vehicleService.getVehicles() : this.vehicleService.getMyVehicles();
    vehicleSource.subscribe({
      next: data => {
        this.vehicles = data;
        this.cdr.markForCheck();
      },
      error: err => console.error(err)
    });

    if (isAdmin) {
      this.userService.getUsers().subscribe({
        next: data => {
          this.users = data;
          this.cdr.markForCheck();
        },
        error: err => console.error(err)
      });
    } else {
      const curUser = this.authService.currentUser();
      if (curUser) {
        this.users = [curUser];
        this.cdr.markForCheck();
      }
    }
  }

  get filteredTickets(): Ticket[] {
    const curUser = this.authService.currentUser();

    return this.tickets.filter(t => {
      if (this.showOnlyMyTickets && curUser?.id_person && t.id_usuario !== curUser.id_person) {
        return false;
      }
      if (this.filterStatus !== 'TODOS' && t.estado !== this.filterStatus) return false;
      if (this.searchQuery.trim()) {
        const q = this.searchQuery.toLowerCase();
        const matchId = t.id.toLowerCase().includes(q);
        const matchPlate = this.getVehiclePlate(t.id_vehiculo).toLowerCase().includes(q);
        if (!matchId && !matchPlate) return false;
      }
      return true;
    });
  }

  getFilteredCount(status: string): number {
    return this.filteredTickets.length;
  }

  getCount(status: string): number {
    const curUser = this.authService.currentUser();
    return this.tickets.filter(t => {
      if (this.showOnlyMyTickets && curUser?.id_person && t.id_usuario !== curUser.id_person) {
        return false;
      }
      return t.estado === status;
    }).length;
  }

  getVehiclePlate(vehiculoId: string): string {
    const found = this.vehicles.find(v => v.id === vehiculoId);
    return found?.data?.plate || 'Sin placa';
  }

  getSpaceDesc(espacioId: string): string {
    const found = this.spaces.find(s => s.id === espacioId);
    return found?.description || espacioId.substring(0, 6);
  }

  getUserName(userId: string): string {
    const found = this.users.find(u => u.id_person === userId);
    if (!found) return 'Cliente';
    if (found.person?.first_name || found.person?.last_name) {
      return `${found.person.first_name || ''} ${found.person.last_name || ''}`.trim();
    }
    return found.username || 'Cliente';
  }

  onTicketCreated(): void {
    this.showCreateModal = false;
    this.showToast('¡Ticket de entrada emitido correctamente! Barrera habilitada.', 'success');
    this.loadData();
  }

  onTicketPaid(ticketId: string): void {
    this.selectedTicketForCheckout = null;
    this.lastActionTicketId = ticketId;
    this.showToast('¡Pago registrado correctamente! Barrera de salida abierta.', 'success', true);
    this.loadData();
  }

  showToast(message: string, type: 'success' | 'error', canUndo = false): void {
    this.toastMessage = message;
    this.toastType = type;
    this.canUndoAction = canUndo;
    setTimeout(() => {
      this.toastMessage = null;
      this.canUndoAction = false;
    }, 10000);
  }

  undoLastAction(): void {
    this.showToast('Acción revertida. El ticket ha vuelto a estado activo.', 'success');
    this.loadData();
  }
}
