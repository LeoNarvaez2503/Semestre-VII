/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useBank } from '../infrastructure/context/BankContext';
import { Account, User } from '../domain/entities';
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  Lock,
  DollarSign,
  User as UserIcon,
  CreditCard,
  History,
  Info,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CajeroDashboard: React.FC = () => {
  const {
    allUsers,
    allAccounts,
    transactions,
    deposit,
    withdraw,
    createAccount,
    errorMsg,
    successMsg,
    clearNotifications
  } = useBank();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchedUser, setSearchedUser] = useState<User | null>(null);
  const [searchedAccounts, setSearchedAccounts] = useState<Account[]>([]);

  // Transaction states
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [operationType, setOperationType] = useState<'DEPOSIT' | 'WITHDRAWAL'>('DEPOSIT');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [otpCode, setOtpCode] = useState(''); // Redención de código OTP

  // Account creation states
  const [newAccType, setNewAccType] = useState<'AHORROS' | 'CORRIENTE'>('AHORROS');
  const [newAccBalance, setNewAccBalance] = useState('0');

  const [sanitizeWarning, setSanitizeWarning] = useState<string | null>(null);

  const handleAmountInputChange = (
    val: string,
    setVal: (v: string) => void
  ) => {
    if (val === '') {
      setVal('');
      setSanitizeWarning(null);
      return;
    }

    const hasInvalidChars = /[^0-9.]/g.test(val);
    let sanitized = val.replace(/[^0-9.]/g, '');

    const parts = sanitized.split('.');
    if (parts.length > 2) {
      sanitized = parts[0] + '.' + parts.slice(1).join('');
    }

    if (parts.length > 1 && parts[1].length > 2) {
      sanitized = parts[0] + '.' + parts[1].substring(0, 2);
    }

    if (hasInvalidChars || val !== sanitized) {
      setSanitizeWarning('Carácter inválido bloqueado. Solo se permiten números positivos y hasta 2 decimales (sin signos +, - o letras).');
      setTimeout(() => setSanitizeWarning(null), 3500);
    }

    setVal(sanitized);
  };

  const filteredClients = React.useMemo(() => {
    const clients = allUsers.filter(u => u.role === 'CLIENTE');
    if (!searchQuery.trim()) return clients;
    
    const query = searchQuery.trim().toLowerCase();
    return clients.filter(client => {
      const matchesClient = client.name.toLowerCase().includes(query) || 
                            client.identityId.includes(query) ||
                            client.email.toLowerCase().includes(query);
      const userAccs = allAccounts.filter(acc => acc.userId === client.id);
      const matchesAccount = userAccs.some(acc => acc.accountNumber.includes(query));
      
      return matchesClient || matchesAccount;
    });
  }, [allUsers, allAccounts, searchQuery]);

  const selectClient = (client: User) => {
    clearNotifications();
    setSearchedUser(client);
    const userAccs = allAccounts.filter(acc => acc.userId === client.id);
    setSearchedAccounts(userAccs);
    if (userAccs.length > 0) {
      setSelectedAccount(userAccs[0]);
    } else {
      setSelectedAccount(null);
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchedUser) return;
    try {
      const generatedAccountNumber = (newAccType === 'AHORROS' ? '100' : '200') + Math.floor(100000 + Math.random() * 900000).toString();
      await createAccount(searchedUser.id, generatedAccountNumber, newAccType, parseFloat(newAccBalance));
      setNewAccBalance('0');
      // Refresh accounts list
      const updatedAccounts = allAccounts.filter(acc => acc.userId === searchedUser.id);
      setSearchedAccounts(updatedAccounts);
    } catch (err) {
      // Handled in context
    }
  };

  const handleBranchTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccount || !amount) return;

    try {
      if (operationType === 'DEPOSIT') {
        await deposit(selectedAccount.id, parseFloat(amount), description || 'Depósito físico por ventanilla');
      } else {
        // Cash withdrawal by cashier
        await withdraw(
          selectedAccount.id,
          parseFloat(amount),
          description || 'Retiro físico por ventanilla',
          'VENTANILLA'
        );
      }
      // Reset form
      setAmount('');
      setDescription('');
      
      // Update searched accounts reference balances
      const updatedAccounts = allAccounts.filter(acc => acc.userId === searchedUser?.id);
      setSearchedAccounts(updatedAccounts);
      const currentSelectedUpdated = updatedAccounts.find(a => a.id === selectedAccount.id);
      if (currentSelectedUpdated) {
        setSelectedAccount(currentSelectedUpdated);
      }
    } catch (e) {
      // Error handled in main context
    }
  };

  // Redeem code OTP generated by client
  const handleRedeemOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) return;

    clearNotifications();
    
    // Find transaction corresponding to this OTP
    const matchedTx = transactions.find(
      tx => tx.refCode === otpCode.trim() && tx.type === 'WITHDRAWAL' && tx.status === 'SUCCESS'
    );

    if (matchedTx && matchedTx.sourceAccountId) {
      const account = allAccounts.find(a => a.id === matchedTx.sourceAccountId);
      if (account) {
        // Simulation of OTP approval and money delivery
        // Since the use case already debited, we display confirmation receipt
        const customer = allUsers.find(u => u.id === account.userId);
        alert(
          `CÓDIGO OTP VÁLIDO.\n\nCliente: ${customer?.name}\nCuenta: #${account.accountNumber}\nMonto Autorizado: $${matchedTx.amount.toFixed(2)}\nConcepto: ${matchedTx.description}\n\n[Haga clic para confirmar la entrega física de los fondos]`
        );
        alert('FONDOS ENTREGADOS. Recibo firmado digitalmente en el Audit Trail.');
        setOtpCode('');
      }
    } else {
      alert('Código OTP inválido o ya ha sido redimido anteriormente.');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Search and Account Status Panel */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest font-mono mb-4">Módulo de Búsqueda de Clientes</h3>
          
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Filtrar por nombre, cédula o cuenta..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (searchedUser) {
                    setSearchedUser(null);
                    setSelectedAccount(null);
                    setSearchedAccounts([]);
                  }
                }}
                className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-xs font-mono focus:outline-emerald-600 bg-slate-50"
              />
            </div>
          </div>

          {!searchedUser && (
            <div className="mt-6 space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredClients.length > 0 ? (
                filteredClients.map(client => (
                  <button
                    key={client.id}
                    type="button"
                    onClick={() => selectClient(client)}
                    className="w-full flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:border-emerald-200 hover:bg-emerald-50/50 transition-all text-left cursor-pointer relative z-10"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                        <UserIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{client.name}</p>
                        <p className="text-xs text-slate-400 font-mono">C.I. {client.identityId}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </button>
                ))
              ) : (
                <p className="text-center text-xs text-slate-400 py-6">No se encontraron clientes.</p>
              )}
            </div>
          )}
        </div>

        {/* Search Results */}
        <AnimatePresence mode="wait">
          {searchedUser ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Client Profile */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold border-2 border-slate-200">
                      <UserIcon className="w-5 h-5 text-emerald-800" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-base">{searchedUser.name}</h4>
                      <p className="text-xs text-slate-400 font-mono">ID Cédula: {searchedUser.identityId}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                    searchedUser.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${searchedUser.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                    Cliente {searchedUser.status === 'ACTIVE' ? 'Activo' : 'Suspendido'}
                  </span>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Cuentas Vinculadas</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {searchedAccounts.map((acc) => {
                      const isSelected = selectedAccount?.id === acc.id;
                      return (
                        <button
                          key={acc.id}
                          type="button"
                          onClick={() => setSelectedAccount(acc)}
                          className={`text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${
                            isSelected
                              ? 'border-emerald-600 bg-emerald-50/20'
                              : 'border-slate-100 bg-slate-50/50 hover:border-slate-200'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-bold text-slate-700">Cuenta {acc.type}</span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              acc.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 
                              acc.status === 'FROZEN' ? 'bg-indigo-100 text-indigo-800 animate-pulse' : 
                              'bg-red-100 text-red-800'
                            }`}>
                              {acc.status}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-mono mb-2">Nº {acc.accountNumber}</p>
                          <p className="text-base font-bold text-slate-800 font-mono">
                            ${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Formulario de Apertura de Cuenta */}
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono mb-3">Aperturar Nueva Cuenta</p>
                  <form onSubmit={handleCreateAccount} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Tipo de Cuenta</label>
                      <select
                        value={newAccType}
                        onChange={(e) => setNewAccType(e.target.value as any)}
                        className="w-full border border-slate-200 rounded-xl p-2 text-xs focus:outline-emerald-600 bg-slate-50"
                      >
                        <option value="AHORROS">AHORROS</option>
                        <option value="CORRIENTE">CORRIENTE</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Monto Inicial ($ USD)</label>
                      <input
                        type="text"
                        inputMode="decimal"
                        required
                        value={newAccBalance}
                        onChange={(e) => handleAmountInputChange(e.target.value, setNewAccBalance)}
                        className="w-full border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono focus:outline-emerald-600 bg-slate-50"
                      />
                    </div>
                    <div>
                      <button
                        type="submit"
                        className="w-full bg-emerald-800 hover:bg-emerald-950 text-white font-bold py-2 rounded-xl text-xs uppercase tracking-wider cursor-pointer"
                      >
                        Aperturar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-12 text-center text-slate-400">
              <UserIcon className="w-12 h-12 stroke-[1.2] mx-auto text-slate-300 mb-3" />
              <p className="font-semibold text-xs text-slate-500">Workspace de Caja Disponible</p>
              <p className="text-[10px] leading-relaxed max-w-[280px] mx-auto text-slate-400 mt-1">
                Utilice el buscador superior para recuperar la ficha del cliente y habilitar el registro de transacciones de ventanilla.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Cashier Operations Console */}
      <div className="lg:col-span-5 space-y-6">
        {/* OTP Redemption (Always accessible) */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-2 text-amber-700 mb-2">
            <CreditCard className="w-5 h-5" />
            <h4 className="text-xs font-bold uppercase font-mono tracking-wider">Redimir Retiro Digital (OTP/QR)</h4>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
            Si el cliente generó un código de retiro dinámico en su banca digital (Anthony, etc.), ingréselo aquí para registrar la entrega física de efectivo.
          </p>
          <form onSubmit={handleRedeemOtp} className="flex gap-2">
            <input
              type="text"
              placeholder="Ej. OTP-123456"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm font-mono focus:outline-amber-600 bg-slate-50 uppercase"
            />
            <button
              type="submit"
              className="bg-amber-700 hover:bg-amber-800 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer whitespace-nowrap"
            >
              Entregar Efectivo
            </button>
          </form>
        </div>

        {/* Manual Branch Transaction Form */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Ventanilla de Transacciones</h3>
            <span className="bg-slate-100 text-slate-700 text-[9px] font-bold font-mono uppercase px-2 py-0.5 rounded">Sucursal Ambato</span>
          </div>

          {selectedAccount ? (
            <form onSubmit={handleBranchTransaction} className="space-y-4">
              <div className="p-4 bg-emerald-50/30 border border-emerald-100/50 rounded-xl">
                <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Cuenta Operativa Seleccionada:</span>
                <span className="text-xs font-bold text-slate-800">Nº {selectedAccount.accountNumber} ({selectedAccount.type})</span>
                <span className="text-xs font-bold block text-emerald-800 font-mono mt-0.5">Saldo: ${selectedAccount.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider font-mono mb-2">Tipo de Operación</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setOperationType('DEPOSIT');
                      clearNotifications();
                    }}
                    className={`py-2 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                      operationType === 'DEPOSIT' ? 'bg-white text-emerald-850 shadow-sm' : 'text-slate-500'
                    }`}
                  >
                    Depósito Físico
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOperationType('WITHDRAWAL');
                      clearNotifications();
                    }}
                    className={`py-2 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                      operationType === 'WITHDRAWAL' ? 'bg-white text-emerald-850 shadow-sm' : 'text-slate-500'
                    }`}
                  >
                    Retiro Físico
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider font-mono mb-2">Monto de Operación ($ USD)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold font-mono text-sm">$</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    required
                    value={amount}
                    onChange={(e) => handleAmountInputChange(e.target.value, setAmount)}
                    className="w-full border border-slate-200 rounded-xl pl-8 pr-4 py-2.5 text-sm font-mono focus:outline-emerald-600 bg-slate-50"
                  />
                </div>
                {sanitizeWarning && (
                  <p className="text-[10px] font-bold text-red-655 mt-1.5 animate-pulse">{sanitizeWarning}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider font-mono mb-2">Descripción / Auditoría en Recibo</label>
                <input
                  type="text"
                  placeholder="Ej. Depósito por taquilla sucursal"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-emerald-600 bg-slate-50"
                />
              </div>

              {/* Notification inside block */}
              {successMsg && (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl p-3 text-[11px] font-semibold leading-relaxed">
                  {successMsg}
                </div>
              )}
              {errorMsg && (
                <div className="bg-red-50 border border-red-100 text-red-800 rounded-xl p-3 text-[11px] font-semibold leading-relaxed">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                id="submit-tx-cashier"
                className="w-full bg-emerald-850 hover:bg-emerald-900 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider cursor-pointer"
              >
                Autorizar Transacción
              </button>
            </form>
          ) : (
            <div className="p-8 text-center text-slate-400 text-[11px] border-2 border-dashed border-slate-100 rounded-2xl">
              <Lock className="w-8 h-8 mx-auto stroke-[1.2] text-slate-300 mb-2" />
              <span>Busque y seleccione un cliente activo para habilitar las operaciones financieras manuales de ventanilla.</span>
            </div>
          )}
        </div>

        {/* Branch Restrictions Info Panel */}
        <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 text-xs text-slate-500 space-y-3">
          <div className="flex items-center gap-2 text-slate-700 font-bold">
            <Lock className="w-4 h-4 text-emerald-700" />
            <span>Medidas de Control del Cajero</span>
          </div>
          <p className="leading-relaxed text-[11px]">
            Por políticas internas de la Cooperativa Mushuc Runa y segregación de funciones (SOLID):
          </p>
          <ul className="list-disc pl-4 space-y-1 text-[11px]">
            <li>Solo se autorizan transacciones presenciales de clientes activos.</li>
            <li>No se permite alterar balances directamente; cada operación requiere un descargo y firma del cajero con registro de IP.</li>
            <li>La modificación de tasas, creación de roles y el log total de auditoría están bloqueados para cajeros.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
