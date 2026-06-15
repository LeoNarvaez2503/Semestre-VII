/**
 * SlideBlock5 — Upgrade Patterns DeFi: El Patrón Proxy
 * Fuentes: proxy.txt, erc-1967.md
 * Expositor 5
 */

import React, { useState } from 'react';

const PROXY_PATTERNS = [
  {
    id: 'transparent',
    name: 'Transparent Proxy',
    eip: 'EIP-1967',
    pros: ['Admin separado para upgrades', 'Sin selector clashing', 'Adoptado por OpenZeppelin'],
    cons: ['Overhead extra por admin check', 'Admin no puede usar el proxy como usuario'],
    gas: '~2,700 extra por call',
    color: 'blue',
  },
  {
    id: 'uups',
    name: 'UUPS Proxy',
    eip: 'EIP-1822',
    pros: ['Lógica de upgrade en implementación', 'Menor gas overhead', 'Más flexible'],
    cons: ['Riesgo: olvidar upgradeability en V2', 'Más responsabilidad en el dev'],
    gas: '~2,000 extra por call',
    color: 'green',
  },
  {
    id: 'beacon',
    name: 'Beacon Proxy',
    eip: 'EIP-1967',
    pros: ['Un solo upgrade actualiza N proxies', 'Ideal para fábricas de contratos', 'Eficiente en TVL grande'],
    cons: ['Extra hop: proxy → beacon → impl', 'Mayor complejidad arquitectural'],
    gas: '~3,200 extra por call',
    color: 'purple',
  },
];

