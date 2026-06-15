/**
 * SlideBlock3 — Deuda Algorítmica y Composability en DeFi
 * Fuentes: The Maker Protocol Whitepaper.txt, conceptos Aave
 * Expositor 3
 */

import React, { useState } from 'react';

const LEGO_FLOWS = [
  {
    from: 'Usuario (EOA)',
    fromColor: 'green',
    token: 'ETH / WBTC',
    to: 'Maker Vault (Urn)',
    toColor: 'primary',
    action: 'Deposita colateral',
  },
  {
    from: 'Maker Vault (Urn)',
    fromColor: 'primary',
    token: 'DAI mintado',
    to: 'Aave V3 Pool',
    toColor: 'purple',
    action: 'Suministra liquidez',
  },
  {
    from: 'Aave V3 Pool',
    fromColor: 'purple',
    token: 'aDAI (receipt token)',
    to: 'Uniswap V3 LP',
    toColor: 'cyan',
    action: 'Provee liquidez AMM',
  },
  {
    from: 'Uniswap V3 LP',
    fromColor: 'cyan',
    token: 'NFT Posición LP',
    to: 'Protocolo de Yield',
    toColor: 'amber',
    action: 'Colateraliza posición',
  },
];

export default function SlideBlock3() {
  const [activeFlow, setActiveFlow] = useState(null);

  return (
    <section id="bloque-3" className="slide slide-anchor">
      {/* ---- Header ---- */}
      <div className="slide-header">
        <div className="slide-number">
          <div className="slide-number-badge">03</div>
          <span className="slide-presenter">Expositor 3</span>
        </div>
        <div className="slide-title-group">
          <p className="slide-eyebrow">Arquitectura de protocolos DeFi interdependientes</p>
          <h2 className="slide-title">Composability: Los "Money Legos" de DeFi</h2>
          <p className="slide-subtitle">
            Cómo la arquitectura de Vaults de MakerDAO y la interdependencia de estado entre contratos inteligentes
            permite construir sistemas financieros complejos apilando protocolos atómicamente.
          </p>
        </div>
        <div className="flex gap-sm" style={{ flexShrink: 0 }}>
          <span className="badge badge-blue">Maker MCD</span>
          <span className="badge badge-purple">Aave V3</span>
        </div>
      </div>

      {/* ---- Main Grid ---- */}
      <div className="content-grid content-grid-1-2">
        {/* Left: Vault Architecture */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          <div className="card card-glow">
            <div className="card-header">
              <span className="card-icon">🏦</span>
              <span className="card-title">Arquitectura MCD — El Contrato Vat</span>
            </div>
            <p className="card-body mb-md">
              El <strong className="text-primary">Vat</strong> es el contrato central ("núcleo contable") de MakerDAO.
              Mantiene el estado de <em>todos</em> los Vaults en un único contrato, minimizando SSTORE.
            </p>

            {/* Vat Architecture Diagram (SVG-CSS) */}
            <div style={{
              background: 'var(--bg-void)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--spacing-md)',
              position: 'relative',
            }}>
              {/* Vat outer box */}
              <div style={{
                border: '2px solid rgba(99,130,255,0.4)',
                borderRadius: 'var(--radius-md)',
                padding: '12px',
                background: 'rgba(99,130,255,0.04)',
                marginBottom: '12px',
              }}>
                <div className="flex items-center gap-sm mb-md">
                  <span className="badge badge-blue">VAT.sol</span>
                  <span className="text-xs text-muted">— Contrato Contable Central</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {[
                    { key: 'urns[ilk][usr]', type: 'mapping', desc: 'Estado de cada Vault' },
                    { key: 'gem[ilk][usr]', type: 'mapping', desc: 'Colateral no bloqueado' },
                    { key: 'dai[usr]', type: 'mapping', desc: 'Balance DAI interno' },
                    { key: 'ilks[ilk]', type: 'struct', desc: 'Config por tipo colateral' },
                    { key: 'sin[usr]', type: 'mapping', desc: 'Deuda del sistema' },
                    { key: 'debt / vice', type: 'uint256', desc: 'DAI total / deuda total' },
                  ].map((s, i) => (
                    <div key={i} style={{
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '6px 10px',
                    }}>
                      <div className="text-mono text-xs" style={{ color: 'var(--accent-secondary)' }}>{s.key}</div>
                      <div style={{ display: 'flex', gap: '4px', marginTop: '2px', alignItems: 'center' }}>
                        <span className={`badge ${s.type === 'mapping' ? 'badge-blue' : s.type === 'struct' ? 'badge-purple' : 'badge-amber'}`}>
                          {s.type}
                        </span>
                        <span className="text-xs text-muted">{s.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Surrounding contracts */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                {[
                  { name: 'Jug.sol', role: 'Stability Fee accrual', color: 'blue' },
                  { name: 'Cat.sol', role: 'Liquidación de Vaults', color: 'red' },
                  { name: 'Spot.sol', role: 'Feed de precio oracle', color: 'amber' },
                  { name: 'Join.sol', role: 'Bridge colateral ERC20', color: 'green' },
                  { name: 'Flap/Flop', role: 'Surplus/Debt Auctions', color: 'purple' },
                  { name: 'DSS-Proxy', role: 'Proxy del usuario', color: 'cyan' },
                ].map((c, i) => (
                  <div key={i} style={{
                    border: `1px solid rgba(${
                      c.color === 'blue' ? '99,130,255' :
                      c.color === 'red' ? '248,113,113' :
                      c.color === 'amber' ? '251,191,36' :
                      c.color === 'green' ? '52,211,153' :
                      c.color === 'purple' ? '167,139,250' :
                      '56,189,248'
                    },0.35)`,
                    borderRadius: 'var(--radius-sm)',
                    padding: '6px 8px',
                    background: 'var(--bg-elevated)',
                    textAlign: 'center',
                  }}>
                    <div className="text-mono" style={{ fontSize: '0.7rem', color: 'var(--text-primary)', fontWeight: '700' }}>{c.name}</div>
                    <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: '2px' }}>{c.role}</div>
                  </div>
                ))}
              </div>

              <p className="text-xs text-muted" style={{ marginTop: '10px', textAlign: 'center' }}>
                Todos los contratos secundarios sólo pueden modificar el Vat mediante <code className="text-mono">auth</code> (lista blanca).
              </p>
            </div>
          </div>

          {/* Risk Parameters */}
          <div className="card">
            <div className="card-header">
              <span className="card-icon">⚙️</span>
              <span className="card-title">Parámetros de Riesgo por Colateral (ilk)</span>
            </div>
            <table className="defi-table">
              <thead>
                <tr><th>Parámetro</th><th>Tipo</th><th>Función DeFi</th></tr>
              </thead>
              <tbody>
                <tr><td><code className="text-mono">line</code></td><td><span className="badge badge-blue">uint256</span></td><td>Debt Ceiling — DAI máximo por colateral</td></tr>
                <tr><td><code className="text-mono">dust</code></td><td><span className="badge badge-blue">uint256</span></td><td>Vault mínimo (anti-spam, anti-gas-griefing)</td></tr>
                <tr className="highlight-row"><td><code className="text-mono">mat</code></td><td><span className="badge badge-amber">ray</span></td><td>Liquidation Ratio — umbral colateralización</td></tr>
                <tr><td><code className="text-mono">duty</code></td><td><span className="badge badge-purple">ray</span></td><td>Stability Fee — tasa de interés continuo</td></tr>
                <tr className="danger-row"><td><code className="text-mono">chop</code></td><td><span className="badge badge-red">wad</span></td><td>Liquidation Penalty — penalización por liquidación</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Composability Diagram + Code */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          {/* Money Legos Flow */}
          <div className="card card-glow">
            <div className="card-header">
              <span className="card-icon">🧩</span>
              <span className="card-title">Diagrama de Composability — "Money Legos"</span>
            </div>
            <p className="text-sm text-secondary mb-md">
              Un activo puede atravesar múltiples protocolos DeFi en una <strong className="text-primary">sola transacción atómica</strong>,
              generando rendimiento en cada capa sin custodios intermediarios.
            </p>

            <div className="composability-diagram">
              {/* User */}
              <div className="protocol-box user">
                <div className="protocol-icon" style={{ background: 'rgba(52,211,153,0.15)' }}>👤</div>
                <div>
                  <div className="protocol-name" style={{ color: 'var(--accent-green)' }}>Usuario (EOA / Smart Wallet)</div>
                  <div className="protocol-desc">Posee colateral: ETH, WBTC, stETH...</div>
                </div>
              </div>

              <div className="connector-line">
                <div className="connector-arrow">↓</div>
                <div className="connector-token">⚡ Deposita colateral</div>
                <div className="connector-arrow">↓</div>
              </div>

              {/* Maker */}
              <div className="protocol-box maker">
                <div className="protocol-icon" style={{ background: 'rgba(99,130,255,0.15)' }}>🏦</div>
                <div>
                  <div className="protocol-name" style={{ color: 'var(--accent-primary)' }}>MakerDAO — Vault (Urn)</div>
                  <div className="protocol-desc">
                    <code className="text-mono" style={{ fontSize: '0.7rem' }}>lock(ETH) → draw(DAI)</code>
                    {' '}· Colateral &gt; 150% · Stability Fee accrúa
                  </div>
                </div>
              </div>

              <div className="connector-line">
                <div className="connector-arrow">↓</div>
                <div className="connector-token">🪙 DAI sintético</div>
                <div className="connector-arrow">↓</div>
              </div>

              {/* Aave */}
              <div className="protocol-box aave">
                <div className="protocol-icon" style={{ background: 'rgba(167,139,250,0.15)' }}>👻</div>
                <div>
                  <div className="protocol-name" style={{ color: 'var(--accent-purple)' }}>Aave V3 Pool</div>
                  <div className="protocol-desc">
                    <code className="text-mono" style={{ fontSize: '0.7rem' }}>supply(DAI) → aDAI</code>
                    {' '}· Yield = tasa variable de préstamos · Posición colateralizable
                  </div>
                </div>
              </div>

              <div className="connector-line">
                <div className="connector-arrow">↓</div>
                <div className="connector-token">🏷 aDAI (interest-bearing)</div>
                <div className="connector-arrow">↓</div>
              </div>

              {/* Uniswap */}
              <div className="protocol-box uniswap">
                <div className="protocol-icon" style={{ background: 'rgba(56,189,248,0.15)' }}>🦄</div>
                <div>
                  <div className="protocol-name" style={{ color: 'var(--accent-secondary)' }}>Uniswap V3 Pool</div>
                  <div className="protocol-desc">
                    <code className="text-mono" style={{ fontSize: '0.7rem' }}>mint(aDAI/USDC, [pa, pb])</code>
                    {' '}· NFT posición LP · Fees por swap dentro del rango
                  </div>
                </div>
              </div>

              <div className="connector-line">
                <div className="connector-arrow">↓</div>
                <div className="connector-token">💎 LP NFT (ERC-721)</div>
                <div className="connector-arrow">↓</div>
              </div>

              {/* Yield Protocol */}
              <div className="protocol-box" style={{ borderColor: 'rgba(251,191,36,0.4)', background: 'rgba(251,191,36,0.07)', maxWidth: '480px', width: '100%' }}>
                <div className="protocol-icon" style={{ background: 'rgba(251,191,36,0.15)' }}>🌾</div>
                <div>
                  <div className="protocol-name" style={{ color: 'var(--accent-amber)' }}>Protocolo de Yield / Colateralización</div>
                  <div className="protocol-desc">
                    LP NFT como colateral → más liquidez prestada → más rendimiento.
                    Múltiples capas de composability en una sola TX.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vault Code */}
          <div className="card">
            <div className="card-header">
              <span className="card-icon">💻</span>
              <span className="card-title">Operación de Vault en Vat.sol</span>
            </div>
            <div className="code-block">
              <div className="code-block-header">
                <div className="code-dots">
                  <div className="code-dot red" /><div className="code-dot amber" /><div className="code-dot green" />
                </div>
                <span className="code-lang">Solidity — Vat.sol (MakerDAO MCD)</span>
              </div>
              <div className="code-content">
                <pre>
{`<span class="cm">/// @dev Función central del Vault:</span>
<span class="cm">/// Modifica deuda (dart) y colateral (dink)</span>
<span class="kw">function</span> <span class="fn">frob</span>(
  <span class="tp">bytes32</span> i,  <span class="cm">// ilk (tipo de colateral: ETH-A)</span>
  <span class="tp">address</span> u,  <span class="cm">// Vault owner (urn)</span>
  <span class="tp">address</span> v,  <span class="cm">// Fuente de colateral (gem)</span>
  <span class="tp">address</span> w,  <span class="cm">// Destino de DAI</span>
  <span class="tp">int</span>     dink, <span class="cm">// Δ colateral (+ lock, - free)</span>
  <span class="tp">int</span>     dart  <span class="cm">// Δ deuda en DAI (+ draw, - wipe)</span>
) <span class="kw">external</span> {
  Urn <span class="kw">memory</span> urn = urns[i][u];
  Ilk <span class="kw">memory</span> ilk = ilks[i];

  urn.ink = _add(urn.ink, dink); <span class="cm">// actualiza colateral</span>
  urn.art = _add(urn.art, dart); <span class="cm">// actualiza deuda</span>
  ilk.Art = _add(ilk.Art, dart); <span class="cm">// deuda total del ilk</span>

  <span class="cm">// Deuda en DAI = art * rate (estabilidad acumulada)</span>
  <span class="tp">int</span> dtab = <span class="fn">mul</span>(ilk.rate, dart);
  <span class="tp">uint</span> tab = <span class="fn">mul</span>(ilk.rate, urn.art);

  <span class="cm">// Invariante: colateral ≥ deuda × ratio de liquidación</span>
  <span class="kw">require</span>(
    tab <= <span class="fn">mul</span>(urn.ink, ilk.spot),
    <span class="str">"Vat/not-safe"</span>        <span class="cm">// REVERT si sub-colateralizado</span>
  );
  <span class="cm">// ... actualiza gem, dai, debt en Vat ...</span>
}`}
                </pre>
              </div>
            </div>
          </div>

          {/* Composability risk */}
          <div className="card">
            <div className="card-header">
              <span className="card-icon">⚠️</span>
              <span className="card-title">Deuda Algorítmica — Riesgos de Composability</span>
            </div>
            <div className="keypoints">
              <div className="keypoint" style={{ borderLeftColor: 'var(--accent-red)' }}>
                <span className="keypoint-icon">🔗</span>
                <div>
                  <strong>Interdependencia de Estado:</strong> Si Aave pausa un activo, todos los protocolos
                  que lo usan como colateral aguas arriba fallan en cadena (systemic risk).
                </div>
              </div>
              <div className="keypoint" style={{ borderLeftColor: 'var(--accent-amber)' }}>
                <span className="keypoint-icon">📊</span>
                <div>
                  <strong>Oracle Dependency:</strong> Maker necesita feeds de precio para calcular si
                  <code className="text-mono text-amber"> tab ≤ ink × spot</code>.
                  Un oracle comprometido colapsa el invariante de solvencia.
                </div>
              </div>
              <div className="keypoint" style={{ borderLeftColor: 'var(--accent-green)' }}>
                <span className="keypoint-icon">✅</span>
                <div>
                  <strong>Mitigación:</strong> Emergency Shutdown (GSM), Debt Ceilings por ilk,
                  Oracle Security Module (OSM) con 1h delay, y Governance Security Module.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
