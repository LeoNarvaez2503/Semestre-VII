import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuditService } from '../../infrastructure/api/audit.service';
import { AuthService } from '../../infrastructure/api/auth.service';
import { AuditEvent } from '../../core/models/audit.model';

@Component({
  selector: 'app-audit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './audit.component.html',
  styleUrl: './audit.component.css'
})
export class AuditComponent implements OnInit {
  events: AuditEvent[] = [];
  filteredEvents: AuditEvent[] = [];
  loading = true;
  errorMessage = '';

  // Filter properties
  searchQuery = '';
  selectedService = '';
  selectedAction = '';
  startDate = '';
  endDate = '';

  // Selected event for detail modal
  selectedEvent: AuditEvent | null = null;

  // Available unique services & actions for dropdowns
  availableServices: string[] = [];
  availableActions: string[] = [];

  private auditService = inject(AuditService);
  private cdr = inject(ChangeDetectorRef);
  authService = inject(AuthService);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.errorMessage = '';
    this.cdr.markForCheck();

    this.auditService.getAuditLogs().subscribe({
      next: logs => {
        this.events = Array.isArray(logs) ? logs : [];
        this.extractFilterOptions();
        this.applyFilters();
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: err => {
        console.error('Error al cargar registros de auditoría:', err);
        this.errorMessage = 'No se pudieron recuperar los registros de auditoría de RabbitMQ.';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  private extractFilterOptions(): void {
    const servicesSet = new Set<string>();
    const actionsSet = new Set<string>();

    this.events.forEach(e => {
      if (e.servicio) servicesSet.add(e.servicio);
      if (e.accion) actionsSet.add(e.accion);
    });

    this.availableServices = Array.from(servicesSet).sort();
    this.availableActions = Array.from(actionsSet).sort();
  }

  applyFilters(): void {
    const query = this.searchQuery.trim().toLowerCase();

    this.filteredEvents = this.events.filter(e => {
      // Service filter
      if (this.selectedService && e.servicio !== this.selectedService) return false;

      // Action filter
      if (this.selectedAction && e.accion !== this.selectedAction) return false;

      // Text search
      if (query) {
        const userMatch = (e.username || '').toLowerCase().includes(query);
        const ipMatch = (e.ip || '').toLowerCase().includes(query);
        const macMatch = (e.mac || '').toLowerCase().includes(query);
        const entityMatch = (e.entidad || '').toLowerCase().includes(query);
        const serviceMatch = (e.servicio || '').toLowerCase().includes(query);
        const dataMatch = e.datos ? JSON.stringify(e.datos).toLowerCase().includes(query) : false;

        if (!userMatch && !ipMatch && !macMatch && !entityMatch && !serviceMatch && !dataMatch) {
          return false;
        }
      }

      // Date Range Filter
      if (this.startDate) {
        const eventDate = new Date(e.timestamp).getTime();
        const start = new Date(this.startDate).getTime();
        if (eventDate < start) return false;
      }

      if (this.endDate) {
        const eventDate = new Date(e.timestamp).getTime();
        // Add 24h to include full end day
        const end = new Date(this.endDate).getTime() + 86400000;
        if (eventDate > end) return false;
      }

      return true;
    });
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedService = '';
    this.selectedAction = '';
    this.startDate = '';
    this.endDate = '';
    this.applyFilters();
  }

  // Metric calculation getters
  get totalEventsCount(): number {
    return this.filteredEvents.length;
  }

  get loginsCount(): number {
    return this.filteredEvents.filter(e => e.accion === 'LOGIN').length;
  }

  get modificationsCount(): number {
    return this.filteredEvents.filter(e => e.accion === 'CREATE' || e.accion === 'UPDATE').length;
  }

  get deletionsCount(): number {
    return this.filteredEvents.filter(e => e.accion === 'DELETE').length;
  }

  openEventDetail(event: AuditEvent): void {
    this.selectedEvent = event;
    this.cdr.markForCheck();
  }

  closeEventDetail(): void {
    this.selectedEvent = null;
    this.cdr.markForCheck();
  }

  // Export & Download .log file
  downloadLogsFile(): void {
    if (this.filteredEvents.length === 0) {
      alert('No hay eventos de auditoría para exportar.');
      return;
    }

    const header = `# =========================================================================\n` +
                   `# URBANFLOW SMART PARKING SYSTEM - REGISTRO DE AUDITORÍA (RABBITMQ)\n` +
                   `# Exportado el: ${new Date().toISOString()}\n` +
                   `# Total de Registros: ${this.filteredEvents.length}\n` +
                   `# =========================================================================\n\n`;

    const logLines = this.filteredEvents.map(e => {
      const ts = e.timestamp ? new Date(e.timestamp).toISOString() : new Date().toISOString();
      const service = (e.servicio || 'ms-unknown').padEnd(15, ' ');
      const action = (e.accion || 'UNKNOWN').padEnd(8, ' ');
      const entity = (e.entidad || 'GENERAL').padEnd(10, ' ');
      const user = e.username || 'invitado';
      const ip = e.ip || 'N/A';
      const mac = e.mac || 'N/A';
      const payload = e.datos ? JSON.stringify(e.datos) : '{}';

      return `[${ts}] [${service.trim()}] [${action.trim()}] [ENTIDAD: ${entity.trim()}] User: ${user} | IP: ${ip} | MAC: ${mac} | Details: ${payload}`;
    });

    const fullContent = header + logLines.join('\n');
    const blob = new Blob([fullContent], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const dateStr = new Date().toISOString().split('T')[0];

    const link = document.createElement('a');
    link.href = url;
    link.download = `audit_logs_${dateStr}.log`;
    link.click();

    window.URL.revokeObjectURL(url);
  }

  formatJson(data: any): string {
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  }
}
