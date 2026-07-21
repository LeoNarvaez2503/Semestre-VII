import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-license-plate',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './license-plate.component.html',
  styleUrl: './license-plate.component.css'
})
export class LicensePlateComponent {
  @Input() plateNumber = '';
  @Input() vehicleType: string = 'Auto';
  @Input() showIcon: boolean = true;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  formatPlate(plate: string): string {
    if (!plate) return 'SIN PLACA';
    const clean = plate.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    if (clean.length === 7) {
      return `${clean.substring(0, 3)}-${clean.substring(3)}`;
    }
    return plate.toUpperCase();
  }

  getVehicleIcon(): string {
    switch (this.vehicleType?.toLowerCase()) {
      case 'moto': return 'fa-solid fa-motorcycle';
      case 'camioneta': return 'fa-solid fa-truck-pickup';
      case 'electrico': return 'fa-solid fa-charging-station';
      default: return 'fa-solid fa-car-side';
    }
  }
}
