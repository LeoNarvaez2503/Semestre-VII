/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import { BankProvider, DEMO_PASSWORD, useBank } from './infrastructure/context/BankContext';
import { RoleSelector } from './components/RoleSelector';
import { ClienteDashboard } from './components/ClienteDashboard';
import { CajeroDashboard } from './components/CajeroDashboard';
import { AuditorDashboard } from './components/AuditorDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Eye,
  KeyRound,
  Landmark,
  Loader2,
  LogIn,
  LogOut,
  Settings,
  ShieldCheck,
  User,
} from 'lucide-react';
import { motion } from 'motion/react';
import { UserRole } from './domain/entities';

const roleMeta: Record<UserRole, { label: string; desc: string; icon: React.ReactNode; dashboard: string }> = {
  CLIENTE: {
    label: 'Cliente',
    desc: 'Cuentas propias, transferencias y retiros OTP',
    icon: <User className="w-4 h-4" />,
    dashboard: 'Resumen de Cuentas Cliente',
  },
  CAJERO: {
    label: 'Cajero',
    desc: 'Ventanilla, busqueda y transacciones presenciales',
    icon: <Landmark className="w-4 h-4" />,
    dashboard: 'Ventanilla de Transacciones Cajero',
  },
  AUDITOR: {
    label: 'Auditor',
    desc: 'Audit trail, PLAFT y bloqueo de cuentas',
    icon: <Eye className="w-4 h-4" />,
    dashboard: 'Auditoria y Cumplimiento PLD',
  },
  ADMIN: {
    label: 'Administrador',
    desc: 'Empleados, reglas y parametros del core',
    icon: <Settings className="w-4 h-4" />,
    dashboard: 'Configuracion Core y Empleados',
  },
};

