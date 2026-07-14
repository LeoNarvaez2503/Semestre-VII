/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useBank } from '../infrastructure/context/BankContext';
import { UserRole } from '../domain/entities';
import { Shield, User, Landmark, Eye, Settings, Terminal } from 'lucide-react';

export const RoleSelector: React.FC = () => {
  const { activeRole, currentUser, errorMsg } = useBank();

  const rolesConfig: {
    role: UserRole;
    label: string;
    icon: React.ReactNode;
    description: string;
    restrictions: string;
    allowedActions: string[];
  }[] = [
    {
      role: 'CLIENTE',
      label: 'Cliente',
      icon: <User className="w-5 h-5" />,
      description: 'Consulta sus cuentas, genera retiros OTP y realiza transferencias desde cuentas propias.',
      restrictions: 'No puede ver otros clientes, operar ventanilla, congelar cuentas ni cambiar parametros.',
      allowedActions: ['Mis saldos', 'Transferencias', 'Retiros OTP', '2FA'],
    },
    {
      role: 'CAJERO',
      label: 'Cajero',
      icon: <Landmark className="w-5 h-5" />,
      description: 'Busca clientes activos y registra depositos o retiros fisicos de ventanilla.',
      restrictions: 'No puede transferir como cliente, crear empleados, modificar reglas ni auditar globalmente.',
      allowedActions: ['Busqueda', 'Depositos', 'Retiros fisicos', 'Redimir OTP'],
    },
    {
      role: 'AUDITOR',
      label: 'Auditor',
      icon: <Eye className="w-5 h-5" />,
      description: 'Revisa trazabilidad completa, monitorea operaciones inusuales y congela cuentas.',
      restrictions: 'No puede mover dinero, registrar caja, crear empleados ni cambiar parametros del core.',
      allowedActions: ['Audit trail', 'Alertas PLAFT', 'Congelar', 'Descongelar'],
    },
    {
      role: 'ADMIN',
      label: 'Administrador',
      icon: <Settings className="w-5 h-5" />,
      description: 'Gestiona empleados operativos y reglas globales del sistema financiero.',
      restrictions: 'No puede alterar saldos, ejecutar transferencias ni operar dinero de clientes.',
      allowedActions: ['Empleados', 'Tasas', 'Limites', 'Comisiones'],
    },
  ];

  return (
    <div className="mb-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Matriz de permisos simulados</h2>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">Control de acceso por usuario autenticado</h1>
        </div>

        {currentUser && (
          <div className="flex items-center gap-3 self-start rounded-xl border border-slate-100 bg-slate-50 px-4 py-2 text-xs md:self-auto">
            <Shield className="h-4 w-4 text-emerald-600" />
            <div>
              <p className="font-semibold text-slate-700">{currentUser.name}</p>
              <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                {currentUser.role} | ID: {currentUser.identityId} | Sesion local
              </p>
            </div>
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-800">
          {errorMsg}
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 gap-4">
        {rolesConfig.filter(cfg => cfg.role === activeRole).map(cfg => {
          return (
            <div
              key={cfg.role}
              className="rounded-xl border-2 border-emerald-600 bg-emerald-50/50 p-4 shadow-sm shadow-emerald-50 transition-all"
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="rounded-lg bg-emerald-600 p-2 text-white">
                  {cfg.icon}
                </div>
                <div>
                  <span className="font-bold text-emerald-800">{cfg.label}</span>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Activo</p>
                </div>
              </div>

              <p className="mb-3 text-xs leading-relaxed text-slate-500">{cfg.description}</p>
              <div className="mb-3 flex flex-wrap gap-1.5">
                {cfg.allowedActions.map(action => (
                  <span key={action} className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-800">
                    {action}
                  </span>
                ))}
              </div>
              <div className="border-t border-dashed border-slate-100 pt-2">
                <p className="text-[10px] font-medium uppercase tracking-tight text-slate-400">Restriccion critica:</p>
                <p className="text-[10px] font-medium leading-snug text-red-600">{cfg.restrictions}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-start gap-3 rounded-xl bg-slate-900 p-4 font-mono text-[11px] text-slate-300">
        <Terminal className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
        <div className="space-y-1">
          <p className="text-slate-400">
            <span className="text-emerald-400">root@mushucruna-core:~$</span> ./authorize_session --role={activeRole}
          </p>
          <p className="text-slate-200">[OK] Sesion simulada enlazada al usuario autenticado. Cambio libre de rol bloqueado.</p>
          <p className="text-slate-400">[SEGURIDAD] Cada accion vuelve a validar permisos en la capa de contexto antes de ejecutar el caso de uso en memoria.</p>
        </div>
      </div>
    </div>
  );
};
