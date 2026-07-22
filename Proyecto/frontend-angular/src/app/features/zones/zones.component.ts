import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { Zone } from '../../core/models/zone.model';
import { ParkingService } from '../../infrastructure/api/parking.service';

type ZoneType = 'VIP' | 'REGULAR' | 'INTERNA' | 'EXTERNA';
type ZoneDetails = Zone;
type ZoneRequest = Omit<Zone, 'zoneId'>;

@Component({
  selector: 'app-zones',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './zones.component.html',
  styleUrl: './zones.component.css'
})
export class ZonesComponent implements OnInit {
  readonly zoneTypes: ZoneType[] = ['VIP', 'REGULAR', 'INTERNA', 'EXTERNA'];
  zones: ZoneDetails[] = [];
  loading = false;
  saving = false;
  deletingId: string | null = null;
  editingZone: ZoneDetails | null = null;
  errorMessage = '';
  successMessage = '';

  private readonly formBuilder = inject(FormBuilder);
  private readonly parkingService = inject(ParkingService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly zoneForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(32)]],
    description: [''],
    type: ['REGULAR' as ZoneType, Validators.required],
    capacidad: [1, [Validators.required, Validators.min(1)]]
  });

  ngOnInit(): void {
    this.loadZones();
  }

  loadZones(): void {
    this.loading = true;
    this.errorMessage = '';
    this.cdr.markForCheck();

    this.parkingService.getZones().pipe(
      finalize(() => {
        this.loading = false;
        this.cdr.markForCheck();
      })
    ).subscribe({
      next: zones => {
        this.zones = zones.filter(z => z.status !== 0);
        this.cdr.markForCheck();
      },
      error: error => {
        this.errorMessage = this.getErrorMessage(error, 'No fue posible cargar las zonas.');
        this.cdr.markForCheck();
      }
    });
  }

  submit(): void {
    if (this.zoneForm.invalid || this.saving) {
      this.zoneForm.markAllAsTouched();
      return;
    }

    const value = this.zoneForm.getRawValue();
    const request: ZoneRequest = {
      name: value.name.trim(),
      description: value.description.trim(),
      type: value.type,
      capacidad: Number(value.capacidad)
    };

    this.saving = true;
    this.clearMessages();
    const operation = this.editingZone
      ? this.parkingService.updateZone(this.editingZone.zoneId, request)
      : this.parkingService.createZone(request);

    operation.pipe(finalize(() => this.saving = false)).subscribe({
      next: zone => {
        if (this.editingZone) {
          this.zones = this.zones.map(item => item.zoneId === zone.zoneId ? zone : item);
          this.successMessage = 'Zona actualizada correctamente.';
        } else {
          this.zones = [zone, ...this.zones];
          this.successMessage = 'Zona creada correctamente.';
        }
        this.cancelEdit();
      },
      error: error => this.errorMessage = this.getErrorMessage(error, 'No fue posible guardar la zona.')
    });
  }

  editZone(zone: ZoneDetails): void {
    this.editingZone = zone;
    this.clearMessages();
    this.zoneForm.setValue({
      name: zone.name,
      description: zone.description ?? '',
      type: zone.type as ZoneType,
      capacidad: zone.capacidad
    });
  }

  cancelEdit(): void {
    this.editingZone = null;
    this.zoneForm.reset({
      name: '',
      description: '',
      type: 'REGULAR',
      capacidad: 1
    });
  }

  deleteZone(zone: ZoneDetails): void {
    if (this.deletingId || !confirm(`¿Eliminar la zona “${zone.name}”?`)) {
      return;
    }

    this.deletingId = zone.zoneId;
    this.clearMessages();
    this.parkingService.deleteZone(zone.zoneId).pipe(
      finalize(() => {
        this.deletingId = null;
        this.cdr.markForCheck();
      })
    ).subscribe({
      next: () => {
        this.zones = this.zones.filter(item => item.zoneId !== zone.zoneId);
        if (this.editingZone?.zoneId === zone.zoneId) {
          this.cancelEdit();
        }
        this.successMessage = 'Zona eliminada correctamente.';
        this.cdr.markForCheck();
      },
      error: error => {
        this.errorMessage = this.getErrorMessage(error, 'No fue posible eliminar la zona.');
        this.cdr.markForCheck();
      }
    });
  }

  trackZone(_index: number, zone: ZoneDetails): string {
    return zone.zoneId;
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  private getErrorMessage(error: unknown, fallback: string): string {
    if (typeof error === 'object' && error !== null && 'error' in error) {
      const response = (error as { error?: { detail?: string; message?: string } | string }).error;
      if (typeof response === 'string') return response || fallback;
      if (response?.detail) return response.detail;
      if (response?.message) return response.message;
    }
    return fallback;
  }
}