function OperationStatusPanel() {
  const { operation } = useBank();

  if (!operation) return null;

  const isDone = operation.status === 'success';
  const isError = operation.status === 'error';

  return (
    <div className="fixed right-5 bottom-5 z-50 w-[min(360px,calc(100vw-2rem))] rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-900/15">
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 rounded-xl p-2 ${isError ? 'bg-red-50 text-red-700' : isDone ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-900 text-white'}`}>
          {isError ? <AlertTriangle className="h-4 w-4" /> : isDone ? <CheckCircle2 className="h-4 w-4" /> : <Loader2 className="h-4 w-4 animate-spin" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-slate-900">{operation.title}</p>
          <div className="mt-3 space-y-2">
            {operation.steps.map((step, index) => {
              const completed = index <= operation.currentStep && !isError;
              const active = index === operation.currentStep && operation.status === 'running';
              return (
                <div key={step} className="flex items-center gap-2 text-[11px] font-semibold">
                  <span className={`h-2 w-2 rounded-full ${completed ? 'bg-emerald-500' : isError && index === operation.currentStep ? 'bg-red-500' : active ? 'bg-slate-900' : 'bg-slate-200'}`} />
                  <span className={completed || active ? 'text-slate-800' : 'text-slate-400'}>{step}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginScreen() {
  const { allUsers, errorMsg, login, operation } = useBank();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState(DEMO_PASSWORD);

  const demoUsers = useMemo(
    () => allUsers.filter(user => user.status === 'ACTIVE'),
    [allUsers]
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await login(identifier, password).catch(() => undefined);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 lg:grid-cols-2">
        <section className="flex flex-col justify-between bg-[linear-gradient(135deg,#0f172a_0%,#14532d_100%)] p-8 sm:p-12">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500 text-lg font-black shadow-lg shadow-emerald-950/30">
              MR
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight">Mushuc Runa</h1>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-emerald-200">Banca por roles</p>
            </div>
          </div>

          <div className="max-w-xl py-16">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-white/10 px-3 py-1 text-xs font-bold text-emerald-100">
              <ShieldCheck className="h-4 w-4" />
              Simulacion local sin backend
            </div>
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">Acceso restringido por usuario y rol.</h2>
            <p className="mt-5 max-w-lg text-sm leading-7 text-slate-200">
              Cada inicio de sesion activa un unico perfil operativo. La interfaz oculta funciones ajenas al rol y la capa de contexto vuelve a validar cada accion antes de modificar datos locales.
            </p>
          </div>

          <div className="grid gap-3 text-xs text-slate-200 sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/10 p-4">
              <p className="font-bold text-white">Cliente</p>
              <p className="mt-1 text-slate-300">Solo cuentas propias.</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/10 p-4">
              <p className="font-bold text-white">Operativo</p>
              <p className="mt-1 text-slate-300">Caja o auditoria, no ambos.</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/10 p-4">
              <p className="font-bold text-white">Admin</p>
              <p className="mt-1 text-slate-300">Reglas y personal, sin saldos.</p>
            </div>
          </div>
        </section>

        <main className="flex items-center justify-center bg-slate-50 p-6 text-slate-900 sm:p-10">
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/10 sm:p-8">
            <div className="mb-6">
              <div className="mb-2 flex items-center gap-2 text-emerald-700">
                <KeyRound className="h-5 w-5" />
                <p className="text-xs font-black uppercase tracking-widest">Inicio de sesion</p>
              </div>
              <h2 className="text-2xl font-black tracking-tight text-slate-950">Seleccione un usuario demo</h2>
              <p className="mt-2 text-sm text-slate-500">Clave unica para pruebas: <strong>{DEMO_PASSWORD}</strong></p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Correo o cedula</label>
                <input
                  value={identifier}
                  onChange={(event) => setIdentifier(event.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold outline-none transition focus:border-emerald-600 focus:bg-white"
                  placeholder="anthony...@gmail.com o 1804294812"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Clave</label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold outline-none transition focus:border-emerald-600 focus:bg-white"
                />
              </div>

              {errorMsg && (
                <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-800">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={operation?.status === 'running'}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-black uppercase tracking-wider text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {operation?.status === 'running' ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
                Entrar al sistema
              </button>
            </form>

            <div className="mt-6 grid gap-2">
              {demoUsers.map(user => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => {
                    setIdentifier(user.email);
                    setPassword(DEMO_PASSWORD);
                  }}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-left transition hover:border-emerald-500 hover:bg-emerald-50/40"
                >
                  <div>
                    <p className="text-sm font-bold text-slate-800">{user.name}</p>
                    <p className="text-[11px] font-mono text-slate-400">{user.email}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black text-slate-600">{user.role}</span>
                </button>
              ))}
            </div>
          </div>
        </main>
      </div>
      <OperationStatusPanel />
    </div>
  );
}

function DashboardShell() {
  const { activeRole, currentUser, logout, switchRole } = useBank();
  const currentDateStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 font-sans text-slate-900">
      <aside className="flex h-full w-72 shrink-0 flex-col border-r border-slate-800 bg-slate-950 shadow-xl">
        <div className="border-b border-slate-800 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500 text-lg font-bold text-white shadow-lg shadow-emerald-500/20">
              MR
            </div>
            <div>
              <h1 className="text-sm font-bold leading-none tracking-tight text-white">Mushuc Runa</h1>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-emerald-400">Acceso por rol</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto p-4">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Permisos de sesion
          </div>

          {[activeRole].map(role => {
            const cfg = roleMeta[role];
            const isSelected = true;

            return (
              <button
                key={role}
                onClick={() => switchRole(role)}
                className={`w-full rounded-lg border-l-2 px-3 py-3 text-left transition ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                    : 'border-transparent text-slate-300 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`rounded-md p-1.5 ${isSelected ? 'bg-emerald-500/20' : 'bg-slate-900'}`}>
                    {cfg.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold">{cfg.label}</p>
                    <p className="mt-0.5 truncate text-[9px] font-mono text-slate-500">{cfg.desc}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-slate-800 bg-slate-950 p-4">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-xs font-black uppercase text-slate-200">
              {activeRole.substring(0, 2)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-white">{currentUser?.name}</p>
              <p className="text-[9px] font-mono uppercase tracking-tight text-slate-500">Rol: {activeRole}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-800 px-3 py-2 text-xs font-bold text-slate-300 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-200"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesion
          </button>
        </div>
      </aside>

      <main className="flex h-full flex-1 flex-col overflow-hidden">
        <header className="z-10 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-8 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-400">Mushuc Runa</span>
            <span className="font-mono text-slate-300">/</span>
            <span className="text-sm font-bold tracking-tight text-slate-900">{roleMeta[activeRole].dashboard}</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden text-right sm:block">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Ultimo acceso simulado</p>
              <p className="font-mono text-xs font-medium text-slate-700">{currentDateStr}</p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-slate-100 bg-slate-50 px-3 py-1 text-[10px] font-semibold text-slate-600">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              <span className="font-mono">ONLINE</span>
            </div>
            <div className="relative flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500">
              <span className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full border-2 border-white bg-red-500" />
              <Bell className="h-4 w-4" />
            </div>
          </div>
        </header>

        <div className="flex-1 space-y-8 overflow-y-auto bg-slate-50/60 p-6 sm:p-8">
          <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-6 text-white shadow-lg">
            <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl" />
            <div className="relative z-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-tight text-emerald-400">Sesion autenticada</span>
                  <span className="h-1 w-1 rounded-full bg-slate-600" />
                  <span className="text-[10px] font-bold uppercase tracking-tight text-amber-400">Sin backend</span>
                </div>
                <h2 className="mt-1 text-xl font-black tracking-tight text-white">COOPERATIVA MUSHUC RUNA LTDA.</h2>
                <p className="mt-0.5 text-xs text-slate-300">El rol activo viene del usuario logueado y cada accion se valida antes de simularse.</p>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800 px-4 py-1.5 text-xs text-emerald-300">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span className="font-mono">{currentUser?.email}</span>
              </div>
            </div>
          </div>

          <RoleSelector />

          <div className="border-t border-slate-200/60 pt-2">
            <motion.div
              key={activeRole}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              {activeRole === 'CLIENTE' && <ClienteDashboard />}
              {activeRole === 'CAJERO' && <CajeroDashboard />}
              {activeRole === 'AUDITOR' && <AuditorDashboard />}
              {activeRole === 'ADMIN' && <AdminDashboard />}
            </motion.div>
          </div>
        </div>

        <footer className="flex h-10 shrink-0 items-center justify-between border-t border-slate-200 bg-white px-8 text-[10px] uppercase tracking-widest text-slate-400">
          <div>Cooperativa de Ahorro y Credito Mushuc Runa Ltda. &copy; {new Date().getFullYear()}</div>
          <div className="hidden gap-4 sm:flex">
            <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Sesion activa</span>
            <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-blue-500" /> Permisos simulados</span>
          </div>
        </footer>
      </main>

      <OperationStatusPanel />
    </div>
  );
}

function AppContent() {
  const { currentUser, isLoading } = useBank();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <Loader2 className="mr-3 h-5 w-5 animate-spin" />
        Cargando simulador bancario...
      </div>
    );
  }

  return currentUser ? <DashboardShell /> : <LoginScreen />;
}

export default function App() {
  return (
    <BankProvider>
      <AppContent />
    </BankProvider>
  );
}
