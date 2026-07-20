import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-license-plate',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="license-plate-badge" [class.size-sm]="size === 'sm'" [class.size-lg]="size === 'lg'">
      <div class="license-plate-header">ECUADOR</div>
      <div class="license-plate-body">
        <i *ngIf="showIcon" [class]="getVehicleIcon()" class="mr-1.5 text-xs text-slate-700"></i>
        <span class="license-plate-number">{{ formatPlate(plateNumber) }}</span>
      </div>
    </div>
  `,
  styles: [`
    .license-plate-badge {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: linear-gradient(180deg, #ffffff 0%, #cbd5e1 100%);
      color: #0f172a;
      border: 2px solid #475569;
      border-radius: 6px;
      padding: 3px 12px;
      font-family: 'Outfit', sans-serif;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.9);
      user-select: none;
    }
    .size-sm {
      padding: 1px 8px;
    }
    .size-sm .license-plate-header {
      font-size: 0.45rem;
    }
    .size-sm .license-plate-number {
      font-size: 0.8rem;
    }
    .size-lg {
      padding: 6px 18px;
    }
    .size-lg .license-plate-header {
      font-size: 0.65rem;
    }
    .size-lg .license-plate-number {
      font-size: 1.3rem;
    }
    .license-plate-header {
      font-size: 0.55rem;
      font-weight: 900;
      color: #1e3a8a;
      text-transform: uppercase;
      letter-spacing: 2.5px;
      line-height: 1;
      margin-bottom: 2px;
    }
    .license-plate-body {
      display: flex;
      align-items: center;
    }
    .license-plate-number {
      font-size: 1.05rem;
      font-weight: 900;
      color: #020617;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
  `]
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
