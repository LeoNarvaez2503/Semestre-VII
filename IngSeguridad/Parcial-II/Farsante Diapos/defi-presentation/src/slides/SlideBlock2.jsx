/**
 * SlideBlock2 — El Motor de DeFi: AMMs y Uniswap V3
 * Fuentes: whitepaper-v3.md, Understanding Automated Market-Makers
 * Expositor 2
 */

import React, { useState, useEffect } from 'react';

// Simulated tick bitmap — 16 columns × 2 rows = 32 ticks
// 1 = initialized tick (has liquidity), 0 = uninitialized
const INITIAL_BITMAP = [
  0,0,1,0,0,0,1,0,0,1,0,0,0,0,1,0,
  0,1,0,0,1,0,0,0,0,0,1,0,0,1,0,0,
];

const CURRENT_TICK = 8; // "cursor" position

export default function SlideBlock2() {
  const [bitmap, setBitmap] = useState(INITIAL_BITMAP);
  const [scanning, setScanning] = useState(false);
  const [scanPos, setScanPos] = useState(-1);
  const [foundTick, setFoundTick] = useState(null);
  const [algorithm, setAlgorithm] = useState('bitmap'); // 'linear' | 'bitmap'

  const runLinearScan = () => {
    setAlgorithm('linear');
    setScanning(true);
    setFoundTick(null);
    let i = CURRENT_TICK + 1;
    const interval = setInterval(() => {
      setScanPos(i);
      if (bitmap[i] === 1) {
        setFoundTick(i);
        setScanning(false);
        clearInterval(interval);
      }
      i++;
      if (i >= bitmap.length) {
        setScanning(false);
        clearInterval(interval);
      }
    }, 160);
  };

  const runBitmapLookup = () => {
    setAlgorithm('bitmap');
    setScanning(true);
    setFoundTick(null);
    setScanPos(-1);
    setTimeout(() => {
      // Simulate O(1): find next set bit after CURRENT_TICK via word mask
      const next = bitmap.findIndex((v, i) => i > CURRENT_TICK && v === 1);
      setFoundTick(next);
      setScanning(false);
    }, 400);
  };

  const reset = () => {
    setScanPos(-1);
    setFoundTick(null);
    setScanning(false);
  };

  return (
    <section id="bloque-2" className="slide slide-anchor">
      {/* ---- Header ---- */}
      <div className="slide-header">
        <div className="slide-number">
          <div className="slide-number-badge">02</div>
          <span className="slide-presenter">Expositor 2</span>
        </div>
        <div className="slide-title-group">
          <p className="slide-eyebrow">Motor matemático de intercambio descentralizado</p>
          <h2 className="slide-title">AMMs — Uniswap V3 & Liquidez Concentrada</h2>
          <p className="slide-subtitle">
            Cómo la ecuación de producto constante se extiende con rangos de precio discretizados en Ticks,
            y cómo el Tick Bitmap reduce la búsqueda del siguiente rango de liquidez de O(n) a O(1).
          </p>
        </div>
        <div className="flex gap-sm" style={{ flexShrink: 0 }}>
          <span className="badge badge-blue">Uniswap V3 §6</span>
          <span className="badge badge-cyan">AMM Whitepaper</span>
        </div>
      </div>

      {/* ---- Equations Row ---- */}
      <div className="content-grid content-grid-3 mb-lg">
        <div className="equation-box">
          <div className="equation-label">Fórmula Base — CFMM (V1/V2)</div>
          <div style={{ fontSize: '1.4rem', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
            x · y = k
          </div>
          <p className="text-xs text-muted" style={{ marginTop: '8px', textAlign: 'left' }}>
            x, y = reservas de token. k = constante. Liquidez distribuida en (0, ∞).
            Ineficiente: capital inactivo fuera del precio de mercado.
          </p>
        </div>

        <div className="equation-box" style={{ borderColor: 'var(--accent-secondary)', borderLeftColor: 'var(--accent-secondary)' }}>
          <div className="equation-label">V3 — Liquidez Concentrada en Rango [p_a, p_b]</div>
          <div style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
            (x + L/√p_b)(y + L·√p_a) = L²
          </div>
          <p className="text-xs text-muted" style={{ marginTop: '8px', textAlign: 'left' }}>
            Traslación de la curva V2. L = √(xy) = liquidez virtual.
            Capital activo <strong className="text-cyan">sólo en [p_a, p_b]</strong>.
          </p>
        </div>

        <div className="equation-box" style={{ borderColor: 'var(--accent-green)', borderLeftColor: 'var(--accent-green)' }}>
          <div className="equation-label">Tick → Precio (EVM int24)</div>
          <div style={{ fontSize: '1rem', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
            p(i) = 1.0001^i
          </div>
          <p className="text-xs text-muted" style={{ marginTop: '8px', textAlign: 'left' }}>
            Cada tick = 0.01% de movimiento de precio (1 basis point).
            El contrato almacena √P (sqrtPriceX96) en Q64.96 fixed-point.
          </p>
        </div>
      </div>

      {/* ---- Main Grid ---- */}
      <div className="content-grid content-grid-2">
        {/* Left: Tick Bitmap Interactive */}
        <div className="card card-glow">
          <div className="card-header">
            <span className="card-icon">🗺️</span>
            <span className="card-title">Tick Bitmap — Demostración Interactiva</span>
          </div>

          <div className="flex gap-sm mb-md" style={{ flexWrap: 'wrap' }}>
            <div className="flex items-center gap-sm">
              <div className="bitmap-cell active" style={{ width: '24px', height: '24px', display: 'inline-flex' }}>1</div>
              <span className="text-xs text-secondary">Tick inicializado (tiene liquidez)</span>
            </div>
            <div className="flex items-center gap-sm">
              <div className="bitmap-cell inactive" style={{ width: '24px', height: '24px', display: 'inline-flex' }}>0</div>
              <span className="text-xs text-secondary">Tick vacío</span>
            </div>
            <div className="flex items-center gap-sm">
              <div className="bitmap-cell current" style={{ width: '24px', height: '24px', display: 'inline-flex' }}>▶</div>
              <span className="text-xs text-secondary">Posición actual del precio</span>
            </div>
          </div>

          {/* Bitmap visual */}
          <div style={{ background: 'var(--bg-void)', borderRadius: 'var(--radius-md)', padding: '12px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              tickBitmap[wordPos] — word de 256 bits (mostrando 32 bits):
            </div>
            <div className="bitmap-grid">
              {bitmap.map((bit, i) => {
                const isCurrent = i === CURRENT_TICK;
                const isScanning = i === scanPos && algorithm === 'linear';
                const isFound = i === foundTick;

                let cls = 'bitmap-cell ';
                if (isCurrent) cls += 'current';
                else if (isFound) cls += 'current';
                else if (isScanning) cls += 'active';
                else if (bit === 1) cls += 'active';
                else cls += 'inactive';

                return (
                  <div key={i} className={cls}
                    style={{
                      background: isFound ? 'rgba(52,211,153,0.3)' :
                                  isScanning ? 'rgba(251,191,36,0.2)' : undefined,
                      borderColor: isFound ? 'var(--accent-green)' :
                                   isScanning ? 'var(--accent-amber)' : undefined,
                      transform: isFound ? 'scale(1.2)' : undefined,
                    }}>
                    {isCurrent ? '▶' : bit}
                  </div>
                );
              })}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: '6px', display: 'flex', justifyContent: 'space-between' }}>
              <span>Tick 0</span>
              <span>Tick {CURRENT_TICK} (precio actual ▶)</span>
              <span>Tick 31</span>
            </div>
          </div>

          {/* Status */}
          {foundTick !== null && (
            <div style={{ marginTop: '10px', padding: '8px 12px', background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: '8px' }}>
              <span className="text-mono text-xs text-green">
                ✅ Siguiente tick inicializado encontrado: <strong>tick #{foundTick}</strong>{' '}
                {algorithm === 'bitmap' ? '→ O(1) con operación bit' : `→ O(n): ${foundTick - CURRENT_TICK} iteraciones`}
              </span>
            </div>
          )}

          {/* Controls */}
          <div className="flex gap-sm mt-md" style={{ flexWrap: 'wrap' }}>
            <button id="btn-linear-scan" onClick={runLinearScan} disabled={scanning}
              style={{
                padding: '8px 16px',
                background: scanning ? 'var(--bg-elevated)' : 'rgba(251,191,36,0.1)',
                border: '1px solid rgba(251,191,36,0.4)',
                borderRadius: '8px',
                color: 'var(--accent-amber)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                cursor: scanning ? 'not-allowed' : 'pointer',
                fontWeight: '700',
              }}>
              {scanning && algorithm === 'linear' ? '⏳ Escaneando...' : '▶ Simular O(n) — Scan Lineal'}
            </button>
            <button id="btn-bitmap-lookup" onClick={runBitmapLookup} disabled={scanning}
              style={{
                padding: '8px 16px',
                background: scanning ? 'var(--bg-elevated)' : 'rgba(52,211,153,0.1)',
                border: '1px solid rgba(52,211,153,0.4)',
                borderRadius: '8px',
                color: 'var(--accent-green)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                cursor: scanning ? 'not-allowed' : 'pointer',
                fontWeight: '700',
              }}>
              {scanning && algorithm === 'bitmap' ? '⚡ Resolviendo...' : '⚡ Simular O(1) — Bitmap Lookup'}
            </button>
            <button id="btn-reset" onClick={reset}
              style={{
                padding: '8px 16px',
                background: 'transparent',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                cursor: 'pointer',
              }}>
              ↺ Reset
            </button>
          </div>
        </div>

        {/* Right: Implementation detail */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          {/* Code: nextInitializedTickWithinOneWord */}
          <div className="card">
            <div className="card-header">
              <span className="card-icon">💻</span>
              <span className="card-title">Implementación — tickBitmap.sol</span>
            </div>
            <div className="code-block">
              <div className="code-block-header">
                <div className="code-dots">
                  <div className="code-dot red" /><div className="code-dot amber" /><div className="code-dot green" />
                </div>
                <span className="code-lang">Solidity — TickBitmap.sol (Uniswap V3)</span>
              </div>
              <div className="code-content">
                <pre>
{`<span class="cm">/// @dev Encuentra el siguiente tick inicializado</span>
<span class="cm">/// dentro del mismo word (256 ticks) — O(1)</span>
<span class="kw">function</span> <span class="fn">nextInitializedTickWithinOneWord</span>(
  <span class="tp">mapping</span>(<span class="tp">int16</span> => <span class="tp">uint256</span>) <span class="kw">storage</span> self,
  <span class="tp">int24</span>  tick,
  <span class="tp">int24</span>  tickSpacing,
  <span class="tp">bool</span>   lte
) <span class="kw">internal</span> <span class="kw">view</span> <span class="kw">returns</span> (<span class="tp">int24</span> next, <span class="tp">bool</span> initialized) {
  <span class="tp">int24</span> compressed = tick / tickSpacing;

  <span class="kw">if</span> (lte) {
    (<span class="tp">int16</span> wordPos, <span class="tp">uint8</span> bitPos) = position(compressed);
    <span class="cm">// Máscara: todos los bits ≤ bitPos</span>
    <span class="tp">uint256</span> mask = (1 << bitPos) - 1 + (1 << bitPos);
    <span class="tp">uint256</span> masked = self[wordPos] & mask;

    initialized = masked != 0;
    <span class="cm">// msb() → Most Significant Bit — O(1)</span>
    next = initialized
      ? (compressed - <span class="tp">int24</span>(bitPos - <span class="fn">msb</span>(masked))) * tickSpacing
      : (compressed - <span class="tp">int24</span>(bitPos)) * tickSpacing;
  } <span class="kw">else</span> {
    (<span class="tp">int16</span> wordPos, <span class="tp">uint8</span> bitPos) = position(compressed + 1);
    <span class="tp">uint256</span> mask = ~((1 << bitPos) - 1);
    <span class="tp">uint256</span> masked = self[wordPos] & mask;

    initialized = masked != 0;
    <span class="cm">// lsb() → Least Significant Bit — O(1)</span>
    next = initialized
      ? (compressed + 1 + <span class="tp">int24</span>(<span class="fn">lsb</span>(masked) - bitPos)) * tickSpacing
      : (compressed + 1 + <span class="tp">int24</span>(type(<span class="tp">uint8</span>).max - bitPos)) * tickSpacing;
  }
}`}
                </pre>
              </div>
            </div>
          </div>

          {/* Complexity comparison */}
          <div className="card">
            <div className="card-header">
              <span className="card-icon">📊</span>
              <span className="card-title">Comparativa de Complejidad</span>
            </div>
            <table className="defi-table">
              <thead>
                <tr><th>Enfoque</th><th>Complejidad</th><th>Costo en Gas</th><th>Descripción</th></tr>
              </thead>
              <tbody>
                <tr className="danger-row">
                  <td><span className="text-mono fw-bold">Loop lineal</span></td>
                  <td><span className="badge badge-red">O(n)</span></td>
                  <td>2100 × n (SLOAD)</td>
                  <td>Escaneo tick por tick</td>
                </tr>
                <tr className="success-row">
                  <td><span className="text-mono fw-bold">tickBitmap</span></td>
                  <td><span className="badge badge-green">O(1) por word</span></td>
                  <td>1 SLOAD + msb/lsb</td>
                  <td>Operación bit en uint256</td>
                </tr>
                <tr>
                  <td><span className="text-mono fw-bold">Cross-word</span></td>
                  <td><span className="badge badge-amber">O(log n)</span></td>
                  <td>k × SLOAD (k words)</td>
                  <td>Múltiples words del bitmap</td>
                </tr>
              </tbody>
            </table>
            <div className="separator" />
            <div className="keypoints">
              <div className="keypoint">
                <span className="keypoint-icon">🧮</span>
                <div>
                  <strong>Un word uint256 = 256 ticks.</strong> Con tickSpacing=60 y rango de precio práctico,
                  la mayoría de swaps requieren <em>menos de 5 cross-tick</em>, cada uno resuelto en O(1).
                </div>
              </div>
              <div className="keypoint">
                <span className="keypoint-icon">💰</span>
                <div>
                  <strong>Impacto en Gas:</strong> Sin bitmap, un swap cruzando 10 ticks haría 10 SLOAD = 21,000 gas.
                  Con bitmap: 1-2 SLOAD (~4,200 gas). <strong className="text-green">80% de ahorro</strong>.
                </div>
              </div>
            </div>
          </div>

          {/* Architecture summary */}
          <div className="card">
            <div className="card-header">
              <span className="card-icon">🏗️</span>
              <span className="card-title">Arquitectura de Contratos Uniswap V3</span>
            </div>
            <div className="flow-row" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center' }}>
                <div className="flow-node cyan">Router</div>
                <span className="flow-label">Periphery</span>
              </div>
              <span className="flow-arrow">→</span>
              <div style={{ textAlign: 'center' }}>
                <div className="flow-node primary">Factory</div>
                <span className="flow-label">Core</span>
              </div>
              <span className="flow-arrow">→</span>
              <div style={{ textAlign: 'center' }}>
                <div className="flow-node primary">Pool</div>
                <span className="flow-label">Core (CFMM)</span>
              </div>
              <span className="flow-arrow">↔</span>
              <div style={{ textAlign: 'center' }}>
                <div className="flow-node green">tickBitmap</div>
                <span className="flow-label">Library</span>
              </div>
            </div>
            <p className="text-sm text-secondary mt-md">
              El contrato <code className="text-mono text-cyan">Pool</code> mantiene:
              el estado global (<code className="text-mono">Slot0</code>),
              el <code className="text-mono">tickBitmap</code>,
              el mapping de ticks individuales (<code className="text-mono">ticks</code>),
              y el mapping de posiciones de LPs (<code className="text-mono">positions</code>).
              Todo diseñado para minimizar SLOADs mediante packing y bitmaps.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
