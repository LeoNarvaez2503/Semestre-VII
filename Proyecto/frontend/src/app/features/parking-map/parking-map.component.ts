import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { SpaceSlotComponent } from '../../shared/components/space-slot/space-slot.component';
import { ParkingService } from '../../infrastructure/api/parking.service';
import { SpaceSseService } from '../../infrastructure/sse/space-sse.service';
import { AuthService } from '../../infrastructure/api/auth.service';
import { TicketService } from '../../infrastructure/api/ticket.service';
import { VehicleService } from '../../infrastructure/api/vehicle.service';
import { UserService } from '../../infrastructure/api/user.service';
import { AssignmentService } from '../../infrastructure/api/assignment.service';

import { ParkingSpace, SpaceStatus } from '../../core/models/space.model';
import { Zone } from '../../core/models/zone.model';
import { Vehicle } from '../../core/models/vehicle.model';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-parking-map',
  standalone: true,
  imports: [CommonModule, FormsModule, SpaceSlotComponent],
  templateUrl: './parking-map.component.html',
  styleUrl: './parking-map.component.css'
})
export class ParkingMapComponent implements OnInit, OnDestroy {
  spaces: ParkingSpace[] = [];
  filteredSpaces: ParkingSpace[] = [];
  zones: Zone[] = [];

  loading = true;
  selectedZoneId = '';
  selectedStatus = '';
  searchQuery = '';
  selectedSpace: ParkingSpace | null = null;
  showCreateModal = false;

  // Occupancy modal properties
  showOccupancyModal = false;
  occupyTargetSpace: ParkingSpace | null = null;
  occupyForm = {
    userId: '',
    vehicleId: ''
  };
  availableVehicles: Vehicle[] = [];
  availableUsers: User[] = [];
  isSubmittingOccupancy = false;
  occupyErrorMessage = '';

  newSpace = {
    zoneId: '',
    description: '',
    type: 'AUTO',
    estado: 'DISPONIBLE'
  };

  private sseSub?: Subscription;

  private parkingService = inject(ParkingService);
  private spaceSseService = inject(SpaceSseService);
  private ticketService = inject(TicketService);
  private vehicleService = inject(VehicleService);
  private userService = inject(UserService);
  private assignmentService = inject(AssignmentService);
  private cdr = inject(ChangeDetectorRef);
  authService = inject(AuthService);

  ngOnInit(): void {
    this.loadData();
    this.subscribeToSSE();
  }

  ngOnDestroy(): void {
    this.sseSub?.unsubscribe();
  }

