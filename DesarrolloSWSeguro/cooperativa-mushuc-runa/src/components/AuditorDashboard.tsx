/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useBank } from '../infrastructure/context/BankContext';
import { Account } from '../domain/entities';
import {
  Eye,
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Lock,
  UserCheck,
  Power,
  RefreshCw,
  Terminal,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AuditorDashboard: React.FC = () => {
  const {
    allAccounts,
    allUsers,
    transactions,
    auditLogs,
    toggleFreeze,
    errorMsg,
    successMsg,
    clearNotifications
  } = useBank();

  // Filter logs states
  const [logSearch, setLogSearch] = useState('');
  const [selectedActionFilter, setSelectedActionFilter] = useState('ALL');

  // Freeze account states
  const [freezeAccId, setFreezeAccId] = useState('');
  const [freezeAction, setFreezeAction] = useState<'FREEZE' | 'UNFREEZE'>('FREEZE');
  const [freezeReason, setFreezeReason] = useState('');

  // Set default account on load
  React.useEffect(() => {
    if (allAccounts.length > 0) {
      setFreezeAccId(allAccounts[0].id);
    }
  }, [allAccounts]);

  const handleToggleFreeze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!freezeAccId || !freezeReason.trim()) {
      alert('Por favor complete la cuenta de destino y la justificación obligatoria.');
      return;
    }

    try {
      await toggleFreeze(freezeAccId, freezeAction, freezeReason);
      setFreezeReason('');
    } catch (e) {
      // Handled in context
    }
  };

  // Unusual Transactions filter (> $10,000 USD)
  const unusualTransactions = transactions.filter(tx => tx.amount > 10000 || tx.status === 'FAILED');

  // Filter audit logs based on search query and action type
  const filteredAuditLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.userName.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.action.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.details.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.ipAddress.includes(logSearch);
      
    const matchesAction = selectedActionFilter === 'ALL' || log.action.includes(selectedActionFilter);
    return matchesSearch && matchesAction;
  });

  // Extract unique actions for filtering dropdown
  const uniqueActions = Array.from(new Set(auditLogs.map(l => l.action.split('_')[0])));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Top Banner Warning */}
      <div className="lg:col-span-12 bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-3xl p-5 flex items-start gap-4 shadow-sm">
        <ShieldAlert className="w-6 h-6 text-indigo-700 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-sm text-indigo-800">Workspace de Auditoría y Cumplimiento Regulatorio</h4>
          <p className="text-xs text-indigo-950/80 mt-1 leading-relaxed">
            Este perfil opera bajo regulaciones estrictas de Prevención de Lavado de Activos y Financiamiento de Delitos (Sari/PLAFT). Tiene facultades de <strong>congelamiento inmediato</strong> de cuentas sospechosas y acceso al <strong>Audit Trail global</strong>. Los movimientos de fondos están estrictamente bloqueados (segregación de funciones).
          </p>
        </div>
      </div>

      {/* Unusual Transactions Dashboard & Account Lock */}
      <div className="lg:col-span-4 space-y-6">
        {/* AML Radar */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold text-red-600 uppercase tracking-widest font-mono flex items-center gap-1.5 animate-pulse">
              <span className="h-2 w-2 rounded-full bg-red-600"></span> Radar de Transacciones Inusuales (UML)
            </h3>
            <span className="bg-red-50 text-red-700 text-[9px] font-bold uppercase px-2 py-0.5 rounded">Límite Legal: $10k</span>
          </div>

          <div className="space-y-3">
            {unusualTransactions.length === 0 ? (
              <p className="text-xs text-slate-400 p-4 text-center border border-dashed border-slate-100 rounded-xl">
                No se han registrado transferencias o depósitos sospechosos que superen los umbrales legales.
              </p>
            ) : (
              unusualTransactions.map(tx => (
                <div key={tx.id} className="p-3 bg-red-50/50 border border-red-100 rounded-xl text-xs space-y-1">
                  <div className="flex justify-between font-bold">
                    <span className="text-red-800 font-mono">{tx.refCode}</span>
                    <span className="text-red-700 font-mono">${tx.amount.toLocaleString('en-US')}</span>
                  </div>
                  <p className="text-slate-600 font-semibold">{tx.description}</p>
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>IP: {tx.ipAddress}</span>
                    <span>Status: {tx.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Account Freeze/Unfreeze Control */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-2 text-indigo-700 mb-4 pb-2 border-b border-slate-50">
            <Power className="w-5 h-5" />
            <h4 className="text-xs font-bold uppercase font-mono tracking-wider">Control de Bloqueo de Cuentas</h4>
          </div>

          <form onSubmit={handleToggleFreeze} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider font-mono mb-2">Seleccionar Cuenta Objetivo</label>
              <select
                value={freezeAccId}
                onChange={(e) => setFreezeAccId(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-2.5 text-xs bg-slate-50 focus:outline-indigo-600"
              >
                {allAccounts.map((a) => {
                  const user = allUsers.find(u => u.id === a.userId);
                  return (
                    <option key={a.id} value={a.id}>
                      Cuenta {a.type} &bull; Nº {a.accountNumber} ({user?.name || 'Cliente'}) &bull; [Estado: {a.status}]
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider font-mono mb-2">Acción Regulatoria</label>
              <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setFreezeAction('FREEZE')}
                  className={`py-2 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                    freezeAction === 'FREEZE' ? 'bg-white text-indigo-900 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  Congelar Cuenta
                </button>
                <button
                  type="button"
                  onClick={() => setFreezeAction('UNFREEZE')}
                  className={`py-2 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                    freezeAction === 'UNFREEZE' ? 'bg-white text-indigo-900 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  Descongelar
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider font-mono mb-2">Justificación Legal / Motivo</label>
              <textarea
                placeholder="Indique la sospecha o caso judicial (Ej. Alerta PLD - Depósito inusual o investigación judicial)"
                value={freezeReason}
                required
                onChange={(e) => setFreezeReason(e.target.value)}
                rows={3}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-indigo-600 bg-slate-50"
              />
            </div>

            {/* In-block notifications */}
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
              id="submit-freeze-auditor"
              className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer"
            >
              Aplicar Medida de Seguridad
            </button>
          </form>
        </div>
      </div>

      {/* Global Audit Trail Panel */}
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-700" /> Registro Completo de Auditoría (Audit Trail)
              </h3>
              <p className="text-xs text-slate-400 mt-1">Registros inalterables firmados en servidor local con ID de IP</p>
            </div>

            <div className="flex gap-2 self-start sm:self-auto">
              <select
                value={selectedActionFilter}
                onChange={(e) => setSelectedActionFilter(e.target.value)}
                className="border border-slate-200 rounded-lg p-2 text-[10px] font-bold font-mono bg-slate-50 focus:outline-none"
              >
                <option value="ALL">TODAS LAS ACCIONES</option>
                <option value="LOGIN">INICIOS DE SESIÓN</option>
                <option value="TRANSFER">TRANSFERENCIAS</option>
                <option value="DEPOSIT">DEPÓSITOS</option>
                <option value="WITHDRAW">RETIROS</option>
                <option value="CONGELAMIENTO">CONGELAMIENTOS</option>
                <option value="EMPLOYEE">EMPLEADOS</option>
                <option value="CONFIG">CAMBIOS REGLAS</option>
              </select>
            </div>
          </div>

          {/* Log Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
            <input
              type="text"
              placeholder="Filtre los registros por usuario, acción, IP o palabra clave..."
              value={logSearch}
              onChange={(e) => setLogSearch(e.target.value)}
              className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono focus:outline-indigo-600 bg-slate-50"
            />
          </div>

          {/* Audit Logs Table */}
          <div className="border border-slate-150 rounded-2xl overflow-hidden">
            <div className="max-h-[500px] overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 text-[9px] font-bold font-mono uppercase border-b border-slate-150 sticky top-0">
                    <th className="p-3">Sello de Tiempo</th>
                    <th className="p-3">Operador / IP</th>
                    <th className="p-3">Acción</th>
                    <th className="p-3">Firma de Registro / Detalles</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px]">
                  {filteredAuditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-slate-400 font-semibold font-mono">
                        No se encontraron registros de auditoría que coincidan con los filtros.
                      </td>
                    </tr>
                  ) : (
                    filteredAuditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/40">
                        <td className="p-3 font-mono text-[10px] text-slate-500 whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="p-3">
                          <p className="font-bold text-slate-700">{log.userName}</p>
                          <span className="font-mono text-[9px] text-indigo-700 uppercase bg-indigo-50 px-1 py-0.2 rounded mr-1">
                            {log.role}
                          </span>
                          <span className="font-mono text-[9px] text-slate-400">IP: {log.ipAddress}</span>
                        </td>
                        <td className="p-3">
                          <span className={`inline-flex font-mono text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            log.action.includes('ERR') || log.action.includes('SUSPEND') || log.action.includes('CONGELAMIENTO')
                              ? 'bg-red-50 text-red-700 border border-red-100'
                              : log.action.includes('SUCCESS') || log.action.includes('CREATED') || log.action.includes('BOO')
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="p-3 text-slate-600 leading-normal max-w-xs md:max-w-md">
                          <p className="font-medium text-slate-700">{log.details}</p>
                          <span className="block text-[9px] font-mono text-slate-400">ID Log: {log.id}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