export default function SlideBlock5() {
  const [activePattern, setActivePattern] = useState('transparent');
  const [showCall, setShowCall] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [upgraded, setUpgraded] = useState(false);

  const simulateUpgrade = () => {
    setUpgrading(true);
    setUpgraded(false);
    setTimeout(() => {
      setUpgrading(false);
      setUpgraded(true);
    }, 1800);
  };

  const current = PROXY_PATTERNS.find(p => p.id === activePattern);

  return (
    <section id="bloque-5" className="slide slide-anchor">
      {/* ---- Header ---- */}
      <div className="slide-header">
        <div className="slide-number">
          <div className="slide-number-badge">05</div>
          <span className="slide-presenter">Expositor 5</span>
        </div>
        <div className="slide-title-group">
          <p className="slide-eyebrow">Actualizabilidad de protocolos DeFi en producción</p>
          <h2 className="slide-title">Upgrade Patterns — El Patrón Proxy</h2>
          <p className="slide-subtitle">
            Cómo los grandes protocolos DeFi (Aave, Compound, Maker USDS) actualizan su lógica
            sin migrar el TVL ni cambiar la dirección del contrato. Separación de Estado y Lógica.
          </p>
        </div>
        <div className="flex gap-sm" style={{ flexShrink: 0 }}>
          <span className="badge badge-blue">EIP-1967</span>
          <span className="badge badge-green">UUPS</span>
        </div>
      </div>

      {/* ---- Metrics ---- */}
      <div className="metrics-row mb-lg">
        <div className="metric-card">
          <div className="metric-value text-accent">$50B+</div>
          <div className="metric-label">TVL en proxies upgradeable</div>
        </div>
        <div className="metric-card">
          <div className="metric-value text-green">0x3608...</div>
          <div className="metric-label">Slot impl. EIP-1967 (keccak256)</div>
        </div>
        <div className="metric-card">
          <div className="metric-value text-amber">delegatecall</div>
          <div className="metric-label">Opcode clave del patrón Proxy</div>
        </div>
        <div className="metric-card">
          <div className="metric-value" style={{ color: 'var(--accent-purple)' }}>ERC-1967</div>
          <div className="metric-label">Estándar Proxy Storage Slots</div>
        </div>
      </div>

      {/* ---- Main Grid ---- */}
      <div className="content-grid content-grid-2">
        {/* Left: Visual Architecture */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          {/* Pattern Selector */}
          <div className="card">
            <div className="card-header">
              <span className="card-icon">🏗️</span>
              <span className="card-title">Seleccionar Patrón de Proxy DeFi</span>
            </div>
            <div className="flex gap-sm mb-md">
              {PROXY_PATTERNS.map(p => (
                <button key={p.id} id={`btn-${p.id}`}
                  onClick={() => { setActivePattern(p.id); setUpgraded(false); }}
                  style={{
                    flex: 1,
                    padding: '8px',
                    background: activePattern === p.id ? `rgba(${p.color === 'blue' ? '99,130,255' : p.color === 'green' ? '52,211,153' : '167,139,250'},0.15)` : 'transparent',
                    border: `1px solid ${activePattern === p.id ? `rgba(${p.color === 'blue' ? '99,130,255' : p.color === 'green' ? '52,211,153' : '167,139,250'},0.5)` : 'var(--border-subtle)'}`,
                    borderRadius: 'var(--radius-md)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    fontWeight: '700',
                    color: activePattern === p.id ? (p.color === 'blue' ? 'var(--accent-primary)' : p.color === 'green' ? 'var(--accent-green)' : 'var(--accent-purple)') : 'var(--text-muted)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}>
                  {p.name}
                  <div style={{ fontSize: '0.6rem', marginTop: '2px', fontWeight: '400' }}>{p.eip}</div>
                </button>
              ))}
            </div>

            {/* Pattern info */}
            {current && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                  <div>
                    <div className="section-label">Ventajas</div>
                    {current.pros.map((p, i) => (
                      <div key={i} className="flex items-start gap-sm" style={{ marginBottom: '4px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        <span className="text-green">✓</span> {p}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="section-label">Desventajas</div>
                    {current.cons.map((c, i) => (
                      <div key={i} className="flex items-start gap-sm" style={{ marginBottom: '4px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        <span className="text-amber">⚠</span> {c}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-sm">
                  <span className="badge badge-amber">Gas Overhead:</span>
                  <span className="text-mono text-sm" style={{ color: 'var(--accent-amber)' }}>{current.gas}</span>
                </div>
              </div>
            )}
          </div>

          {/* Delegatecall Diagram */}
          <div className="card card-glow">
            <div className="card-header">
              <span className="card-icon">🔄</span>
              <span className="card-title">Delegatecall — Ejecución en Contexto del Proxy</span>
            </div>

            <div style={{ background: 'var(--bg-void)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)', border: '1px solid var(--border-subtle)' }}>
              {/* User */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                <div className="flow-node green" style={{ textAlign: 'center' }}>
                  👤 Usuario / DApp<br />
                  <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: '400' }}>msg.sender</span>
                </div>
              </div>
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '8px' }}>
                ↓ swap(USDC → ETH, 1000)
              </div>

              {/* Proxy Box */}
              <div style={{
                border: '2px solid rgba(99,130,255,0.4)',
                borderRadius: 'var(--radius-md)',
                padding: '12px',
                background: 'rgba(99,130,255,0.05)',
                marginBottom: '8px',
              }}>
                <div className="flex items-center justify-between mb-md">
                  <span className="badge badge-blue">🛡 PROXY CONTRACT — 0xABC...123</span>
                  {upgraded && <span className="badge badge-green">✅ V2 Activo</span>}
                </div>

                {/* Storage Section */}
                <div style={{
                  background: 'var(--bg-void)',
                  border: '1px solid rgba(99,130,255,0.2)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px',
                  marginBottom: '10px',
                }}>
                  <div className="section-label">STORAGE — Persiste entre upgrades</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', marginTop: '6px' }}>
                    {[
                      { slot: 'slot[0x360894...]', value: upgraded ? '→ ImplV2.sol' : '→ ImplV1.sol', c: upgraded ? 'green' : 'blue' },
                      { slot: 'slot[0xb53127...]', value: '→ Admin', c: 'purple' },
                      { slot: 'balances[user]', value: '$1,000,000 TVL', c: 'amber' },
                      { slot: 'reserves[USDC]', value: '500,000 USDC', c: 'amber' },
                    ].map((s, i) => (
                      <div key={i} style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)' }}>
                        <span style={{ color: 'var(--text-muted)' }}>{s.slot}:</span>{' '}
                        <span style={{ color: s.c === 'blue' ? 'var(--accent-primary)' : s.c === 'green' ? 'var(--accent-green)' : s.c === 'purple' ? 'var(--accent-purple)' : 'var(--accent-amber)' }}>
                          {s.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  ↓ delegatecall (ejecuta LÓGICA en CONTEXTO del Proxy)
                </div>
              </div>

              {/* Implementation boxes */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div style={{
                  border: `1px solid ${upgraded ? 'rgba(99,130,255,0.2)' : 'rgba(99,130,255,0.4)'}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '10px',
                  opacity: upgraded ? 0.4 : 1,
                  transition: 'opacity 0.5s',
                }}>
                  <div className="badge badge-blue mb-md" style={{ display: 'inline-flex' }}>
                    📄 ImplV1.sol {upgraded ? '(deprecated)' : '(activa)'}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
                    function swap() {'{...}'}<br />
                    function deposit() {'{...}'}<br />
                    <span style={{ color: 'var(--accent-red)' }}>// bug: no reentrancy guard</span>
                  </div>
                </div>
                <div style={{
                  border: `1px solid ${upgraded ? 'rgba(52,211,153,0.4)' : 'rgba(52,211,153,0.2)'}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '10px',
                  background: upgraded ? 'rgba(52,211,153,0.05)' : 'transparent',
                  transition: 'all 0.5s',
                }}>
                  <div className="badge badge-green mb-md" style={{ display: 'inline-flex' }}>
                    📄 ImplV2.sol {upgraded ? '(activa ✅)' : '(pendiente)'}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
                    function swap() {'{...}'}<br />
                    function deposit() {'{...}'}<br />
                    <span style={{ color: 'var(--accent-green)' }}>// + nonReentrant fixed</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-sm mt-md">
              <button id="btn-show-call" onClick={() => setShowCall(!showCall)}
                style={{
                  flex: 1,
                  padding: '8px',
                  background: 'rgba(99,130,255,0.1)',
                  border: '1px solid var(--border-accent)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--accent-primary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                }}>
                {showCall ? 'Ocultar delegatecall' : '🔍 Ver flow delegatecall'}
              </button>
              <button id="btn-simulate-upgrade" onClick={simulateUpgrade} disabled={upgrading}
                style={{
                  flex: 1,
                  padding: '8px',
                  background: upgrading ? 'var(--bg-elevated)' : 'rgba(52,211,153,0.1)',
                  border: '1px solid rgba(52,211,153,0.4)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--accent-green)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  cursor: upgrading ? 'not-allowed' : 'pointer',
                  fontWeight: '700',
                }}>
                {upgrading ? '⏳ Upgradeando...' : upgraded ? '✅ Actualizado a V2' : '⚡ Simular Upgrade V2'}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Code + EIP-1967 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          {/* delegatecall detail */}
          {showCall && (
            <div className="card" style={{ animation: 'slide-in-up 0.3s ease both' }}>
              <div className="card-header">
                <span className="card-icon">⚙️</span>
                <span className="card-title">Assembly — delegatecall en Proxy</span>
              </div>
              <div className="code-block">
                <div className="code-block-header">
                  <div className="code-dots">
                    <div className="code-dot red" /><div className="code-dot amber" /><div className="code-dot green" />
                  </div>
                  <span className="code-lang">Solidity Inline Assembly — Proxy._delegate()</span>
                </div>
                <div className="code-content">
                  <pre>
{`<span class="kw">function</span> <span class="fn">_delegate</span>(<span class="tp">address</span> implementation) <span class="kw">internal virtual</span> {
  assembly {
    <span class="cm">// Copiar calldata completo a memoria 0x00</span>
    <span class="fn">calldatacopy</span>(0, 0, <span class="fn">calldatasize</span>())

    <span class="cm">// CLAVE: delegatecall ejecuta impl pero con</span>
    <span class="cm">// msg.sender y storage del PROXY</span>
    <span class="kw">let</span> result := <span class="fn">delegatecall</span>(
      <span class="fn">gas</span>(),           <span class="cm">// todo el gas disponible</span>
      implementation,  <span class="cm">// dirección de la lógica</span>
      0,               <span class="cm">// calldata desde 0x00</span>
      <span class="fn">calldatasize</span>(),  <span class="cm">// tamaño del calldata</span>
      0,               <span class="cm">// output (aún no conocemos tamaño)</span>
      0
    )
    <span class="cm">// Copiar data de retorno</span>
    <span class="fn">returndatacopy</span>(0, 0, <span class="fn">returndatasize</span>())

    <span class="kw">switch</span> result
    <span class="kw">case</span> 0 { <span class="fn">revert</span>(0, <span class="fn">returndatasize</span>()) }
    <span class="kw">default</span> { <span class="fn">return</span>(0, <span class="fn">returndatasize</span>()) }
  }
}`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* EIP-1967 Storage Slots */}
          <div className="card card-glow">
            <div className="card-header">
              <span className="card-icon">🔐</span>
              <span className="card-title">EIP-1967 — Storage Slots Estandarizados</span>
            </div>
            <p className="card-body mb-md">
              EIP-1967 define slots de storage específicos para proxies, usando hashes de keccak256
              con offset -1. Esto garantiza que nunca colisionen con variables del compilador Solidity.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                {
                  name: 'IMPLEMENTATION_SLOT',
                  slot: '0x360894a13ba1a3...382bbc',
                  formula: 'bytes32(uint256(keccak256("eip1967.proxy.implementation")) - 1)',
                  color: 'blue',
                  desc: 'Dirección del contrato de lógica activo'
                },
                {
                  name: 'ADMIN_SLOT',
                  slot: '0xb53127684a568b...d6103',
                  formula: 'bytes32(uint256(keccak256("eip1967.proxy.admin")) - 1)',
                  color: 'purple',
                  desc: 'Dirección del administrador del proxy'
                },
                {
                  name: 'BEACON_SLOT',
                  slot: '0xa3f0ad74e5423a...3d50',
                  formula: 'bytes32(uint256(keccak256("eip1967.proxy.beacon")) - 1)',
                  color: 'cyan',
                  desc: 'Beacon contract para upgrades masivos'
                },
              ].map((s, i) => (
                <div key={i} style={{
                  background: 'var(--bg-elevated)',
                  border: `1px solid rgba(${s.color === 'blue' ? '99,130,255' : s.color === 'purple' ? '167,139,250' : '56,189,248'},0.25)`,
                  borderRadius: 'var(--radius-md)',
                  padding: '10px',
                }}>
                  <div className="flex items-center gap-sm mb-md">
                    <span className={`badge badge-${s.color === 'blue' ? 'blue' : s.color === 'purple' ? 'purple' : 'cyan'}`}>{s.name}</span>
                    <code className="text-mono text-xs" style={{ color: 'var(--text-muted)' }}>{s.slot}</code>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.67rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    = {s.formula}
                  </div>
                  <div className="text-xs text-muted">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Storage Layout Warning */}
          <div className="card">
            <div className="card-header">
              <span className="card-icon">⚠️</span>
              <span className="card-title">Storage Collision — El Riesgo Principal en DeFi</span>
            </div>
            <div className="code-block">
              <div className="code-block-header">
                <div className="code-dots">
                  <div className="code-dot red" /><div className="code-dot amber" /><div className="code-dot green" />
                </div>
                <span className="code-lang">Solidity — Storage Layout Mismatch (Error Crítico)</span>
              </div>
              <div className="code-content">
                <pre>
{`<span class="cm">// ❌ PELIGROSO: ImplV1 tiene layout incompatible con V2</span>
<span class="kw">contract</span> <span class="tp">ImplV1</span> {
  <span class="tp">uint256</span> <span class="kw">public</span> totalSupply; <span class="cm">// slot 0</span>
  <span class="tp">address</span> <span class="kw">public</span> owner;       <span class="cm">// slot 1</span>
}

<span class="kw">contract</span> <span class="tp">ImplV2_BAD</span> {
  <span class="tp">address</span> <span class="kw">public</span> owner;       <span class="cm">// slot 0 ← COLISIÓN</span>
  <span class="tp">uint256</span> <span class="kw">public</span> totalSupply; <span class="cm">// slot 1 ← SWAP</span>
  <span class="cm">// EL TVL del protocolo apunta al slot incorrecto! 💥</span>
}

<span class="cm">// ✅ CORRECTO: Nunca reordenar, solo añadir al final</span>
<span class="kw">contract</span> <span class="tp">ImplV2_SAFE</span> {
  <span class="tp">uint256</span> <span class="kw">public</span> totalSupply; <span class="cm">// slot 0 ✓</span>
  <span class="tp">address</span> <span class="kw">public</span> owner;       <span class="cm">// slot 1 ✓</span>
  <span class="tp">uint256</span> <span class="kw">public</span> newFeature;  <span class="cm">// slot 2 ← nuevo</span>
}`}
                </pre>
              </div>
            </div>
            <p className="text-sm text-secondary mt-sm">
              <strong className="text-red">Incidente real:</strong> Un storage collision puede
              corromper todo el TVL del protocolo. Herramientas como <code className="text-mono text-cyan">OpenZeppelin Upgrades Plugin</code> y <code className="text-mono text-cyan">Foundry storage-layout</code> detectan colisiones antes del deploy.
            </p>
          </div>

          {/* USDS / Maker real world */}
          <div className="card">
            <div className="card-header">
              <span className="card-icon">🌐</span>
              <span className="card-title">Caso Real: USDS (Maker Sky) — ERC1967Proxy</span>
            </div>
            <div className="keypoints">
              <div className="keypoint">
                <span className="keypoint-icon">📋</span>
                <div>
                  El token <strong>USDS</strong> de MakerDAO está desplegado con{' '}
                  <code className="text-mono text-cyan">ERC1967Proxy</code>, permitiendo activar
                  una función de freeze en el futuro mediante governance vote, sin migrar usuarios.
                </div>
              </div>
              <div className="keypoint">
                <span className="keypoint-icon">🏛️</span>
                <div>
                  <strong>Aave V3:</strong> Los contratos Pool, PoolAddressesProvider y todos los
                  aTokens usan proxies actualizables. Aave puede corregir bugs y añadir features
                  sin que los usuarios retiren fondos.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
