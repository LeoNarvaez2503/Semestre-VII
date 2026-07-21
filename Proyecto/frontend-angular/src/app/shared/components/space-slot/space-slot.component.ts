import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParkingSpace } from '../../../core/models/space.model';

@Component({
  selector: 'app-space-slot',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './space-slot.component.html',
  styleUrl: './space-slot.component.css'
})
export class SpaceSlotComponent {
  @Input() space!: ParkingSpace;
  @Output() selectSpace = new EventEmitter<ParkingSpace>();
}
