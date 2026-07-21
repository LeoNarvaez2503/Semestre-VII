import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { SpaceSlotComponent } from '../../shared/components/space-slot/space-slot.component';
import { KpiCardsComponent } from './components/kpi-cards.component';
import { SpotDetailModalComponent } from './components/spot-detail-modal.component';

import { ParkingService } from '../../infrastructure/api/parking.service';
import { AuthService } from '../../infrastructure/api/auth.service';
import { ParkingSpace, SpaceStatus } from '../../core/models/space.model';
import { Zone } from '../../core/models/zone.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    SpaceSlotComponent,
    KpiCardsComponent,
    SpotDetailModalComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  spaces: ParkingSpace[] = [];
  zones: Zone[] = [];
  loadingSpaces = true;

  selectedZoneId = '';
  searchQuery = '';
  filterStatus = 'TODOS';
  selectedSpot: ParkingSpace | null = null;

  availableCount = 0;
  occupiedCount = 0;
  reservedCount = 0;

  authService = inject(AuthService);
  private parkingService = inject(ParkingService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.parkingService.getSpaces().subscribe({
      next: data => {
        this.spaces = data;
        this.updateCounts();
        this.loadingSpaces = false;
        this.cdr.markForCheck();
      },
      error: err => {
        console.error(err);
        this.loadingSpaces = false;
        this.cdr.markForCheck();
      }
    });

    this.parkingService.getZones().subscribe({
      next: data => {
        this.zones = data;
        this.cdr.markForCheck();
      },
      error: err => console.error(err)
    });
  }

  updateCounts(): void {
    this.availableCount = this.spaces.filter(s => s.estado === 'DISPONIBLE').length;
    this.occupiedCount = this.spaces.filter(s => s.estado === 'OCUPADO').length;
    this.reservedCount = this.spaces.filter(s => s.estado === 'RESERVADO').length;
  }

  get activeZoneName(): string {
    if (!this.selectedZoneId) return 'Zona Industrial A';
    const z = this.zones.find(item => item.zoneId === this.selectedZoneId);
    return z ? z.name : 'Zona Industrial A';
  }

  get filteredSpaces(): ParkingSpace[] {
    return this.spaces.filter(spot => {
      if (this.selectedZoneId && spot.zoneId !== this.selectedZoneId) return false;
      if (this.filterStatus !== 'TODOS' && spot.estado !== this.filterStatus) return false;
      if (this.searchQuery.trim()) {
        const q = this.searchQuery.toLowerCase();
        const matchId = (spot.numero || spot.id).toLowerCase().includes(q);
        const matchPlate = spot.vehiculoId?.toLowerCase().includes(q);
        if (!matchId && !matchPlate) return false;
      }
      return true;
    });
  }

  get columns(): ParkingSpace[][] {
    const cols: ParkingSpace[][] = [[], [], [], [], []];
    this.filteredSpaces.forEach((spot, idx) => {
      cols[idx % 5].push(spot);
    });
    return cols;
  }

  changeSpotState(newStatus: SpaceStatus): void {
    if (!this.selectedSpot) return;
    const spotId = this.selectedSpot.id;
    this.parkingService.updateSpaceState(spotId, newStatus).subscribe({
      next: () => {
        this.spaces = this.spaces.map(s => s.id === spotId ? { ...s, estado: newStatus } : s);
        this.updateCounts();
        this.selectedSpot = null;
        this.cdr.markForCheck();
      },
      error: err => console.error(err)
    });
  }
}
