import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { AppShellComponent } from './shared/components/app-shell/app-shell.component';

const adminOnly = {
  canActivate: [roleGuard],
  data: { roles: ['Administrador', 'Root'] }
};

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: '',
    component: AppShellComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'parking-map', loadComponent: () => import('./features/parking-map/parking-map.component').then(m => m.ParkingMapComponent) },
      { path: 'tickets', loadComponent: () => import('./features/tickets/tickets.component').then(m => m.TicketsComponent) },
      { path: 'vehicles', loadComponent: () => import('./features/vehicles/vehicles.component').then(m => m.VehiclesComponent) },
      {
        path: 'zones',
        ...adminOnly,
        loadComponent: () => import('./features/zones/zones.component').then(m => m.ZonesComponent)
      },
      {
        path: 'assignments',
        ...adminOnly,
        loadComponent: () => import('./features/assignments/assignments.component').then(m => m.AssignmentsComponent)
      },
      {
        path: 'users-admin',
        ...adminOnly,
        loadComponent: () => import('./features/users-admin/users-admin.component').then(m => m.UsersAdminComponent)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
