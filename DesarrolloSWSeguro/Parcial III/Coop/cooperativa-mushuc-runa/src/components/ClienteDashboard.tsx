/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useBank } from '../infrastructure/context/BankContext';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  TrendingUp,
  ShieldCheck,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ClienteDashboard: React.FC = () => {
  const {
    currentUser,
    currentUserAccounts,
    transactions,
    systemConfig,
    deposit,
    withdraw,
    transfer,
    errorMsg,
    successMsg,
    clearNotifications
  } = useBank();

  const [activeTab, setActiveTab] = useState<'RESUMEN' | 'DEPOSITO' | 'RETIRO' | 'TRANSFERENCIA' | 'SEGURIDAD'>('RESUMEN');
  
  // Form states
  const [depositAcc, setDepositAcc] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [depositDesc, setDepositDesc] = useState('');

  const [withdrawAcc, setWithdrawAcc] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawDesc, setWithdrawDesc] = useState('');
  const [otpGenerated, setOtpGenerated] = useState<string | null>(null);

  const [transferSource, setTransferSource] = useState('');
  const [transferDest, setTransferDest] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferDesc, setTransferDesc] = useState('');
  const [transferType, setTransferType] = useState<'INTERNA' | 'EXTERNA'>('INTERNA');

  const [twoFactor, setTwoFactor] = useState(currentUser?.twoFactorEnabled || false);

  // Set default accounts on load
  React.useEffect(() => {
    if (currentUserAccounts.length > 0) {
      setDepositAcc(currentUserAccounts[0].id);
      setWithdrawAcc(currentUserAccounts[0].id);
      setTransferSource(currentUserAccounts[0].id);
    }
  }, [currentUserAccounts]);

  const totalBalance = currentUserAccounts.reduce((sum, acc) => sum + acc.balance, 0);

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositAcc || !depositAmount) return;
    try {
      await deposit(depositAcc, parseFloat(depositAmount), depositDesc || 'Auto-depósito virtual');
      setDepositAmount('');
      setDepositDesc('');
    } catch (e) {
      // Handled in context
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawAcc || !withdrawAmount) return;
    try {
      const res = await withdraw(withdrawAcc, parseFloat(withdrawAmount), withdrawDesc || 'Retiro ATM', 'ATM');
      if (res.otpCode) {
        setOtpGenerated(res.otpCode);
      }
      setWithdrawAmount('');
      setWithdrawDesc('');
    } catch (e) {
      // Handled in context
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferSource || !transferDest || !transferAmount) return;
    try {
      await transfer(
        transferSource,
        transferDest,
        parseFloat(transferAmount),
        transferDesc || 'Transferencia inmediata',
        transferType === 'EXTERNA'
      );
      setTransferDest('');
      setTransferAmount('');
      setTransferDesc('');
    } catch (e) {
      // Handled in context
    }
  };

  // Filter transactions belonging to client's accounts
  const clientAccountIds = currentUserAccounts.map(a => a.id);
  const clientTransactions = transactions.filter(
    tx => (tx.sourceAccountId && clientAccountIds.includes(tx.sourceAccountId)) || 
          (tx.destinationAccountId && clientAccountIds.includes(tx.destinationAccountId))
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Sidebar Navigation */}
      <div className="lg:col-span-3 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 border-b lg:border-b-0 lg:border-r border-slate-200">
        {[
          { id: 'RESUMEN', label: 'Resumen de Cuentas', icon: <Wallet className="w-4 h-4" /> },
          { id: 'DEPOSITO', label: 'Realizar Depósito', icon: <ArrowDownLeft className="w-4 h-4" /> },
          { id: 'RETIRO', label: 'Solicitar Retiro QR/OTP', icon: <QrCode className="w-4 h-4" /> },
          { id: 'TRANSFERENCIA', label: 'Transferencias', icon: <ArrowUpRight className="w-4 h-4" /> },
          { id: 'SEGURIDAD', label: 'Seguridad y 2FA', icon: <ShieldCheck className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            id={`tab-client-${tab.id.toLowerCase()}`}
            onClick={() => {
              setActiveTab(tab.id as any);
              clearNotifications();
              setOtpGenerated(null);
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap border-l-2 ${
              activeTab === tab.id
                ? 'bg-emerald-600/10 text-emerald-700 border-emerald-500 shadow-sm shadow-emerald-50/50'
                : 'text-slate-600 hover:bg-slate-50 border-transparent'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main Panel */}
      <div className="lg:col-span-9">
        {/* Alerts */}
        <AnimatePresence mode="wait">
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 mb-6 flex items-start gap-3"
            >
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-xs uppercase tracking-wider text-red-700">Fallo en Operación / Validación</p>
                <p className="text-xs font-semibold leading-relaxed mt-0.5">{errorMsg}</p>
              </div>
            </motion.div>
          )}

          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-emerald-50 border border-emerald-200 text-emerald-850 rounded-xl p-4 mb-6 flex items-start gap-3"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-xs uppercase tracking-wider text-emerald-750">Operación Exitosa</p>
                <p className="text-xs font-semibold leading-relaxed mt-0.5">{successMsg}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Views */}
        {activeTab === 'RESUMEN' && (
          <div className="space-y-8">
            {/* Balance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-gradient-to-br from-emerald-650 via-emerald-600 to-emerald-800 text-white rounded-3xl p-8 relative overflow-hidden shadow-lg shadow-emerald-950/10">
                {/* Visual geometric accent blur circles */}
                <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute right-12 bottom-12 w-20 h-20 bg-emerald-500/20 rounded-full blur-xl"></div>
                
                <div className="absolute right-6 bottom-6 translate-x-1/8 translate-y-1/8 opacity-10">
                  <Wallet className="w-48 h-48" />
                </div>
                <p className="text-emerald-100 font-mono text-[10px] uppercase tracking-widest font-semibold">
                  Saldos Consolidados &bull; Cooperativa Mushuc Runa
                </p>
                <h3 className="text-4xl font-black font-mono mt-3 tracking-tight">
                  ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h3>
                <p className="text-xs text-emerald-100/80 mt-1">Saldo disponible total en cuenta corriente y ahorros</p>

                <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-emerald-500/40">
                  <div>
                    <span className="text-emerald-100/70 font-mono text-[9px] uppercase tracking-wider block">ID Cliente</span>
                    <span className="text-xs font-bold font-mono">{currentUser?.identityId}</span>
                  </div>
                  <div>
                    <span className="text-emerald-100/70 font-mono text-[9px] uppercase tracking-wider block">Estado de Cuenta</span>
                    <span className="inline-flex items-center gap-1 bg-white/10 text-white rounded-full px-2 py-0.5 text-[9px] font-bold uppercase mt-1">
                      <span className="h-1 w-1 bg-emerald-300 rounded-full"></span> Activa
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="flex items-center gap-2 text-amber-600 mb-2">
                    <TrendingUp className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase font-mono tracking-wider">Mushuc Runa Plus</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800">Tasa de Ahorro Pasiva</h4>
                  <p className="text-2xl font-black font-mono text-emerald-800 mt-2">
                    {systemConfig?.savingsInterestRate}% E.A.
                  </p>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Tus ahorros rinden al máximo gracias al interés cooperativo configurado por administración.
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 flex items-start gap-2.5 text-[11px] text-slate-600 mt-4 border border-slate-200">
                  <Info className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                  <span>Retiro ATM sin costo hasta $500/día. Comisiones interbancarias fijas: ${systemConfig?.commissionFee.toFixed(2)}.</span>
                </div>
              </div>
            </div>

            {/* Individual Accounts */}
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest font-mono mb-4">Detalle de mis Cuentas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentUserAccounts.map((acc) => (
                  <div key={acc.id} className="bg-white border border-slate-200 hover:border-emerald-500/40 hover:shadow-md transition-all rounded-2xl p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="inline-flex bg-slate-100 text-slate-700 text-[10px] font-bold uppercase px-2.5 py-1 rounded-md font-mono">
                          Cuenta {acc.type}
                        </span>
                        <p className="text-xs text-slate-400 font-mono mt-1">Nº {acc.accountNumber}</p>
                      </div>
                      <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full">
                        {acc.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400">Saldo Disponible</p>
                      <p className="text-2xl font-bold font-mono text-slate-800">
                        ${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Account History */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest font-mono">Movimientos Recientes</h3>
                <span className="text-xs font-mono text-slate-400">{clientTransactions.length} registros</span>
              </div>
              
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                {clientTransactions.length === 0 ? (
                  <div className="p-12 text-center">
                    <RefreshCw className="w-8 h-8 text-slate-300 mx-auto animate-spin mb-3" />
                    <p className="text-sm font-semibold text-slate-500">No hay transacciones registradas para este cliente.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-bold font-mono uppercase border-b border-slate-200">
                          <th className="p-4">Código / Fecha</th>
                          <th className="p-4">Tipo</th>
                          <th className="p-4">Descripción</th>
                          <th className="p-4 text-right">Monto</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs">
                        {clientTransactions.map((tx) => {
                          const isDebit = tx.sourceAccountId && clientAccountIds.includes(tx.sourceAccountId);
                          return (
                            <tr key={tx.id} className="hover:bg-slate-50/40">
                              <td className="p-4 font-mono">
                                <span className="font-bold text-slate-700">{tx.refCode}</span>
                                <span className="block text-[10px] text-slate-400">{new Date(tx.timestamp).toLocaleString()}</span>
                              </td>
                              <td className="p-4">
                                <span className={`inline-flex font-semibold px-2 py-0.5 rounded-full text-[9px] uppercase ${
                                  tx.type === 'DEPOSIT' ? 'bg-emerald-50 text-emerald-700' :
                                  tx.type === 'WITHDRAWAL' ? 'bg-amber-50 text-amber-700' :
                                  'bg-indigo-50 text-indigo-700'
                                }`}>
                                  {tx.type === 'DEPOSIT' ? 'Depósito' : tx.type === 'WITHDRAWAL' ? 'Retiro' : 'Transferencia'}
                                </span>
                              </td>
                              <td className="p-4">
                                <p className="font-semibold text-slate-700">{tx.description}</p>
                                <span className="text-[10px] font-mono text-slate-400 font-medium">Canal IP: {tx.ipAddress}</span>
                              </td>
                              <td className={`p-4 text-right font-bold font-mono ${isDebit ? 'text-red-600' : 'text-emerald-700'}`}>
                                {isDebit ? '-' : '+'}${tx.amount.toFixed(2)}
                                {tx.fee > 0 && <span className="block text-[9px] font-normal text-slate-400 font-mono">Comisión: ${tx.fee.toFixed(2)}</span>}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'DEPOSITO' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Simular Depósito de Fondos</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              En esta demostración, puedes simular una inyección de fondos a tus cuentas cooperativas como si estuvieras utilizando una pasarela de pago digital o escaneando un cheque móvil.
            </p>

            <form onSubmit={handleDeposit} className="space-y-6 max-w-xl">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider font-mono mb-2">Seleccionar Cuenta Destino</label>
                <select
                  value={depositAcc}
                  onChange={(e) => setDepositAcc(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:outline-emerald-600"
                >
                  {currentUserAccounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      Cuenta {a.type} &bull; Nº {a.accountNumber} (Saldo: ${a.balance.toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider font-mono mb-2">Monto del Depósito ($ USD)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold font-mono text-sm">$</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    required
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl pl-8 pr-4 py-3 text-sm font-mono focus:outline-emerald-600 bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider font-mono mb-2">Descripción / Concepto</label>
                <input
                  type="text"
                  placeholder="Ej. Depósito cheque nómina"
                  value={depositDesc}
                  onChange={(e) => setDepositDesc(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-emerald-600 bg-slate-50"
                />
              </div>

              <button
                type="submit"
                id="submit-deposit-client"
                className="bg-slate-900 text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider cursor-pointer shadow-md hover:shadow-emerald-500/10 active:scale-[0.98] transition-all"
              >
                Procesar Depósito Virtual
              </button>
            </form>
          </div>
        )}

        {activeTab === 'RETIRO' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Solicitar Retiro mediante QR / OTP</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              De acuerdo con las regulaciones de seguridad, puedes retirar dinero sin tarjeta física. El sistema generará un código de un solo uso (OTP) y un código QR que puedes usar en nuestros cajeros automáticos físicos o ventanillas.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <form onSubmit={handleWithdraw} className="md:col-span-7 space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider font-mono mb-2">Seleccionar Cuenta de Origen</label>
                  <select
                    value={withdrawAcc}
                    onChange={(e) => setWithdrawAcc(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:outline-emerald-600"
                  >
                    {currentUserAccounts.map((a) => (
                      <option key={a.id} value={a.id}>
                        Cuenta {a.type} &bull; Nº {a.accountNumber} (Saldo: ${a.balance.toFixed(2)})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider font-mono mb-2">Monto del Retiro ($ USD)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold font-mono text-sm">$</span>
                    <input
                      type="number"
                      step="10"
                      placeholder="Múltiplos de $10"
                      required
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl pl-8 pr-4 py-3 text-sm font-mono focus:outline-emerald-600 bg-slate-50"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1.5 block">Límite ATM por transacción: $500.00</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider font-mono mb-2">Descripción / Concepto</label>
                  <input
                    type="text"
                    placeholder="Ej. Retiro para compras"
                    value={withdrawDesc}
                    onChange={(e) => setWithdrawDesc(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-emerald-600 bg-slate-50"
                  />
                </div>

                <button
                  type="submit"
                  id="submit-withdraw-client"
                  className="bg-slate-900 text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider cursor-pointer shadow-md hover:shadow-emerald-500/10 active:scale-[0.98] transition-all"
                >
                  Generar Código OTP de Retiro
                </button>
              </form>

              <div className="md:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                {otpGenerated ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="space-y-4"
                  >
                    <div className="bg-white p-4 rounded-xl border border-slate-200 inline-block shadow-sm">
                      {/* Simulated QR Code */}
                      <div className="w-36 h-36 bg-slate-800 rounded flex flex-col items-center justify-center p-2 relative">
                        <div className="absolute inset-2 border-2 border-emerald-400 border-dashed rounded opacity-30 animate-pulse"></div>
                        <QrCode className="w-20 h-20 text-white" />
                        <span className="text-[8px] font-mono text-emerald-400 tracking-widest mt-1">SECURE-QR</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">Código OTP generado</p>
                      <p className="text-3xl font-black font-mono text-emerald-800 tracking-widest mt-1">{otpGenerated}</p>
                      <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                        Proporciona este código a un cajero o ingrésalo en cualquier cajero automático Mushuc Runa para autorizar el débito físico.
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-slate-400 space-y-2">
                    <QrCode className="w-16 h-16 mx-auto stroke-[1.2] text-slate-300" />
                    <p className="font-semibold text-xs text-slate-500">Pendiente de Solicitud</p>
                    <p className="text-[10px] leading-relaxed max-w-[200px] mx-auto text-slate-400">
                      Rellene el formulario para generar su firma digital OTP válida por 15 minutos.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'TRANSFERENCIA' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Transferencias Financieras</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Realiza transferencias inmediatas de fondos. Las transferencias internas (dentro de la cooperativa) no tienen costo; las externas (a otros bancos) aplican una comisión regulada.
                </p>
              </div>
              
              <div className="flex gap-2 p-1 bg-slate-100 rounded-xl self-start">
                <button
                  type="button"
                  onClick={() => setTransferType('INTERNA')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                    transferType === 'INTERNA' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  Interna
                </button>
                <button
                  type="button"
                  onClick={() => setTransferType('EXTERNA')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                    transferType === 'EXTERNA' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  Externa (SPI)
                </button>
              </div>
            </div>

            <form onSubmit={handleTransfer} className="space-y-6 max-w-xl">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider font-mono mb-2">Cuenta de Origen (Débito)</label>
                <select
                  value={transferSource}
                  onChange={(e) => setTransferSource(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:outline-emerald-600"
                >
                  {currentUserAccounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      Cuenta {a.type} &bull; Nº {a.accountNumber} (Saldo: ${a.balance.toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider font-mono mb-2">
                  {transferType === 'INTERNA' 
                    ? 'Número de Cuenta Destinatario' 
                    : 'Número de Cuenta Interbancaria (SPI)'}
                </label>
                <input
                  type="text"
                  placeholder="Ej. 100555666 (Segundo Chango para pruebas)"
                  required
                  value={transferDest}
                  onChange={(e) => setTransferDest(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-xs font-mono focus:outline-emerald-600 bg-slate-50"
                />
                <span className="text-[10px] text-slate-400 mt-1.5 block leading-relaxed">
                  Tip: Para pruebas internas, puedes usar la cuenta de Segundo Chango: <strong>100555666</strong>.
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider font-mono mb-2">Monto de Transferencia ($ USD)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold font-mono text-sm">$</span>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      required
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl pl-8 pr-4 py-3 text-sm font-mono focus:outline-emerald-600 bg-slate-50"
                    />
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-center">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Comisión Aplicada:</span>
                  <span className="text-sm font-extrabold text-slate-700 font-mono">
                    {transferType === 'EXTERNA' ? `$${systemConfig?.commissionFee.toFixed(2)}` : '$0.00 (Gratuito)'}
                  </span>
                  <span className="text-[9px] text-slate-400 mt-0.5 leading-relaxed font-mono">
                    Límite diario de transferencias: ${systemConfig?.dailyTransferLimit.toFixed(2)}.
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider font-mono mb-2">Descripción / Motivo</label>
                <input
                  type="text"
                  placeholder="Ej. Pago servicios profesionales"
                  value={transferDesc}
                  onChange={(e) => setTransferDesc(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-emerald-600 bg-slate-50"
                />
              </div>

              <button
                type="submit"
                id="submit-transfer-client"
                className="bg-slate-900 text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider cursor-pointer shadow-md hover:shadow-emerald-500/10 active:scale-[0.98] transition-all"
              >
                Autorizar Transferencia Electrónica
              </button>
            </form>
          </div>
        )}

        {activeTab === 'SEGURIDAD' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-8">
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Seguridad Transaccional</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Administra tus credenciales, métodos de acceso y autorizaciones de doble factor (2FA) para mitigar riesgos de suplantación de identidad.
              </p>
            </div>

            <div className="border border-slate-200 rounded-2xl p-6 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                <div>
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    Doble Factor de Autenticación (2FA) 
                    <span className="inline-flex bg-emerald-50 text-emerald-800 text-[9px] font-bold uppercase px-2 py-0.5 rounded-full">Activo</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-md">
                    Protege tu cuenta exigiendo un código OTP dinámico antes de cada retiro o transferencia inusual.
                  </p>
                </div>
                
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={twoFactor}
                    onChange={(e) => setTwoFactor(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-3">Auditoría de Sesión Activa</h4>
                <div className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-200 text-xs">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-mono tracking-wider">Dirección IP del Cliente</span>
                      <span className="font-semibold text-slate-700 font-mono">190.152.12.98 (Quito, Pichincha, EC)</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-mono tracking-wider">Última Conexión</span>
                      <span className="font-semibold text-slate-700 font-mono">{new Date().toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-200">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-mono tracking-wider">Canal de Encriptación</span>
                      <span className="font-semibold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> TLS 1.3 / AES-256 bits
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-mono tracking-wider">Firma Digital del Dispositivo</span>
                      <span className="font-semibold text-slate-700 font-mono">B77A-90D1-FE3C</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
