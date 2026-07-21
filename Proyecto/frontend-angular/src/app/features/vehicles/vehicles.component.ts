import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { VehicleCardComponent } from './components/vehicle-card.component';
import { VehicleModalComponent } from './components/vehicle-modal.component';

import { VehicleService } from '../../infrastructure/api/vehicle.service';
import { AuthService } from '../../infrastructure/api/auth.service';
import { Vehicle } from '../../core/models/vehicle.model';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    VehicleCardComponent,
    VehicleModalComponent
  ],
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.css'
})
export class VehiclesComponent implements OnInit {
  vehicles: Vehicle[] = [];
  loading = true;
  searchQuery = '';
  showCreateModal = false;

  private vehicleService = inject(VehicleService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.loadVehicles();
  }

  loadVehicles(): void {
    this.loading = true;
    this.cdr.markForCheck();

    const isAdmin = this.authService.hasRole('Administrador') || this.authService.hasRole('Root');
    const source$ = isAdmin ? this.vehicleService.getVehicles() : this.vehicleService.getMyVehicles();

    source$.subscribe({
      next: data => {
        this.vehicles = data;
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

  get filteredVehicles(): Vehicle[] {
    if (!this.searchQuery.trim()) return this.vehicles;
    const q = this.searchQuery.toLowerCase();
    return this.vehicles.filter(v => 
      (v.data?.plate || '').toLowerCase().includes(q) ||
      (v.data?.brand || '').toLowerCase().includes(q) ||
      (v.data?.model || '').toLowerCase().includes(q)
    );
  }

  onVehicleCreated(): void {
    this.showCreateModal = false;
    this.loadVehicles();
  }

  onDeleteVehicle(id: string): void {
    if (!confirm('¿Desea eliminar este vehículo de la flota?')) return;
    this.vehicleService.deleteVehicle(id).subscribe({
      next: () => this.loadVehicles(),
      error: err => alert('Error al eliminar vehículo: ' + (err.error?.detail || err.message))
    });
  }
}
