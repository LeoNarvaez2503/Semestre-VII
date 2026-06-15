/**
 * SlideBlock4 — Infraestructura DeFi: Oráculos y Flash Loans
 * Fuentes: Flash Loans.txt, conceptos Chainlink
 * Expositor 4
 */

import React, { useState } from 'react';

const STEPS = [
  {
    id: 1,
    phase: 'INICIO',
    color: 'cyan',
    title: 'Pool.flashLoan() invocado',
    desc: 'El contrato solicita 1,000,000 USDC al Pool de Aave. Inicio de la transacción atómica.',
    state: 'balanceInicial = 1,000,000 USDC',
  },
  {
    id: 2,
    phase: 'TRANSFER',
    color: 'primary',
    title: 'Pool transfiere fondos al receptor',
    desc: 'Aave transfiere los fondos al contrato receptor. El estado del pool se actualiza temporalmente.',
    state: 'receiver.balance = 1,000,000 USDC',
  },
  {
    id: 3,
    phase: 'EXECUTE',
    color: 'amber',
    title: 'executeOperation() — Lógica DeFi',
    desc: 'Arbitraje, liquidación, swap, o cualquier operación DeFi. El contrato ejecuta su estrategia.',
    state: 'Operación arbitraria en ejecución...',
  },
  {
    id: 4,
    phase: 'CHECK',
    color: 'purple',
    title: 'Verificación de saldo + fee',
    desc: 'El Pool verifica que el receptor haya dado allowance de (capital + fee). El chequeo es inmutable.',
    state: 'require(balanceFinal >= balanceInicial + fee)',
  },
  {
    id: 5,
    phase: 'REVERT / OK',
    color: 'green',
    title: '✅ OK: Estado confirmado ó 💥 REVERT',
    desc: 'Si el chequeo falla → REVERT: rollback total. Si pasa → estado confirmado en la blockchain.',
    state: 'Si balance < requerido → rollback total del estado EVM',
  },
];

