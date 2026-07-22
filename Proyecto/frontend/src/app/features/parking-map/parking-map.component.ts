import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { SpaceSlotComponent } from '../../shared/components/space-slot/space-slot.component';
import { ParkingService } from '../../infrastructure/api/parking.service';
import { SpaceSseService } from '../../infrastructure/sse/space-sse.service';
import { AuthService } from '../../infrastructure/api/auth.service';
import { ParkingSpace, SpaceStatus } from '../../core/models/space.model';
import { Zone } from '../../core/models/zone.model';

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

  newSpace = {
    zoneId: '',
    description: '',
    type: 'AUTO',
    estado: 'DISPONIBLE'
  };

  private sseSub?: Subscription;

  private parkingService = inject(ParkingService);
  private spaceSseService = inject(SpaceSseService);
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
    this.cdr.markForCheck();

    this.parkingService.getZones().subscribe({
      next: data => {
        this.zones = data;
        if (data.length > 0) this.newSpace.zoneId = data[0].zoneId;
        this.cdr.markForCheck();
      },
      error: err => {
        console.error(err);
        this.cdr.markForCheck();
      }
    });

    this.parkingService.getSpaces().subscribe({
      next: data => {
        this.spaces = data;
        this.filterSpaces();
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: err => {
        console.error(err);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  subscribeToSSE(): void {
    this.sseSub = this.spaceSseService.getSpaceStream().subscribe({
      next: msg => {
        console.log('⚡ SSE Event Received:', msg);
        const idx = this.spaces.findIndex(s => s.id === msg.id);
        if (idx !== -1) {
          this.spaces[idx].estado = msg.estado;
          if (msg.vehiculoId !== undefined) {
            this.spaces[idx].vehiculoId = msg.vehiculoId;
          }
          this.filterSpaces();
          this.cdr.markForCheck();
        }
      },
      error: err => console.warn('SSE warning:', err)
    });
  }

  filterSpaces(): void {
    this.filteredSpaces = this.spaces.filter(s => {
      if (this.selectedZoneId && s.zoneId !== this.selectedZoneId) return false;
      if (this.selectedStatus && s.estado !== this.selectedStatus) return false;
      if (this.searchQuery.trim()) {
        const q = this.searchQuery.toLowerCase();
        const matchId = (s.numero || s.description || s.id).toLowerCase().includes(q);
        const matchPlate = s.vehiculoId?.toLowerCase().includes(q);
        if (!matchId && !matchPlate) return false;
      }
      return true;
    });
  }

  get visibleZones(): Zone[] {
    return this.zones.filter(zone => this.getSpacesByZone(zone.zoneId).length > 0);
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
    this.parkingService.updateSpaceState(this.selectedSpace.id, newState).subscribe({
      next: () => {
        if (this.selectedSpace) this.selectedSpace.estado = newState;
        this.selectedSpace = null;
        this.loadData();
      },
      error: err => alert('Error al actualizar estado: ' + (err.error?.detail || err.message))
    });
  }

  onCreateSpace(): void {
    if (!this.newSpace.description || !this.newSpace.zoneId) return;
    this.parkingService.createSpace(this.newSpace).subscribe({
      next: () => {
        this.showCreateModal = false;
        this.loadData();
      },
      error: err => alert('Error al crear plaza: ' + (err.error?.detail || err.message))
    });
  }
}
