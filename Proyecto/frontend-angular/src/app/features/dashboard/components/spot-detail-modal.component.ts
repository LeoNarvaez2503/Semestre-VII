import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../../infrastructure/api/auth.service';
import { ParkingSpace, SpaceStatus } from '../../../core/models/space.model';

@Component({
  selector: 'app-spot-detail-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spot-detail-modal.component.html',
  styleUrl: './spot-detail-modal.component.css'
})
export class SpotDetailModalComponent {
  @Input() spot!: ParkingSpace;

  @Output() close = new EventEmitter<void>();
  @Output() stateChange = new EventEmitter<SpaceStatus>();

  authService = inject(AuthService);
}
