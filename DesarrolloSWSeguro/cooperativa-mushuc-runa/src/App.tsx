/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BankProvider, useBank } from './infrastructure/context/BankContext';
import { RoleSelector } from './components/RoleSelector';
import { ClienteDashboard } from './components/ClienteDashboard';
import { CajeroDashboard } from './components/CajeroDashboard';
import { AuditorDashboard } from './components/AuditorDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { 
  ShieldCheck, 
  Layers, 
  Landmark, 
  User, 
  Eye, 
  Settings, 
  Bell, 
  Terminal, 
  Network,
  LogOut
} from 'lucide-react';
import { motion } from 'motion/react';

function DashboardShell() {
  const { activeRole, switchRole, currentUser } = useBank();

  // Get current date formatted for header
  const currentDateStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Sidebar - Geometric Balance Theme */}
      <aside className="w-64 bg-slate-900 flex flex-col shadow-xl shrink-0 h-full border-r border-slate-800">
        {/* Brand Logo Header */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-500/20 text-lg font-mono">
              MR
            </div>
            <div>
              <h1 className="text-white font-bold leading-none tracking-tight text-sm">Mushuc Runa</h1>
              <p className="text-[10px] text-emerald-400 uppercase tracking-widest mt-1 font-mono">Cooperativa A&C</p>
            </div>
          </div>
        </div>

        {/* Sidebar Navigation & Role Selectors */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <div className="text-[10px] uppercase text-slate-500 font-bold px-3 py-2 tracking-wider font-mono">
            Simulador de Roles
          </div>

          {[
            { id: 'CLIENTE', label: 'Cliente', icon: <User className="w-4 h-4" />, desc: 'Luis Chango / Cuentas' },
            { id: 'CAJERO', label: 'Cajero', icon: <Landmark className="w-4 h-4" />, desc: 'Ventanilla / Depósitos' },
            { id: 'AUDITOR', label: 'Auditor', icon: <Eye className="w-4 h-4" />, desc: 'Audit Trail / AML' },
            { id: 'ADMIN', label: 'Administrador', icon: <Settings className="w-4 h-4" />, desc: 'Reglas / Empleados' }
          ].map((cfg) => {
            const isSelected = activeRole === cfg.id;
            return (
              <button
                key={cfg.id}
                onClick={() => switchRole(cfg.id as any)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left cursor-pointer border-l-2 ${
                  isSelected
                    ? 'bg-emerald-600/10 text-emerald-400 border-emerald-500 font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 border-transparent'
                }`}
              >
                <div className={`p-1.5 rounded-md transition-colors ${isSelected ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-500'}`}>
                  {cfg.icon}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-xs font-semibold">{cfg.label}</p>
                  <p className="text-[9px] text-slate-500 font-mono leading-none mt-0.5 truncate">{cfg.desc}</p>
                </div>
              </button>
            );
          })}

          <div className="pt-6 border-t border-slate-800/40 mt-4">
            <div className="text-[10px] uppercase text-slate-500 font-bold px-3 py-2 tracking-wider font-mono">
              Banca Segura
            </div>
            <div className="px-3 py-2 space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                <span>TLS 1.3 SECURE-V2</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                <span>AES-256 CODESAN</span>
              </div>
            </div>
          </div>
        </nav>

        {/* User Info / Simulator operator at the bottom */}
        <div className="p-4 bg-slate-950 border-t border-slate-800/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-200 uppercase font-mono">
              {activeRole.substring(0, 2)}
            </div>
            <div className="flex-1 overflow-hidden text-left">
              <p className="text-xs font-semibold text-white truncate">
                {activeRole === 'CLIENTE' ? (currentUser?.name || 'Luis Chango') : 
                 activeRole === 'CAJERO' ? 'Cajero Sucursal' : 
                 activeRole === 'AUDITOR' ? 'Auditor PLD' : 'Administrador Core'}
              </p>
              <p className="text-[9px] text-slate-500 font-mono tracking-tight uppercase">Rol: {activeRole}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden h-full">
        {/* Header - Geometric Balance Theme */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-sm font-medium">Mushuc Runa</span>
            <span className="text-slate-300 font-mono">/</span>
            <span className="text-slate-900 font-bold text-sm tracking-tight">
              {activeRole === 'CLIENTE' && 'Resumen de Cuentas Cliente'}
              {activeRole === 'CAJERO' && 'Ventanilla de Transacciones Cajero'}
              {activeRole === 'AUDITOR' && 'Auditoría & Cumplimiento PLD'}
              {activeRole === 'ADMIN' && 'Configuración Core & Empleados'}
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:block text-right">
              <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider font-mono">Último Acceso Core</p>
              <p className="text-xs text-slate-700 font-mono font-medium">{currentDateStr}</p>
            </div>
            
            {/* Status light */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-full px-3 py-1 text-[10px] font-semibold text-slate-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-mono">ONLINE</span>
            </div>

            {/* Notification icon */}
            <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 relative cursor-pointer hover:bg-slate-50 transition-colors">
              <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              <Bell className="w-4 h-4" />
            </div>
          </div>
        </header>

        {/* Scrollable Workspace */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 bg-slate-50/60">
          {/* Top banner highlighting simulation context */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-6 relative overflow-hidden shadow-lg border border-slate-800">
            {/* Subtle design gradient highlight */}
            <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-400 font-bold tracking-tight text-[10px] uppercase font-mono">Chango &amp; Asociados</span>
                  <span className="h-1 w-1 bg-slate-600 rounded-full"></span>
                  <span className="text-amber-400 font-bold tracking-tight text-[10px] uppercase font-mono">Fintech Core-V2</span>
                </div>
                <h2 className="text-xl font-black tracking-tight text-white mt-1">
                  COOPERATIVA MUSHUC RUNA LTDA.
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  Simulador de Segregación de Funciones &bull; Clean Architecture Sandbox
                </p>
              </div>

              <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-full px-4 py-1.5 text-xs text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="font-mono">Ambiente Seguro Conectado</span>
              </div>
            </div>
          </div>

          {/* Role Selector Dashboard with terminal logs and information */}
          <RoleSelector />

          {/* Active View Container with smooth transition */}
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

        {/* Footer - Ticker Info bar */}
        <footer className="h-10 bg-white border-t border-slate-200 flex items-center px-8 text-[10px] text-slate-400 justify-between font-mono uppercase tracking-widest shrink-0">
          <div>Cooperativa de Ahorro y Crédito Mushuc Runa Ltda. &copy; {new Date().getFullYear()}</div>
          <div className="hidden sm:flex gap-4">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> 
              Sistema Operativo Activo
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> 
              Clean Architecture SOLID
            </span>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BankProvider>
      <DashboardShell />
    </BankProvider>
  );
}

