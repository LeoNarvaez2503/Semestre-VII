/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useBank } from '../infrastructure/context/BankContext';
import { User, UserRole } from '../domain/entities';
import {
  Settings,
  Users,
  Activity,
  UserPlus,
  ShieldAlert,
  Percent,
  CheckCircle2,
  AlertTriangle,
  Lock,
  UserX,
  UserCheck,
  Server,
  DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AdminDashboard: React.FC = () => {
  const {
    allUsers,
    allAccounts,
    systemConfig,
    createEmployee,
    toggleEmployeeStatus,
    updateConfig,
    errorMsg,
    successMsg,
    clearNotifications
  } = useBank();

  // Employee creation states
  const [empName, setEmpName] = useState('');
  const [empId, setEmpId] = useState('');
  const [empEmail, setEmpEmail] = useState('');
  const [empRole, setEmpRole] = useState<'CAJERO' | 'AUDITOR'>('CAJERO');

  // Config parameters states
  const [dailyLimit, setDailyLimit] = useState(systemConfig?.dailyTransferLimit.toString() || '5000');
  const [commFee, setCommFee] = useState(systemConfig?.commissionFee.toString() || '2.5');
  const [interest, setInterest] = useState(systemConfig?.savingsInterestRate.toString() || '6.5');

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName || !empId || !empEmail) return;

    try {
      await createEmployee(empName, empId, empEmail, empRole);
      // Reset form
      setEmpName('');
      setEmpId('');
      setEmpEmail('');
    } catch (e) {
      // Handled in context
    }
  };

  const handleUpdateConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dailyLimit || !commFee || !interest) return;

    try {
      await updateConfig(
        parseFloat(dailyLimit),
        parseFloat(commFee),
        parseFloat(interest)
      );
    } catch (e) {
      // Handled in context
    }
  };

  // Filter only employees (Cashiers & Auditors)
  const employees = allUsers.filter(u => u.role === 'CAJERO' || u.role === 'AUDITOR');

  // Compute stats
  const totalAssets = allAccounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalClients = allUsers.filter(u => u.role === 'CLIENTE').length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Top Warning Segregación */}
      <div className="lg:col-span-12 bg-red-50 border border-red-200 text-red-900 rounded-3xl p-5 flex items-start gap-4 shadow-sm">
        <ShieldAlert className="w-6 h-6 text-red-700 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-sm text-red-800">Segregación de Funciones &bull; Cumplimiento Bancario CODESAN</h4>
          <p className="text-xs text-red-950/80 mt-1 leading-relaxed">
            Como Administrador de la plataforma Cooperativa Mushuc Runa, sus privilegios de escritura están estrictamente limitados a la <strong>gestión operativa</strong> de personal y <strong>definición de reglas del negocio</strong>. Las operaciones de movimiento de dinero, debitación o alteración de balances están deshabilitadas por diseño técnico para mitigar fraudes internos o conflictos de interés.
          </p>
        </div>
      </div>

      {/* KPI Stats Panel */}
      <div className="lg:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-800">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold tracking-wider">Activos en Custodia</span>
            <span className="text-lg font-black font-mono text-slate-800">
              ${totalAssets.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 rounded-xl text-amber-800">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold tracking-wider">Clientes Cooperados</span>
            <span className="text-lg font-black font-mono text-slate-800">{totalClients}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 rounded-xl text-indigo-800">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold tracking-wider">Latencia Transaccional</span>
            <span className="text-lg font-black font-mono text-slate-800">3.8 ms</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-50 rounded-xl text-rose-800">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold tracking-wider">Disponibilidad Core</span>
            <span className="text-lg font-black font-mono text-slate-800">99.98% SLA</span>
          </div>
        </div>
      </div>

      {/* Roster & Add Employee */}
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-emerald-800" /> Plantilla de Empleados Autorizados
          </h3>

          <div className="border border-slate-150 rounded-2xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold font-mono uppercase border-b border-slate-150">
                  <th className="p-4">Nombre / Correo</th>
                  <th className="p-4">Identificación</th>
                  <th className="p-4">Perfil</th>
                  <th className="p-4 text-center">Estado</th>
                  <th className="p-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/40">
                    <td className="p-4">
                      <p className="font-bold text-slate-700">{emp.name}</p>
                      <span className="text-[10px] font-mono text-slate-400">{emp.email}</span>
                    </td>
                    <td className="p-4 font-mono font-semibold">{emp.identityId}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase font-mono ${
                        emp.role === 'CAJERO' ? 'bg-amber-50 text-amber-800 border border-amber-100' : 'bg-indigo-50 text-indigo-800 border border-indigo-100'
                      }`}>
                        {emp.role}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        emp.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${emp.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                        {emp.status === 'ACTIVE' ? 'Activo' : 'Suspendido'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {emp.status === 'ACTIVE' ? (
                        <button
                          type="button"
                          onClick={() => toggleEmployeeStatus(emp.id, 'SUSPEND')}
                          className="text-red-600 hover:text-red-800 font-bold text-xs uppercase tracking-wider cursor-pointer flex items-center gap-1 justify-end ml-auto"
                        >
                          <UserX className="w-3.5 h-3.5" /> Suspender
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => toggleEmployeeStatus(emp.id, 'ACTIVATE')}
                          className="text-emerald-600 hover:text-emerald-800 font-bold text-xs uppercase tracking-wider cursor-pointer flex items-center gap-1 justify-end ml-auto"
                        >
                          <UserCheck className="w-3.5 h-3.5" /> Activar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Employee Form */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-4">
            <UserPlus className="w-5 h-5 text-emerald-800" /> Registrar Nuevo Empleado
          </h3>

          <form onSubmit={handleCreateEmployee} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider font-mono mb-1.5">Nombre Completo</label>
              <input
                type="text"
                placeholder="Ej. Ing. Juan Gabriel Perez"
                required
                value={empName}
                onChange={(e) => setEmpName(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-emerald-600 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider font-mono mb-1.5">Nº Cédula o Pasaporte</label>
              <input
                type="text"
                placeholder="Ej. 1802345678"
                required
                value={empId}
                onChange={(e) => setEmpId(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono focus:outline-emerald-600 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider font-mono mb-1.5">Correo Electrónico Corporativo</label>
              <input
                type="email"
                placeholder="perez.juan@mushucruna.ec"
                required
                value={empEmail}
                onChange={(e) => setEmpEmail(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-emerald-600 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider font-mono mb-1.5">Asignar Perfil Operativo</label>
              <select
                value={empRole}
                onChange={(e) => setEmpRole(e.target.value as any)}
                className="w-full border border-slate-200 rounded-xl p-2 text-xs focus:outline-emerald-600 bg-slate-50"
              >
                <option value="CAJERO">CAJERO EN SUCURSAL</option>
                <option value="AUDITOR">AUDITOR INTERNO (AML/COMPLIANCE)</option>
              </select>
            </div>

            <div className="md:col-span-2 pt-2">
              <button
                type="submit"
                id="btn-create-emp"
                className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer"
              >
                Registrar Empleado
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* System Parameter Configurations */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-2 text-slate-700 mb-4 pb-2 border-b border-slate-50">
            <Settings className="w-5 h-5 text-emerald-800" />
            <h4 className="text-xs font-bold uppercase font-mono tracking-wider">Reglas del Negocio (Core)</h4>
          </div>

          <form onSubmit={handleUpdateConfig} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider font-mono mb-1.5">Límite Diario de Transferencia ($ USD)</label>
              <input
                type="number"
                step="50"
                value={dailyLimit}
                required
                onChange={(e) => setDailyLimit(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono focus:outline-emerald-600 bg-slate-50"
              />
              <span className="text-[9px] text-slate-400 block mt-1">Límite máximo que un cliente puede transferir al día.</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider font-mono mb-1.5">Comisión por Transferencia Externa ($ USD)</label>
              <input
                type="number"
                step="0.10"
                value={commFee}
                required
                onChange={(e) => setCommFee(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono focus:outline-emerald-600 bg-slate-50"
              />
              <span className="text-[9px] text-slate-400 block mt-1">Tarifa fija para envíos interbancarios (SPI).</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider font-mono mb-1.5">Tasa Pasiva Anual Ahorro (% E.A.)</label>
              <input
                type="number"
                step="0.05"
                value={interest}
                required
                onChange={(e) => setInterest(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono focus:outline-emerald-600 bg-slate-50"
              />
              <span className="text-[9px] text-slate-400 block mt-1">Interés anual capitalizable acreditado a clientes.</span>
            </div>

            {/* Notification messages */}
            {successMsg && (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl p-3 text-[11px] font-semibold">
                {successMsg}
              </div>
            )}
            {errorMsg && (
              <div className="bg-red-50 border border-red-100 text-red-800 rounded-xl p-3 text-[11px] font-semibold">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              id="submit-config-admin"
              className="w-full bg-emerald-850 hover:bg-emerald-900 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer"
            >
              Aplicar Cambios Globales
            </button>
          </form>
        </div>

        {/* Server & Audit integrity info */}
        <div className="bg-slate-900 text-slate-300 font-mono text-[10px] rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>INTEGRIDAD DE PARÁMETROS</span>
          </div>
          <p className="text-slate-400 leading-normal">
            Cualquier modificación efectuada en este panel se difunde atómicamente a los servicios de dominio de manera sincrónica.
          </p>
          <p className="text-slate-400 text-[9px] pt-1">
            Core Version: 4.12-LTS &bull; Checksum: 88AFE9
          </p>
        </div>
      </div>
    </div>
  );
};
