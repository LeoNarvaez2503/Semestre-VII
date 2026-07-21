import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LicensePlateComponent } from '../../shared/components/license-plate/license-plate.component';
import { TicketService } from '../../infrastructure/api/ticket.service';
import { ParkingService } from '../../infrastructure/api/parking.service';
import { VehicleService } from '../../infrastructure/api/vehicle.service';
import { UserService } from '../../infrastructure/api/user.service';
import { AuthService } from '../../infrastructure/api/auth.service';
import { Ticket } from '../../core/models/ticket.model';
import { ParkingSpace } from '../../core/models/space.model';
import { Vehicle } from '../../core/models/vehicle.model';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [CommonModule, FormsModule, LicensePlateComponent],
  template: `
    <section class="feature-dark min-h-[calc(100vh-73px)] p-4 sm:p-6 space-y-6">
          
          <!-- Header Bar -->
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h2 class="text-2xl font-extrabold text-white flex items-center gap-2">
                <i class="fa-solid fa-ticket text-amber-400"></i> Expedición y Pago de Tickets
              </h2>
              <p class="text-xs text-slate-400 mt-1">
                Control de estancia, cálculo automático de tarifa por hora e impresión de comprobante.
              </p>
            </div>

            <button (click)="showCreateModal = true"
              class="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all">
              <i class="fa-solid fa-plus-circle"></i> Nuevo Ticket de Entrada
            </button>
          </div>

          <!-- Tickets Table Grid -->
          <div class="glass-card border border-slate-800 overflow-hidden">
            <div class="p-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
              <h3 class="text-xs font-bold text-slate-200 uppercase tracking-wider">Historial de Registros</h3>
              <div class="flex gap-2">
                <button (click)="filterStatus = 'TODOS'" [class.bg-slate-800]="filterStatus === 'TODOS'"
                  class="px-2.5 py-1 text-[10px] font-mono rounded-lg text-slate-300 border border-slate-700">
                  Todos
                </button>
                <button (click)="filterStatus = 'ACTIVO'" [class.bg-amber-950]="filterStatus === 'ACTIVO'"
                  class="px-2.5 py-1 text-[10px] font-mono rounded-lg text-amber-400 border border-amber-800 font-bold">
                  Activos ({{ getCount('ACTIVO') }})
                </button>
                <button (click)="filterStatus = 'PAGADO'" [class.bg-emerald-950]="filterStatus === 'PAGADO'"
                  class="px-2.5 py-1 text-[10px] font-mono rounded-lg text-emerald-400 border border-emerald-800 font-bold">
                  Pagados
                </button>
              </div>
            </div>

            <div *ngIf="loading" class="text-center py-12 text-xs text-slate-400 font-mono">
              <i class="fa-solid fa-circle-notch fa-spin text-amber-400 text-2xl mb-2"></i>
              <p>Cargando tickets de estancia...</p>
            </div>

            <div *ngIf="!loading && filteredTickets.length === 0" class="p-12 text-center text-xs text-slate-500">
              No hay tickets registrados en esta vista.
            </div>

            <div *ngIf="!loading && filteredTickets.length > 0" class="overflow-x-auto">
              <table class="w-full text-left text-xs text-slate-300">
                <thead class="bg-slate-950 text-[10px] font-mono uppercase text-slate-400 border-b border-slate-800">
                  <tr>
                    <th class="p-3.5">ID Ticket</th>
                    <th class="p-3.5">Vehículo / Placa</th>
                    <th class="p-3.5">Espacio Asignado</th>
                    <th class="p-3.5">Hora Ingreso</th>
                    <th class="p-3.5">Estado</th>
                    <th class="p-3.5">Tarifa Total</th>
                    <th class="p-3.5 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-800/60">
                  <tr *ngFor="let t of filteredTickets" class="hover:bg-slate-900/50 transition-all">
                    <td class="p-3.5 font-mono font-bold text-amber-300">#{{ t.id.substring(0, 8) }}</td>
                    <td class="p-3.5">
                      <app-license-plate [plateNumber]="getVehiclePlate(t.id_vehiculo)" size="sm"></app-license-plate>
                    </td>
                    <td class="p-3.5 font-mono">
                      <span class="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-400 font-bold">
                        {{ getSpaceDesc(t.id_espacio) }}
                      </span>
                    </td>
                    <td class="p-3.5 font-mono text-slate-400">
                      {{ t.hora_ingreso | date:'mediumTime' }}
                    </td>
                    <td class="p-3.5">
                      <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase"
                        [class.bg-amber-950]="t.estado === 'ACTIVO'" [class.text-amber-400]="t.estado === 'ACTIVO'" [class.border]="t.estado === 'ACTIVO'" [class.border-amber-800]="t.estado === 'ACTIVO'"
                        [class.bg-emerald-950]="t.estado === 'PAGADO'" [class.text-emerald-400]="t.estado === 'PAGADO'" [class.border]="t.estado === 'PAGADO'" [class.border-emerald-800]="t.estado === 'PAGADO'">
                        {{ t.estado }}
                      </span>
                    </td>
                    <td class="p-3.5 font-mono font-bold">
                      <span *ngIf="t.tarifa_total" class="text-emerald-400">$ {{ t.tarifa_total | number:'1.2-2' }}</span>
                      <span *ngIf="!t.tarifa_total" class="text-amber-400 italic">En curso ($2.00/h)</span>
                    </td>
                    <td class="p-3.5 text-right">
                      <button *ngIf="t.estado === 'ACTIVO'" (click)="openPayModal(t)"
                        class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[11px] shadow transition-all">
                        <i class="fa-solid fa-cash-register mr-1"></i> Cobrar / Salida
                      </button>
                      <button *ngIf="t.estado === 'PAGADO'" (click)="openReceipt(t)"
                        class="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] transition-all">
                        <i class="fa-solid fa-receipt mr-1"></i> Comprobante
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Create Ticket Modal -->
          <div *ngIf="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
            <div class="glass-card max-w-md w-full p-6 border border-slate-700 shadow-2xl space-y-4">
              <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 class="text-sm font-bold text-white flex items-center gap-2">
                  <i class="fa-solid fa-ticket text-amber-400"></i> Expedir Nuevo Ticket
                </h3>
                <button (click)="showCreateModal = false" class="text-slate-400 hover:text-white">
                  <i class="fa-solid fa-xmark text-lg"></i>
                </button>
              </div>

              <form (ngSubmit)="onCreateTicket()" class="space-y-4 text-xs">
                <div>
                  <label class="block text-slate-300 mb-1 font-semibold">Seleccionar Usuario</label>
                  <select [(ngModel)]="newTicket.id_usuario" name="id_usuario" required
                    class="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 outline-none">
                    <option *ngFor="let u of users" [value]="u.id_person">
                      {{ u.username }} ({{ u.person?.first_name }} {{ u.person?.last_name }})
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-slate-300 mb-1 font-semibold">Seleccionar Vehículo</label>
                  <select [(ngModel)]="newTicket.id_vehiculo" name="id_vehiculo" required
                    class="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 outline-none">
                    <option *ngFor="let v of vehicles" [value]="v.id">
                      {{ v.type }}: {{ v.data?.plate }} ({{ v.data?.brand }} {{ v.data?.model }})
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-slate-300 mb-1 font-semibold">Seleccionar Espacio Disponible</label>
                  <select [(ngModel)]="newTicket.id_espacio" name="id_espacio" required
                    class="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 outline-none">
                    <option *ngFor="let s of availableSpaces" [value]="s.id">
                      {{ s.description }} ({{ s.type }})
                    </option>
                  </select>
                </div>

                <button type="submit" 
                  class="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 font-bold text-white rounded-xl shadow-lg shadow-amber-500/20">
                  Emitir Ticket de Entrada
                </button>
              </form>
            </div>
          </div>

          <!-- Checkout & Receipt Modal -->
          <div *ngIf="selectedTicket" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4">
            <div class="glass-card max-w-sm w-full p-6 border border-amber-500/40 shadow-2xl shadow-amber-950/50 space-y-4 text-center">
              
              <!-- Ticket Header -->
              <div class="border-b border-dashed border-slate-700 pb-4">
                <div class="inline-flex p-2.5 rounded-full bg-amber-950 text-amber-400 mb-2 border border-amber-800">
                  <i class="fa-solid fa-receipt text-xl"></i>
                </div>
                <h3 class="text-base font-extrabold text-white">RECIBO DE PARQUEADERO</h3>
                <p class="text-[10px] font-mono text-slate-400">UrbanFlow Parking System</p>
                <p class="text-xs font-mono font-bold text-amber-400 mt-1">#{{ selectedTicket.id }}</p>
              </div>

              <!-- Ticket Receipt Body -->
              <div class="space-y-2 text-xs text-left bg-slate-900/90 p-4 rounded-xl border border-slate-800 font-mono">
                <div class="flex justify-between">
                  <span class="text-slate-400">Placa:</span>
                  <span class="font-bold text-white">{{ getVehiclePlate(selectedTicket.id_vehiculo) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-400">Plaza:</span>
                  <span class="font-bold text-cyan-400">{{ getSpaceDesc(selectedTicket.id_espacio) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-400">Hora Entrada:</span>
                  <span class="text-slate-200">{{ selectedTicket.hora_ingreso | date:'mediumTime' }}</span>
                </div>
                <div class="flex justify-between border-t border-slate-800 pt-2 text-sm font-bold">
                  <span class="text-slate-300">Total a Pagar:</span>
                  <span class="text-emerald-400" *ngIf="selectedTicket.tarifa_total != null; else pendingTotal">$ {{ selectedTicket.tarifa_total | number:'1.2-2' }}</span>
                                    <ng-template #pendingTotal><span class="text-slate-400">Por calcular</span></ng-template>
                </div>
              </div>

              <!-- Simulated QR Code -->
              <div class="py-2 flex flex-col items-center justify-center">
                <div class="p-3 bg-white rounded-xl shadow">
                  <i class="fa-solid fa-qrcode text-5xl text-slate-950"></i>
                </div>
                <p class="text-[9px] font-mono text-slate-400 mt-1">Escanee para validación de salida</p>
              </div>

              <!-- Actions -->
              <div class="flex gap-2">
                <button (click)="selectedTicket = null" 
                  class="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl">
                  Cerrar
                </button>
                <button *ngIf="selectedTicket.estado === 'ACTIVO'" (click)="processPayment()" 
                  class="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/20">
                  <i class="fa-solid fa-check mr-1"></i> Confirmar Pago
                </button>
              </div>

            </div>
          </div>

    </section>
  `
})
export class TicketsComponent implements OnInit {
  tickets: Ticket[] = [];
  filteredTicketsList: Ticket[] = [];
  spaces: ParkingSpace[] = [];
  availableSpaces: ParkingSpace[] = [];
  vehicles: Vehicle[] = [];
  users: User[] = [];

