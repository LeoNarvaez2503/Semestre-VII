import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-kpi-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kpi-cards.component.html',
  styleUrl: './kpi-cards.component.css'
})
export class KpiCardsComponent {
  @Input() totalCount = 0;
  @Input() availableCount = 0;
  @Input() occupiedCount = 0;
  @Input() reservedCount = 0;
  @Input() activeFilter = 'TODOS';

  @Output() filterChange = new EventEmitter<string>();
}