export default function SlideBlock4() {
  const [activeStep, setActiveStep] = useState(null);
  const [reverted, setReverted] = useState(false);

  const simulateRevert = () => {
    setReverted(false);
    setActiveStep(null);
    let step = 1;
    const interval = setInterval(() => {
      setActiveStep(step);
      step++;
      if (step > 5) {
        clearInterval(interval);
        setTimeout(() => setReverted(true), 400);
      }
    }, 600);
  };

  return (
    <section id="bloque-4" className="slide slide-anchor">
      {/* ---- Header ---- */}
      <div className="slide-header">
        <div className="slide-number">
          <div className="slide-number-badge">04</div>
          <span className="slide-presenter">Expositor 4</span>
        </div>
        <div className="slide-title-group">
          <p className="slide-eyebrow">Middleware e Infraestructura crítica de DeFi</p>
          <h2 className="slide-title">Oráculos & Flash Loans: Transacciones Atómicas</h2>
          <p className="slide-subtitle">
            Los oráculos como middleware indispensable, y los Flash Loans como prueba de que la atomicidad
            de la EVM permite primitivas financieras sin análogo en finanzas tradicionales.
          </p>
        </div>
        <div className="flex gap-sm" style={{ flexShrink: 0 }}>
          <span className="badge badge-purple">Aave V3</span>
          <span className="badge badge-amber">Chainlink</span>
        </div>
      </div>

      {/* ---- Main Grid ---- */}
      <div className="content-grid content-grid-2">
        {/* Left: Oracles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          <div className="card card-glow">
            <div className="card-header">
              <span className="card-icon">🔮</span>
              <span className="card-title">Oráculos — Middleware de Datos Off-Chain</span>
            </div>
            <p className="card-body mb-md">
              Los contratos inteligentes DeFi son <strong className="text-primary">deterministas y aislados</strong>;
              no pueden consultar Internet. Los oráculos son el puente arquitectónico que inyecta
              precios reales de mercado en la EVM.
            </p>

            {/* Oracle Architecture Flow */}
            <div style={{ background: 'var(--bg-void)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)', marginBottom: '12px' }}>
              <div className="section-label mb-md">Arquitectura Chainlink (Decentralized Oracle Network)</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {/* Layer 1: Data Sources */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
                  {['CEX A (Binance)', 'CEX B (Coinbase)', 'DEX / Uniswap'].map((s, i) => (
                    <div key={i} style={{
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '6px',
                      textAlign: 'center',
                      fontSize: '0.68rem',
                      color: 'var(--text-muted)',
                    }}>{s}</div>
                  ))}
                </div>
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem' }}>↓ precios off-chain</div>

                {/* Layer 2: Oracle Nodes */}
                <div style={{
                  background: 'rgba(251,191,36,0.06)',
                  border: '1px solid rgba(251,191,36,0.25)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px',
                  textAlign: 'center',
                }}>
                  <span className="badge badge-amber" style={{ marginBottom: '4px', display: 'inline-flex' }}>
                    Chainlink Oracle Network (21+ nodos)
                  </span>
                  <div className="text-xs text-secondary" style={{ marginTop: '4px' }}>
                    Cada nodo firma su respuesta on-chain → mediana ponderada → feed price
                  </div>
                </div>
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem' }}>↓ latestRoundData()</div>

                {/* Layer 3: OSM (Maker) */}
                <div style={{
                  background: 'rgba(99,130,255,0.06)',
                  border: '1px solid rgba(99,130,255,0.25)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px',
                  textAlign: 'center',
                }}>
                  <span className="badge badge-blue" style={{ marginBottom: '4px', display: 'inline-flex' }}>
                    Oracle Security Module (Maker) — 1h delay
                  </span>
                  <div className="text-xs text-secondary" style={{ marginTop: '4px' }}>
                    Buffer de seguridad: un precio comprometido puede detectarse antes de afectar los Vaults
                  </div>
                </div>
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem' }}>↓ Spot.poke()</div>

                {/* Layer 4: DeFi Protocols */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
                  {[
                    { name: 'Maker Vat', c: 'blue', action: 'liquidación' },
                    { name: 'Aave Pool', c: 'purple', action: 'LTV check' },
                    { name: 'Compound', c: 'green', action: 'collateral check' },
                  ].map((p, i) => (
                    <div key={i} style={{
                      border: `1px solid rgba(${p.c === 'blue' ? '99,130,255' : p.c === 'purple' ? '167,139,250' : '52,211,153'},0.35)`,
                      borderRadius: 'var(--radius-sm)',
                      padding: '6px',
                      textAlign: 'center',
                      fontSize: '0.68rem',
                      color: 'var(--text-secondary)',
                    }}>
                      <strong>{p.name}</strong><br />{p.action}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* TWAP vs Spot */}
            <div className="card-header mt-md">
              <span className="card-icon">📈</span>
              <span className="card-title">Tipos de Oracle en DeFi</span>
            </div>
            <table className="defi-table">
              <thead>
                <tr><th>Tipo</th><th>Fuente</th><th>Uso DeFi</th><th>Vulnerabilidad</th></tr>
              </thead>
              <tbody>
                <tr><td><code className="text-mono">Chainlink</code></td><td>Off-chain (DON)</td><td>Maker, Aave, Compound</td><td>Centralización de nodos</td></tr>
                <tr className="highlight-row"><td><code className="text-mono">TWAP V3</code></td><td>On-chain pool</td><td>Resistant to flash loan</td><td>Liquidez insuficiente</td></tr>
                <tr><td><code className="text-mono">Pyth Network</code></td><td>Pull oracle</td><td>Perps, Options</td><td>Latencia de publicación</td></tr>
                <tr className="danger-row"><td><code className="text-mono">Spot Price V2</code></td><td>On-chain pool</td><td>Obsoleto</td><td>Flash loan attack</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Flash Loans */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          {/* Flash Loan Interactive */}
          <div className="card card-glow">
            <div className="card-header">
              <span className="card-icon">⚡</span>
              <span className="card-title">Flash Loan — Transacción Atómica DeFi</span>
            </div>
            <p className="card-body mb-md">
              Un Flash Loan toma prestado sin colateral. Si al final de la transacción el contrato
              no devuelve <code className="text-mono text-amber">capital + fee</code>, la EVM
              ejecuta un <strong className="text-red">REVERT</strong> que hace rollback
              total del estado — como una transacción de base de datos.
            </p>

            {/* Animated flow */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
              {STEPS.map((step) => {
                const isActive = activeStep === step.id;
                const isPast = activeStep !== null && activeStep > step.id;
                const isRevert = reverted && step.id === 5;

                return (
                  <div key={step.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      padding: '10px',
                      borderRadius: 'var(--radius-md)',
                      border: `1px solid ${isActive ? `rgba(99,130,255,0.5)` : isRevert ? 'rgba(248,113,113,0.4)' : 'var(--border-subtle)'}`,
                      background: isActive ? 'rgba(99,130,255,0.08)' :
                                  isRevert ? 'rgba(248,113,113,0.08)' :
                                  isPast ? 'var(--bg-elevated)' : 'transparent',
                      transition: 'all 0.3s ease',
                      opacity: activeStep === null || isActive || isPast ? 1 : 0.4,
                    }}>
                    <div style={{
                      flexShrink: 0,
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      fontFamily: 'var(--font-mono)',
                      background: isActive ? 'rgba(99,130,255,0.2)' :
                                  isRevert ? 'rgba(248,113,113,0.2)' :
                                  isPast ? 'rgba(52,211,153,0.2)' : 'var(--bg-elevated)',
                      border: `1px solid ${isActive ? 'var(--accent-primary)' :
                                           isRevert ? 'var(--accent-red)' :
                                           isPast ? 'var(--accent-green)' : 'var(--border-subtle)'}`,
                      color: isActive ? 'var(--accent-primary)' :
                             isRevert ? 'var(--accent-red)' :
                             isPast ? 'var(--accent-green)' : 'var(--text-muted)',
                    }}>
                      {isPast && !isRevert ? '✓' : step.id}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                        <span className={`badge badge-${
                          step.color === 'primary' ? 'blue' :
                          step.color === 'cyan' ? 'cyan' :
                          step.color === 'amber' ? 'amber' :
                          step.color === 'purple' ? 'purple' : 'green'
                        }`}>{step.phase}</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                          {step.title}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{step.desc}</p>
                      {isActive && (
                        <div style={{ marginTop: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent-amber)' }}>
                          → {step.state}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {reverted && (
              <div style={{
                padding: '12px',
                background: 'rgba(248,113,113,0.1)',
                border: '1px solid rgba(248,113,113,0.4)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '12px',
              }}>
                <span className="text-mono text-sm text-red fw-bold">
                  💥 REVERT — "FL:balanceMismatch" | Rollback total del estado EVM
                </span>
                <br />
                <span className="text-xs text-secondary">
                  Como si la transacción nunca hubiera ocurrido. Gas consumido NO se devuelve al llamante.
                </span>
              </div>
            )}

            <button id="btn-simulate-flashloan" onClick={simulateRevert}
              style={{
                width: '100%',
                padding: '10px',
                background: 'rgba(99,130,255,0.1)',
                border: '1px solid var(--border-accent)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--accent-primary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}>
              ⚡ Simular Flash Loan con REVERT
            </button>
          </div>

          {/* Code: Flash Loan with REVERT */}
          <div className="card">
            <div className="card-header">
              <span className="card-icon">💻</span>
              <span className="card-title">Código — Flash Loan + Chequeo de Solvencia</span>
            </div>
            <div className="code-block">
              <div className="code-block-header">
                <div className="code-dots">
                  <div className="code-dot red" /><div className="code-dot amber" /><div className="code-dot green" />
                </div>
                <span className="code-lang">Solidity — Aave V3 Pool.sol (verificación atómica)</span>
              </div>
              <div className="code-content">
                <pre>
{`<span class="cm">// Aave V3: Pool.sol — ejecuteFlashLoan</span>
<span class="kw">function</span> <span class="fn">_executeFlashLoanSimple</span>(
  <span class="tp">address</span> receiverAddress,
  <span class="tp">address</span> asset,
  <span class="tp">uint256</span> amount,
  <span class="tp">bytes</span> <span class="kw">calldata</span> params,
  <span class="tp">uint256</span> flashLoanPremiumTotal
) <span class="kw">internal</span> {
  <span class="cm">// 1. Snapshot del balance ANTES del préstamo</span>
  <span class="tp">uint256</span> balanceInicial = IERC20(asset).<span class="fn">balanceOf</span>(address(this));
  <span class="cm">// Fee = 0.05% del monto (FLASHLOAN_PREMIUM_TOTAL)</span>
  <span class="tp">uint256</span> comision = amount.<span class="fn">percentMul</span>(flashLoanPremiumTotal);

  <span class="cm">// 2. Transferir fondos al contrato receptor</span>
  IERC20(asset).<span class="fn">safeTransfer</span>(receiverAddress, amount);

  <span class="cm">// 3. El receptor ejecuta su lógica DeFi arbitraria</span>
  <span class="kw">require</span>(
    IFlashLoanSimpleReceiver(receiverAddress).<span class="fn">executeOperation</span>(
      asset, amount, comision, msg.sender, params
    ),
    <span class="str">"FL:executionFailed"</span>
  );

  <span class="cm">// 4. ⚠️  EL CHEQUEO CRÍTICO: balance final debe cubrir</span>
  <span class="cm">//    el capital original más la comisión</span>
  <span class="tp">uint256</span> balanceFinal = IERC20(asset).<span class="fn">balanceOf</span>(address(this));

  <span class="kw">require</span>(
    balanceFinal >= balanceInicial + comision,
    <span class="red">"FL:balanceMismatch"</span> <span class="cm">// 💥 REVERT → rollback TOTAL del estado</span>
  );
  <span class="cm">// Si llega aquí: TX confirmada, fees distribuidas a LPs</span>
}`}
                </pre>
              </div>
            </div>
          </div>

          {/* Applications */}
          <div className="card">
            <div className="card-header">
              <span className="card-icon">🚀</span>
              <span className="card-title">Aplicaciones DeFi de Flash Loans</span>
            </div>
            <div className="keypoints">
              <div className="keypoint">
                <span className="keypoint-icon">⚖️</span>
                <div><strong>Arbitraje sin capital:</strong> Comprar ETH barato en Uniswap, vender caro en Curve, devolver el préstamo — todo en 1 bloque (~12s).</div>
              </div>
              <div className="keypoint">
                <span className="keypoint-icon">🏦</span>
                <div><strong>Auto-liquidación de Vaults:</strong> Liquidar un Vault sub-colateralizado en Maker usando los propios fondos del Pool, sin capital previo.</div>
              </div>
              <div className="keypoint" style={{ borderLeftColor: 'var(--accent-red)' }}>
                <span className="keypoint-icon">⚠️</span>
                <div><strong>Ataque de Precio (Oracle Manipulation):</strong> Flash Loan en V2 podía mover el spot price en 1 bloque para explotar protocolos que no usaban TWAP.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
