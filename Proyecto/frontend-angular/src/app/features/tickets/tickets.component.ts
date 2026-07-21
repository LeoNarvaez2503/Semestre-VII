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
    <section class="p-4 sm:p-8 bg-[#f4f5f7] min-h-[calc(100vh-70px)] space-y-6">
      <div class="max-w-7xl mx-auto space-y-6">

        <!-- Top Banner Actions matching GestionTicketsView.tsx -->
        <div class="bg-slate-900 text-white rounded-xl p-6 shadow-md border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 class="text-xl font-extrabold flex items-center gap-2">
              <i class="fa-solid fa-ticket text-amber-400"></i>
              Gestión de Tickets y Facturación
            </h2>
            <p class="text-xs text-slate-300 mt-1">
              Administra el ingreso, cobro por hora y comprobantes de caja de parqueadero.
            </p>
          </div>

          <button (click)="showCreateModal = true"
            class="bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold px-4 py-2.5 rounded-lg text-sm flex items-center gap-2 transition shadow-sm">
            <i class="fa-solid fa-plus font-bold"></i>
            Emitir Nuevo Ticket de Ingreso
          </button>
        </div>

        <!-- Filter Toolbar -->
        <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="relative w-full sm:w-80">
            <i class="fa-solid fa-magnifying-glass text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 text-xs"></i>
            <input type="text" [(ngModel)]="searchQuery"
              placeholder="Buscar por # Ticket, Placa o Conductor..."
              class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none" />
          </div>

          <!-- Filter Buttons -->
          <div class="flex items-center gap-2 bg-gray-100 p-1 rounded-lg text-xs font-bold">
            <button (click)="filterStatus = 'TODOS'"
              [class]="filterStatus === 'TODOS' ? 'bg-white text-gray-900 shadow-sm px-3 py-1.5 rounded-md' : 'px-3 py-1.5 text-gray-600 hover:text-gray-900'">
              Todos
            </button>
            <button (click)="filterStatus = 'ACTIVO'"
              [class]="filterStatus === 'ACTIVO' ? 'bg-amber-500 text-slate-950 shadow-sm px-3 py-1.5 rounded-md' : 'px-3 py-1.5 text-amber-800'">
              Activos ({{ getCount('ACTIVO') }})
            </button>
            <button (click)="filterStatus = 'PAGADO'"
              [class]="filterStatus === 'PAGADO' ? 'bg-emerald-600 text-white shadow-sm px-3 py-1.5 rounded-md' : 'px-3 py-1.5 text-emerald-800'">
              Pagados
            </button>
          </div>
        </div>

        <!-- Tickets Table -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div *ngIf="loading" class="text-center py-12 text-xs text-gray-500 font-mono">
            <i class="fa-solid fa-circle-notch fa-spin text-amber-500 text-2xl mb-2"></i>
            <p>Cargando tickets de estancia...</p>
          </div>

          <div *ngIf="!loading && filteredTickets.length === 0" class="p-12 text-center text-xs text-gray-400 font-medium">
            No se encontraron tickets con los filtros aplicados.
          </div>

          <div *ngIf="!loading && filteredTickets.length > 0" class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-gray-50 border-b border-gray-200 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">
                  <th class="py-3.5 px-4"># Ticket</th>
                  <th class="py-3.5 px-4">Placa / Vehículo</th>
                  <th class="py-3.5 px-4">Espacio</th>
                  <th class="py-3.5 px-4">Ingreso</th>
                  <th class="py-3.5 px-4">Estado</th>
                  <th class="py-3.5 px-4 text-right">Monto</th>
                  <th class="py-3.5 px-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 text-xs sm:text-sm">
                <tr *ngFor="let t of filteredTickets" class="hover:bg-gray-50/80 transition">
                  <td class="py-3.5 px-4 font-mono font-bold text-amber-600">
                    #{{ t.id.substring(0, 8) }}
                  </td>
                  <td class="py-3.5 px-4">
                    <div class="font-mono font-extrabold text-gray-900 bg-amber-100/80 px-2 py-0.5 rounded border border-amber-300 inline-block">
                      {{ getVehiclePlate(t.id_vehiculo) }}
                    </div>
                  </td>
                  <td class="py-3.5 px-4 font-bold text-gray-800">
                    {{ getSpaceDesc(t.id_espacio) }}
                  </td>
                  <td class="py-3.5 px-4 font-mono text-gray-600 text-xs">
                    {{ t.hora_ingreso | date:'shortTime' }}
                  </td>
                  <td class="py-3.5 px-4">
                    <span *ngIf="t.estado === 'ACTIVO'" class="bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-extrabold px-2.5 py-1 rounded-full">
                      ● ACTIVO
                    </span>
                    <span *ngIf="t.estado === 'PAGADO'" class="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-extrabold px-2.5 py-1 rounded-full">
                      ✓ PAGADO
                    </span>
                  </td>
                  <td class="py-3.5 px-4 text-right font-extrabold text-gray-900">
                    {{ t.tarifa_total ? ('$' + t.tarifa_total + ' USD') : '$3.50/h' }}
                  </td>
                  <td class="py-3.5 px-4 text-center">
                    <div class="flex items-center justify-center gap-2">
                      <button *ngIf="t.estado === 'ACTIVO'" (click)="payTicket(t.id)"
                        class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 rounded text-xs transition shadow-sm">
                        Cobrar
                      </button>
                      <button (click)="selectedTicketForReceipt = t"
                        class="bg-gray-100 hover:bg-gray-200 text-gray-700 p-1.5 rounded transition"
                        title="Imprimir Recibo">
                        <i class="fa-solid fa-print"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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

          <!-- Printable Receipt Modal -->
          <div *ngIf="selectedTicketForReceipt" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
            <div class="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-sm w-full overflow-hidden text-gray-900 font-sans">
              
              <!-- Modal Header -->
              <div class="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <i class="fa-solid fa-receipt text-amber-400 text-lg"></i>
                  <h3 class="text-sm font-extrabold tracking-tight">Comprobante de Ticket</h3>
                </div>
                <button (click)="selectedTicketForReceipt = null" class="text-slate-400 hover:text-white p-1 transition">
                  <i class="fa-solid fa-xmark text-lg"></i>
                </button>
              </div>

              <!-- Printable Receipt Content -->
              <div class="p-6 space-y-4 text-xs select-none">
                <div class="text-center border-b border-dashed border-gray-300 pb-3">
                  <div class="text-amber-600 font-black text-lg tracking-tight">UrbanFlow Logistics</div>
                  <div class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Sistema de Parqueadero & Control</div>
                  <div class="text-xs font-mono font-extrabold text-gray-900 mt-1 bg-amber-100 px-3 py-1 rounded inline-block border border-amber-300">
                    TICKET #{{ selectedTicketForReceipt.id.substring(0, 8) }}
                  </div>
                </div>

                <div class="bg-gray-50 rounded-xl p-3.5 border border-gray-200 space-y-2 font-mono">
                  <div class="flex justify-between items-center">
                    <span class="text-gray-500 font-bold">Cliente / Usuario:</span>
                    <span class="font-extrabold text-gray-900 truncate max-w-[150px]">{{ getUserName(selectedTicketForReceipt.id_usuario) }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-gray-500 font-bold">Placa del Vehículo:</span>
                    <span class="font-extrabold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded border border-amber-300">
                      {{ getVehiclePlate(selectedTicketForReceipt.id_vehiculo) }}
                    </span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-gray-500 font-bold">Espacio Asignado:</span>
                    <span class="font-bold text-gray-800">{{ getSpaceDesc(selectedTicketForReceipt.id_espacio) }}</span>
                  </div>
                  <div class="flex justify-between items-center pt-1 border-t border-gray-200">
                    <span class="text-gray-500 font-bold">Hora Entrada (Llegada):</span>
                    <span class="text-gray-800 font-bold">{{ selectedTicketForReceipt.hora_ingreso | date:'short' }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-gray-500 font-bold">Hora Salida:</span>
                    <span class="text-gray-800 font-bold">
                      {{ selectedTicketForReceipt.hora_salida ? (selectedTicketForReceipt.hora_salida | date:'short') : 'En Estancia (En Curso)' }}
                    </span>
                  </div>
                  <div class="flex justify-between items-center pt-2 border-t border-gray-300 text-sm font-black">
                    <span class="text-gray-900 uppercase">Monto Total:</span>
                    <span class="text-emerald-600 text-base">
                      {{ selectedTicketForReceipt.tarifa_total ? ('$' + selectedTicketForReceipt.tarifa_total + ' USD') : '$3.50 USD' }}
                    </span>
                  </div>
                </div>

                <!-- QR Code Code -->
                <div class="text-center py-2 space-y-1">
                  <div class="inline-block p-2.5 bg-white border border-gray-300 rounded-xl shadow-sm">
                    <i class="fa-solid fa-qrcode text-4xl text-slate-900"></i>
                  </div>
                  <p class="text-[9px] text-gray-400 font-bold uppercase">Valido para control de garita y salida</p>
                </div>

                <!-- Receipt Modal Footer Buttons -->
                <div class="pt-2 flex items-center gap-3">
                  <button (click)="selectedTicketForReceipt = null"
                    class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2.5 rounded-lg text-xs transition">
                    Cerrar
                  </button>
                  <button (click)="printReceipt()"
                    class="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-lg text-xs shadow transition flex items-center justify-center gap-2">
                    <i class="fa-solid fa-print"></i>
                    Imprimir Recibo
                  </button>
                </div>
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
  searchQuery = '';
  showCreateModal = false;
  selectedTicket: Ticket | null = null;
  selectedTicketForReceipt: Ticket | null = null;

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
    return this.tickets.filter(t => {
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

  getUserName(userId: string): string {
    const found = this.users.find(u => u.id_person === userId);
    if (!found) return 'Cliente';
    if (found.person?.first_name || found.person?.last_name) {
      return `${found.person.first_name || ''} ${found.person.last_name || ''}`.trim();
    }
    return found.username || 'Cliente';
  }

  printReceipt(): void {
    window.print();
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
    this.selectedTicketForReceipt = t;
  }

  payTicket(ticketId: string): void {
    this.ticketService.payTicket(ticketId).subscribe({
      next: () => {
        this.loadData();
      },
      error: err => alert('Error al cobrar ticket: ' + (err.error?.detail || err.message))
    });
  }

  processPayment(): void {
    if (!this.selectedTicket) return;
    this.payTicket(this.selectedTicket.id);
    this.selectedTicket = null;
  }
}
