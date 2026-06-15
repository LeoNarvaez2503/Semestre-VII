/**
 * SlideBlock6 — QA, Verificación Formal y E2E en Protocolos DeFi
 * Fuentes: Foundry, Certora — conceptos de testing en Web3
 * Expositor 6
 */

import React, { useState, useEffect } from 'react';

const TEST_RESULTS = [
  { name: 'invariant_solvency', type: 'Invariant', status: 'PASS', time: '1.2s', desc: 'totalAssets ≥ totalDebt siempre' },
  { name: 'invariant_conservation', type: 'Invariant', status: 'PASS', time: '0.9s', desc: 'sum(balances) == totalSupply' },
  { name: 'test_flashLoan_repay', type: 'Unit', status: 'PASS', time: '0.1s', desc: 'Flash loan devuelve capital+fee' },
  { name: 'test_flashLoan_revert', type: 'Unit', status: 'PASS', time: '0.1s', desc: 'FL revierte si saldo insuficiente' },
  { name: 'test_swap_exactInput', type: 'Fuzz', status: 'PASS', time: '3.4s', desc: '1000 runs aleatorios de swap' },
  { name: 'test_liquidation_math', type: 'Fuzz', status: 'PASS', time: '2.1s', desc: 'LTV check bajo precios random' },
  { name: 'certora_vault_solvency', type: 'Formal', status: 'PASS', time: '45s', desc: 'Proof: Vault siempre solvente' },
  { name: 'certora_no_free_mint', type: 'Formal', status: 'PASS', time: '38s', desc: 'Proof: Imposible mint sin colateral' },
  { name: 'e2e_swap_ui', type: 'E2E', status: 'PASS', time: '8s', desc: 'Cypress: swap USDC→ETH en UI' },
  { name: 'e2e_liquidation_flow', type: 'E2E', status: 'PASS', time: '12s', desc: 'UI refleja posición liquidada' },
];

const TYPE_COLORS = {
  Invariant: 'purple',
  Unit: 'blue',
  Fuzz: 'cyan',
  Formal: 'amber',
  E2E: 'green',
};

const PIPELINE_STAGES = [
  {
    id: 'on-chain',
    icon: '⛓️',
    title: 'On-chain Data',
    color: 'blue',
    items: [
      'eth_getLogs — eventos de pool',
      'eth_call — lectura de estado',
      'Problema: N+1 latencia RPC',
      'Solución: Multicall3 batch',
    ],
  },
  {
    id: 'indexer',
    icon: '📊',
    title: 'Indexer / Subgraph',
    color: 'cyan',
    items: [
      'The Graph Protocol',
      'GraphQL queries tipadas',
      'Sincronización en tiempo real',
      'Cache determinista por bloque',
    ],
  },
  {
    id: 'invariant',
    icon: '🔬',
    title: 'Invariant Tests (Foundry)',
    color: 'purple',
    items: [
      'Corpus de estados válidos',
      'Stateful fuzzing del protocolo',
      'Verificar: saldos == colateral',
      'Certora: proof matemática',
    ],
  },
  {
    id: 'ui',
    icon: '🖥️',
    title: 'UI Determinista',
    color: 'amber',
    items: [
      'Renderizado condicional por bloque',
      'Estado derivado del contrato',
      'Sin UI stale (datos frescos)',
      'Snapshot tests de componentes',
    ],
  },
  {
    id: 'e2e',
    icon: '🧪',
    title: 'E2E / Automación (Cypress)',
    color: 'green',
    items: [
      'Fork de mainnet (anvil --fork)',
      'Scenario BDD tipo Cucumber',
      'Wallet mock determinista',
      'Status: PASSED en CI/CD',
    ],
  },
];