  loadData(): void {
    this.loading = true;
    this.cdr.detectChanges();

    this.parkingService.getZones().subscribe({
      next: data => {
        this.zones = data;
        if (data.length > 0) this.newSpace.zoneId = data[0].zoneId;
        this.cdr.detectChanges();
      },
      error: err => {
        console.error(err);
        this.cdr.detectChanges();
      }
    });

    this.parkingService.getSpaces().subscribe({
      next: data => {
        this.spaces = data;
        this.filterSpaces();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: err => {
        console.error(err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  subscribeToSSE(): void {
    this.sseSub = this.spaceSseService.getSpaceStream().subscribe({
      next: msg => {
        console.log('⚡ SSE Event Received:', msg);
        if (!msg) return;

        const targetId = msg.id || msg.idEspacio || msg.id_espacio || msg.spaceId;
        const newStatus = (msg.estado || msg.estado_espacio || '').toUpperCase() as SpaceStatus;

        const idx = this.spaces.findIndex(s => s.id === targetId);
        if (idx !== -1 && newStatus) {
          const updatedSpace: ParkingSpace = {
            ...this.spaces[idx],
            estado: newStatus,
            vehiculoId: msg.vehiculoId !== undefined ? msg.vehiculoId : this.spaces[idx].vehiculoId
          };

          this.spaces[idx] = updatedSpace;
          this.spaces = [...this.spaces];
          this.filterSpaces();
          this.cdr.detectChanges();
        } else {
          this.loadData();
        }
      },
      error: err => console.warn('SSE warning:', err)
    });
  }

  filterSpaces(): void {
    const activeZoneIds = new Set(this.zones.map(z => z.zoneId));
    this.filteredSpaces = this.spaces.filter(s => {
      if (!activeZoneIds.has(s.zoneId)) return false;
      if (this.selectedZoneId && s.zoneId !== this.selectedZoneId) return false;
      if (this.selectedStatus && s.estado !== this.selectedStatus) return false;
      if (this.searchQuery.trim()) {
        const q = this.searchQuery.toLowerCase();
        const matchId = (s.description || s.numero || s.id).toLowerCase().includes(q);
        const matchPlate = s.vehiculoId?.toLowerCase().includes(q);
        if (!matchId && !matchPlate) return false;
      }
      return true;
    });
  }

  get visibleZones(): Zone[] {
    return this.zones;
  }

  getSpacesByZone(zoneId: string): ParkingSpace[] {
    return this.filteredSpaces.filter(s => s.zoneId === zoneId);
  }

  getZoneCount(zoneId: string, status: SpaceStatus): number {
    return this.spaces.filter(s => s.zoneId === zoneId && s.estado === status).length;
  }

  openSpaceDetails(space: ParkingSpace): void {
    this.selectedSpace = space;
  }

  updateState(newState: SpaceStatus): void {
    if (!this.selectedSpace) return;
    if (newState === 'OCUPADO') {
      const target = this.selectedSpace;
      this.selectedSpace = null;
      this.openOccupyModal(target);
      return;
    }

    this.parkingService.updateSpaceState(this.selectedSpace.id, newState).subscribe({
      next: () => {
        this.selectedSpace = null;
        this.loadData();
      },
      error: err => alert('Error al actualizar estado: ' + (err.error?.detail || err.message))
    });
  }

  // Open the modal to prompt for User and Vehicle when marking a space as OCUPADO
  openOccupyModal(space: ParkingSpace): void {
    this.occupyTargetSpace = space;
    this.occupyErrorMessage = '';
    this.showOccupancyModal = true;
    this.occupyForm = { userId: '', vehicleId: '' };
    this.availableVehicles = [];

    const isAdmin = this.authService.hasRole('Administrador') || this.authService.hasRole('Root');

    if (isAdmin) {
      this.userService.getUsers().subscribe({
        next: users => {
          this.availableUsers = users;
          const currentPersonId = this.authService.currentUser()?.id_person;
          if (currentPersonId) {
            this.occupyForm.userId = currentPersonId;
          } else if (users.length > 0) {
            this.occupyForm.userId = users[0].id_person;
          }
          this.onUserChange(this.occupyForm.userId);
          this.cdr.detectChanges();
        },
        error: err => console.error(err)
      });
    } else {
      const currentPersonId = this.authService.currentUser()?.id_person || '';
      this.occupyForm.userId = currentPersonId;
      this.onUserChange(currentPersonId);
    }
  }

  onUserChange(userId: string): void {
    if (!userId) {
      this.availableVehicles = [];
      this.occupyForm.vehicleId = '';
      this.cdr.detectChanges();
      return;
    }

    const currentPersonId = this.authService.currentUser()?.id_person;

    // Fetch user fleet via AssignmentService or VehicleService
    this.assignmentService.getFleetByOwner(userId).subscribe({
      next: fleet => {
        let mappedVehicles: Vehicle[] = (fleet || []).map(item => ({
          id: item.vehicleId || item.id,
          type: item.type || item.tipo || 'Auto',
          data: {
            plate: item.plate || item.data?.plate || 'SIN-PLACA',
            brand: item.brand || item.data?.brand || '',
            model: item.model || item.data?.model || '',
            color: item.color || item.data?.color || ''
          }
        }));

        if (mappedVehicles.length === 0 && userId === currentPersonId) {
          // Fallback to getMyVehicles if user is self
          this.vehicleService.getMyVehicles().subscribe({
            next: myVehicles => {
              this.availableVehicles = myVehicles;
              this.occupyForm.vehicleId = myVehicles.length > 0 ? myVehicles[0].id : '';
              this.cdr.detectChanges();
            }
          });
          return;
        }

        this.availableVehicles = mappedVehicles;
        this.occupyForm.vehicleId = mappedVehicles.length > 0 ? mappedVehicles[0].id : '';
        this.cdr.detectChanges();
      },
      error: err => {
        console.warn('Error fetching fleet by owner:', err);
        if (userId === currentPersonId) {
          this.vehicleService.getMyVehicles().subscribe({
            next: myVehicles => {
              this.availableVehicles = myVehicles;
              this.occupyForm.vehicleId = myVehicles.length > 0 ? myVehicles[0].id : '';
              this.cdr.detectChanges();
            }
          });
        } else {
          this.availableVehicles = [];
          this.occupyForm.vehicleId = '';
          this.cdr.detectChanges();
        }
      }
    });
  }

  closeOccupyModal(): void {
    this.showOccupancyModal = false;
    this.occupyTargetSpace = null;
    this.cdr.detectChanges();
  }

  onConfirmOccupancy(): void {
    if (!this.occupyTargetSpace || !this.occupyForm.vehicleId || !this.occupyForm.userId) {
      this.occupyErrorMessage = 'Por favor seleccione tanto el vehículo como el usuario responsable.';
      return;
    }

    this.isSubmittingOccupancy = true;
    this.occupyErrorMessage = '';
    this.cdr.detectChanges();

    this.ticketService.createTicket({
      id_espacio: this.occupyTargetSpace.id,
      id_vehiculo: this.occupyForm.vehicleId,
      id_usuario: this.occupyForm.userId
    }).subscribe({
      next: () => {
        this.isSubmittingOccupancy = false;
        this.showOccupancyModal = false;
        this.occupyTargetSpace = null;
        this.loadData();
      },
      error: err => {
        this.isSubmittingOccupancy = false;
        this.occupyErrorMessage = err.error?.detail || err.error?.message || 'Error al ocupar la plaza y generar el ticket.';
        this.cdr.detectChanges();
      }
    });
  }

  isSubmittingSpace = false;
  createSpaceErrorMessage = '';

  onCreateSpace(): void {
    if (this.isSubmittingSpace) return;
    if (!this.newSpace.description?.trim() || !this.newSpace.zoneId) return;

    this.isSubmittingSpace = true;
    this.createSpaceErrorMessage = '';
    this.cdr.markForCheck();

    this.parkingService.createSpace(this.newSpace).subscribe({
      next: () => {
        this.isSubmittingSpace = false;
        this.showCreateModal = false;
        this.newSpace.description = '';
        this.loadData();
      },
      error: err => {
        this.isSubmittingSpace = false;
        this.createSpaceErrorMessage = err.error?.detail || err.error?.message || 'Error al crear la plaza';
        this.cdr.markForCheck();
      }
    });
  }
}