  loading = true;
  filterStatus = 'TODOS';
  showCreateModal = false;
  selectedTicket: Ticket | null = null;

  newTicket = {
    id_usuario: '',
    id_vehiculo: '',
    id_espacio: ''
  };

  private ticketService = inject(TicketService);
  private parkingService = inject(ParkingService);
  private vehicleService = inject(VehicleService);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.loadData();
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
        if (this.availableSpaces.length > 0) this.newTicket.id_espacio = this.availableSpaces[0].id;
        this.cdr.markForCheck();
      },
      error: err => console.error(err)
    });

    const vehicleSource = isAdmin ? this.vehicleService.getVehicles() : this.vehicleService.getMyVehicles();
    vehicleSource.subscribe({
      next: data => {
        this.vehicles = data;
        if (data.length > 0) this.newTicket.id_vehiculo = data[0].id;
        this.cdr.markForCheck();
      },
      error: err => console.error(err)
    });

    if (isAdmin) {
      this.userService.getUsers().subscribe({
        next: data => {
          this.users = data;
          if (data.length > 0) this.newTicket.id_usuario = data[0].id_person;
          this.cdr.markForCheck();
        },
        error: err => console.error(err)
      });
    } else {
      const curUser = this.authService.currentUser();
      if (curUser) {
        this.users = [curUser];
        this.newTicket.id_usuario = curUser.id_person;
        this.cdr.markForCheck();
      }
    }
  }

  get filteredTickets(): Ticket[] {
    if (this.filterStatus === 'TODOS') return this.tickets;
    return this.tickets.filter(t => t.estado === this.filterStatus);
  }

  getCount(status: string): number {
    return this.tickets.filter(t => t.estado === status).length;
  }

  getVehiclePlate(vehiculoId: string): string {
    const found = this.vehicles.find(v => v.id === vehiculoId);
    return found?.data?.plate || 'Sin placa';
  }

  getSpaceDesc(espacioId: string): string {
    const found = this.spaces.find(s => s.id === espacioId);
    return found?.description || espacioId.substring(0, 6);
  }

  onCreateTicket(): void {
    if (!this.newTicket.id_usuario || !this.newTicket.id_vehiculo || !this.newTicket.id_espacio) return;
    this.ticketService.createTicket(this.newTicket).subscribe({
      next: () => {
        this.showCreateModal = false;
        this.loadData();
      },
      error: err => alert('Error al crear ticket: ' + (err.error?.detail || err.message))
    });
  }

  openPayModal(t: Ticket): void {
    this.selectedTicket = t;
  }

  openReceipt(t: Ticket): void {
    this.selectedTicket = t;
  }

  processPayment(): void {
    if (!this.selectedTicket) return;
    this.ticketService.payTicket(this.selectedTicket.id).subscribe({
      next: updatedTicket => {
        alert('✅ Ticket pagado exitosamente. Espacio liberado.');
        this.selectedTicket = null;
        this.loadData();
      },
      error: err => alert('Error al procesar pago: ' + (err.error?.detail || err.message))
    });
  }
}