export default function SlideBlock6() {
  const [runningTests, setRunningTests] = useState(false);
  const [visibleTests, setVisibleTests] = useState(0);
  const [activeStage, setActiveStage] = useState('on-chain');

  const runTests = () => {
    setRunningTests(true);
    setVisibleTests(0);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setVisibleTests(i);
      if (i >= TEST_RESULTS.length) {
        clearInterval(interval);
        setRunningTests(false);
      }
    }, 220);
  };

  return (
    <section id="bloque-6" className="slide slide-anchor">
      {/* ---- Header ---- */}
      <div className="slide-header">
        <div className="slide-number">
          <div className="slide-number-badge">06</div>
          <span className="slide-presenter">Expositor 6</span>
        </div>
        <div className="slide-title-group">
          <p className="slide-eyebrow">QA en código financiero inmutable — Foundry & Certora</p>
          <h2 className="slide-title">Verificación Formal, Fuzzing & E2E en DeFi</h2>
          <p className="slide-subtitle">
            El ciclo completo de QA para protocolos DeFi: desde Invariant Testing matemático de solvencia,
            hasta automatización E2E de UI con datos on-chain deterministas. El código DeFi no admite bugs post-deploy.
          </p>
        </div>
        <div className="flex gap-sm" style={{ flexShrink: 0 }}>
          <span className="badge badge-purple">Foundry</span>
          <span className="badge badge-amber">Certora</span>
          <span className="badge badge-green">Cypress</span>
        </div>
      </div>

      {/* ---- Main Grid ---- */}
      <div className="content-grid content-grid-2">
        {/* Left: Pipeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          {/* Pipeline stages */}
          <div className="card card-glow">
            <div className="card-header">
              <span className="card-icon">🔄</span>
              <span className="card-title">Pipeline QA DeFi — Full Stack</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {PIPELINE_STAGES.map((stage, i) => (
                <React.Fragment key={stage.id}>
                  <div
                    id={`stage-${stage.id}`}
                    onClick={() => setActiveStage(stage.id)}
                    style={{
                      background: activeStage === stage.id ? `rgba(${stage.color === 'blue' ? '99,130,255' : stage.color === 'cyan' ? '56,189,248' : stage.color === 'purple' ? '167,139,250' : stage.color === 'amber' ? '251,191,36' : '52,211,153'},0.1)` : 'var(--bg-elevated)',
                      border: `1px solid ${activeStage === stage.id ? `rgba(${stage.color === 'blue' ? '99,130,255' : stage.color === 'cyan' ? '56,189,248' : stage.color === 'purple' ? '167,139,250' : stage.color === 'amber' ? '251,191,36' : '52,211,153'},0.4)` : 'var(--border-subtle)'}`,
                      borderRadius: 'var(--radius-md)',
                      padding: '10px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}>
                    <div className="flex items-center gap-sm" style={{ marginBottom: activeStage === stage.id ? '8px' : 0 }}>
                      <span style={{ fontSize: '1rem' }}>{stage.icon}</span>
                      <span className={`badge badge-${stage.color === 'blue' ? 'blue' : stage.color === 'cyan' ? 'cyan' : stage.color === 'purple' ? 'purple' : stage.color === 'amber' ? 'amber' : 'green'}`}>{i + 1}</span>
                      <span style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-primary)' }}>{stage.title}</span>
                    </div>
                    {activeStage === stage.id && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {stage.items.map((item, j) => (
                          <div key={j} className="flex items-center gap-sm" style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                            <span style={{ color: 'var(--accent-primary)', flexShrink: 0 }}>→</span>
                            {item}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {i < PIPELINE_STAGES.length - 1 && (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: 1 }}>↓</div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* N+1 Problem */}
          <div className="card">
            <div className="card-header">
              <span className="card-icon">🚦</span>
              <span className="card-title">Problema N+1 en Extracción On-Chain</span>
            </div>
            <div className="code-block">
              <div className="code-block-header">
                <div className="code-dots">
                  <div className="code-dot red" /><div className="code-dot amber" /><div className="code-dot green" />
                </div>
                <span className="code-lang">TypeScript — Ethers.js / RPC calls</span>
              </div>
              <div className="code-content">
                <pre>
{`<span class="cm">// ❌ N+1 LATENCIA: una llamada RPC por posición</span>
<span class="cm">// Si hay 100 posiciones = 100 round-trips al nodo</span>
<span class="kw">for</span> (<span class="kw">const</span> position <span class="kw">of</span> positions) {
  <span class="kw">const</span> data = <span class="kw">await</span> pool.<span class="fn">positions</span>(position.id);
  <span class="cm">// ~200ms por llamada → 20s total 🐌</span>
}

<span class="cm">// ✅ SOLUCIÓN: Multicall3 — 1 TX, N datos</span>
<span class="kw">const</span> calls = positions.<span class="fn">map</span>(p => ({
  target: POOL_ADDRESS,
  callData: pool.interface.<span class="fn">encodeFunctionData</span>(
    <span class="str">'positions'</span>, [p.id]
  ),
}));

<span class="kw">const</span> results = <span class="kw">await</span> multicall3.<span class="fn">aggregate3</span>(calls);
<span class="cm">// 1 round-trip → &lt;50ms para 100 posiciones ✅</span>

<span class="cm">// Para UI determinista: siempre query por blockNumber</span>
<span class="kw">const</span> state = <span class="kw">await</span> pool.<span class="fn">positions</span>(id, {
  blockTag: latestBlock <span class="cm">// mismo bloque = mismo estado</span>
});`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Tests + Code */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          {/* Invariant Test */}
          <div className="card">
            <div className="card-header">
              <span className="card-icon">🔬</span>
              <span className="card-title">Foundry — Invariant Testing de Solvencia DeFi</span>
            </div>
            <div className="code-block">
              <div className="code-block-header">
                <div className="code-dots">
                  <div className="code-dot red" /><div className="code-dot amber" /><div className="code-dot green" />
                </div>
                <span className="code-lang">Solidity — Foundry InvariantTest (forge test)</span>
              </div>
              <div className="code-content">
                <pre>
{`<span class="kw">contract</span> <span class="tp">ProtocolInvariantTest</span> <span class="kw">is</span> <span class="tp">StdInvariant</span>, <span class="tp">Test</span> {
  <span class="tp">DefiProtocol</span> protocol;
  <span class="tp">Handler</span>      handler;

  <span class="kw">function</span> <span class="fn">setUp</span>() <span class="kw">public</span> {
    protocol = <span class="kw">new</span> <span class="tp">DefiProtocol</span>();
    handler  = <span class="kw">new</span> <span class="tp">Handler</span>(protocol);
    <span class="cm">// Foundry generará secuencias aleatorias</span>
    <span class="cm">// de llamadas a handler (stateful fuzzing)</span>
    <span class="fn">targetContract</span>(address(handler));
  }

  <span class="cm">/// @notice INVARIANTE MATEMÁTICA DE SOLVENCIA:</span>
  <span class="cm">/// El protocolo NUNCA puede tener más deuda</span>
  <span class="cm">/// que activos colateralizados.</span>
  <span class="kw">function</span> <span class="fn">invariant_solvency</span>() <span class="kw">public view</span> {
    <span class="kw">assertGe</span>(
      protocol.<span class="fn">totalAssets</span>(),   <span class="cm">// colateral total</span>
      protocol.<span class="fn">totalDebt</span>(),     <span class="cm">// deuda total en DAI</span>
      <span class="str">"BREAK: Protocol insolvent!"</span>
    );
  }

  <span class="cm">/// Invariante: suma de balances == totalSupply</span>
  <span class="kw">function</span> <span class="fn">invariant_conservation</span>() <span class="kw">public view</span> {
    <span class="kw">assertEq</span>(
      handler.<span class="fn">ghost_sumBalances</span>(),
      protocol.token().<span class="fn">totalSupply</span>(),
      <span class="str">"BREAK: Token supply mismatch!"</span>
    );
  }
}`}
                </pre>
              </div>
            </div>
          </div>

          {/* Certora */}
          <div className="card">
            <div className="card-header">
              <span className="card-icon">📐</span>
              <span className="card-title">Certora — Verificación Formal (CVL)</span>
            </div>
            <div className="code-block">
              <div className="code-block-header">
                <div className="code-dots">
                  <div className="code-dot red" /><div className="code-dot amber" /><div className="code-dot green" />
                </div>
                <span className="code-lang">CVL — Certora Verification Language</span>
              </div>
              <div className="code-content">
                <pre>
{`<span class="cm">// Prueba matemática formal: no es testing estadístico</span>
<span class="cm">// Certora verifica TODOS los caminos de ejecución posibles</span>

<span class="tp">rule</span> <span class="fn">no_free_minting</span> {
  <span class="tp">env</span> e;
  <span class="tp">address</span> user;
  <span class="tp">uint256</span> amount;

  <span class="tp">uint256</span> collateralBefore = <span class="fn">getCollateral</span>(user);
  <span class="tp">uint256</span> debtBefore      = <span class="fn">getDebt</span>(user);

  <span class="cm">// Ejecutar mint de DAI</span>
  <span class="fn">mint</span>(e, user, amount);

  <span class="tp">uint256</span> debtAfter = <span class="fn">getDebt</span>(user);

  <span class="cm">// PROOF: Si la deuda aumenta, el colateral</span>
  <span class="cm">// debe cubrir el ratio mínimo de liquidación</span>
  <span class="fn">assert</span> debtAfter > debtBefore =>
    collateralBefore * 100 >= debtAfter * MIN_RATIO,
    <span class="str">"Violación: mint sin suficiente colateral"</span>;
}

<span class="cm">// Resultado: VERIFIED ✅ — Prueba exhaustiva en 38s</span>`}
                </pre>
              </div>
            </div>
          </div>

          {/* Test Runner Simulation */}
          <div className="card card-glow">
            <div className="card-header">
              <span className="card-icon">🧪</span>
              <span className="card-title">Test Suite Completa — Resultados</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '300px', overflowY: 'auto', marginBottom: '12px' }}>
              {TEST_RESULTS.slice(0, visibleTests).map((t, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 10px',
                  background: 'var(--bg-elevated)',
                  borderRadius: 'var(--radius-sm)',
                  animation: 'slide-in-up 0.2s ease both',
                }}>
                  <span style={{ color: 'var(--accent-green)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: '700' }}>
                    ✓ {t.status}
                  </span>
                  <span style={{ background: `rgba(${t.type === 'Invariant' ? '167,139,250' : t.type === 'Formal' ? '251,191,36' : t.type === 'Fuzz' ? '56,189,248' : t.type === 'E2E' ? '52,211,153' : '99,130,255'},0.15)`, color: `${t.type === 'Invariant' ? 'var(--accent-purple)' : t.type === 'Formal' ? 'var(--accent-amber)' : t.type === 'Fuzz' ? 'var(--accent-secondary)' : t.type === 'E2E' ? 'var(--accent-green)' : 'var(--accent-primary)'}`, border: 'none', display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: '999px', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', fontWeight: '700' }}>
                    {t.type}
                  </span>
                  <code className="text-mono text-xs" style={{ color: 'var(--accent-secondary)', flex: 1 }}>{t.name}</code>
                  <span className="text-xs text-muted">{t.time}</span>
                </div>
              ))}

              {visibleTests === 0 && !runningTests && (
                <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                  Presiona "Run Tests" para simular la suite completa
                </div>
              )}
            </div>

            {visibleTests === TEST_RESULTS.length && (
              <div style={{ padding: '10px', background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: '8px', marginBottom: '10px' }}>
                <div className="text-mono text-sm text-green fw-bold">
                  ✅ {TEST_RESULTS.length}/{TEST_RESULTS.length} tests PASSED | Suite: Invariant + Unit + Fuzz + Formal + E2E
                </div>
                <div className="text-xs text-secondary mt-sm">
                  No se encontraron violaciones de invariantes. El protocolo puede hacer merge seguro.
                </div>
              </div>
            )}

            <button id="btn-run-tests" onClick={runTests} disabled={runningTests}
              style={{
                width: '100%',
                padding: '10px',
                background: runningTests ? 'var(--bg-elevated)' : 'rgba(167,139,250,0.1)',
                border: '1px solid rgba(167,139,250,0.4)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--accent-purple)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                fontWeight: '700',
                cursor: runningTests ? 'not-allowed' : 'pointer',
              }}>
              {runningTests ? '⏳ Ejecutando tests...' : '▶ forge test --invariant + certora verify + cypress run'}
            </button>
          </div>
        </div>
      </div>

      {/* ---- Full-width closing ---- */}
      <div className="card mt-lg" style={{ background: 'linear-gradient(135deg, rgba(99,130,255,0.06) 0%, rgba(52,211,153,0.04) 100%)', border: '1px solid var(--border-accent)' }}>
        <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
          <div>
            <div className="section-label">Ciclo continuo de QA en DeFi — Resumen</div>
            <div className="flow-row mt-sm">
              <div className="flow-node primary">On-chain Data<br /><span className="flow-label">eth_call/getLogs</span></div>
              <span className="flow-arrow">→</span>
              <div className="flow-node cyan">Indexer<br /><span className="flow-label">The Graph</span></div>
              <span className="flow-arrow">→</span>
              <div className="flow-node purple">Invariant Test<br /><span className="flow-label">Foundry</span></div>
              <span className="flow-arrow">→</span>
              <div className="flow-node amber">Formal Proof<br /><span className="flow-label">Certora</span></div>
              <span className="flow-arrow">→</span>
              <div className="flow-node green">E2E UI<br /><span className="flow-label">Cypress</span></div>
              <span className="flow-arrow">→</span>
              <div className="flow-node green" style={{ borderColor: 'var(--accent-green)' }}>PASSED ✅</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="text-mono text-sm text-muted">A diferencia del software tradicional:</div>
            <div className="text-sm text-primary fw-bold" style={{ maxWidth: '28ch' }}>
              En DeFi, un bug post-deploy puede significar la pérdida permanente de millones en TVL.
              El testing no es opcional — es arquitectura.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
