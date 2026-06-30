/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useBank } from '../infrastructure/context/BankContext';
import { UserRole } from '../domain/entities';
import { Shield, User, Landmark, Eye, Settings, Terminal } from 'lucide-react';

export const RoleSelector: React.FC = () => {
  const { activeRole, switchRole, currentUser } = useBank();

  const rolesConfig: {
    role: UserRole;
    label: string;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
    borderColor: string;
    description: string;
    restrictions: string;
  }[] = [
    {
      role: 'CLIENTE',
      label: 'Cliente',
      icon: <User className="w-5 h-5" />,
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-50 hover:bg-emerald-100',
      borderColor: 'border-emerald-200',
      description: 'Consulta saldos, estados de cuenta. Realiza transferencias, depósitos y retiros (vía OTP/QR).',
      restrictions: 'Restringido estrictamente a sus propios activos. No tiene acceso a datos de otros clientes.',
    },
    {
      role: 'CAJERO',
      label: 'Cajero',
      icon: <Landmark className="w-5 h-5" />,
      color: 'text-amber-700',
      bgColor: 'bg-amber-50 hover:bg-amber-100',
      borderColor: 'border-amber-200',
      description: 'Registra depósitos y retiros físicos en sucursal. Busca cuentas por Cédula o número de cuenta.',
      restrictions: 'No puede modificar parámetros del sistema, crear empleados, ni aprobar créditos/límites.',
    },
    {
      role: 'AUDITOR',
      label: 'Auditor',
      icon: <Eye className="w-5 h-5" />,
      color: 'text-indigo-700',
      bgColor: 'bg-indigo-50 hover:bg-indigo-100',
      borderColor: 'border-indigo-200',
      description: 'Acceso total al Registro de Auditoría (Audit Trail). Monitorea alertas de prevención de lavado de activos. Puede congelar cuentas.',
      restrictions: 'Perfil de solo lectura financiera: No puede realizar depósitos, retiros ni transferir dinero.',
    },
    {
      role: 'ADMIN',
      label: 'Administrador',
      icon: <Settings className="w-5 h-5" />,
      color: 'text-rose-700',
      bgColor: 'bg-rose-50 hover:bg-rose-100',
      borderColor: 'border-rose-200',
      description: 'Gestión de empleados (cajeros, auditores), configuración de tasas de interés, límites de transferencias y comisiones.',
      restrictions: 'Segregación de funciones: El Administrador no puede mover dinero ni alterar saldos para evitar fraudes.',
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <h2 className="text-xs font-semibold text-slate-400 tracking-wider uppercase font-mono">Consola de Simulación Fintech</h2>
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Mushuc Runa - Control de Acceso y Roles</h1>
        </div>
        
        {currentUser && (
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 self-start md:self-auto text-xs">
            <Shield className="w-4 h-4 text-emerald-600" />
            <div>
              <p className="font-semibold text-slate-700">{currentUser.name}</p>
              <p className="text-slate-400 text-[10px] font-mono uppercase tracking-wider">
                {currentUser.role} &bull; ID: {currentUser.identityId} &bull; SSL Activo
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {rolesConfig.map((cfg) => {
          const isSelected = activeRole === cfg.role;
          return (
            <button
              key={cfg.role}
              id={`role-btn-${cfg.role.toLowerCase()}`}
              onClick={() => switchRole(cfg.role)}
              className={`text-left p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-50/50 shadow-sm shadow-emerald-50'
                  : `border-slate-100 bg-white hover:border-slate-300`
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-50 text-slate-500'}`}>
                  {cfg.icon}
                </div>
                <span className={`font-bold ${isSelected ? 'text-emerald-800' : 'text-slate-700'}`}>
                  {cfg.label}
                </span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                {cfg.description}
              </p>
              <div className="pt-2 border-t border-dashed border-slate-100 mt-auto">
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tight">Limitación Crítica:</p>
                <p className="text-[10px] font-medium text-red-600 leading-snug">
                  {cfg.restrictions}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="bg-slate-900 text-slate-300 font-mono text-[11px] rounded-xl p-4 flex items-start gap-3">
        <Terminal className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-slate-400">
            <span className="text-emerald-400">root@mushucruna-core:~$</span> ./verify_clean_architecture.sh --role={activeRole}
          </p>
          <p className="text-slate-200">
            [OK] Autenticación mapeada. Capa de Dominio (Use Cases) instanciada con Inyección de Dependencias.
          </p>
          <p className="text-slate-400">
            [SEGURIDAD] Todas las llamadas de balance y consulta pasan por validaciones de propiedad rígidas en los casos de uso. El estado persistente está mapeado en la base de datos de almacenamiento local (localStorage).
          </p>
        </div>
      </div>
    </div>
  );
};
