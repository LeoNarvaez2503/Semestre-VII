/**
 * SlideBlock1 — La Base de DeFi: La EVM como Máquina de Estados
 * Fuentes: ethereumbook, yellowpaper
 * Expositor 1
 */

import React, { useState } from 'react';
import CodeBlock from '../components/CodeBlock.jsx';

const GAS_OPCODES = [
  { opcode: 'ADD / SUB', category: 'Aritmética', gas: 3, type: 'base', impact: 'Bajo', color: 'green' },
  { opcode: 'MUL / DIV', category: 'Aritmética', gas: 5, type: 'base', impact: 'Bajo', color: 'green' },
  { opcode: 'MLOAD', category: 'Memoria', gas: 3, type: 'memory', impact: 'Bajo', color: 'cyan' },
  { opcode: 'MSTORE', category: 'Memoria', gas: 3, type: 'memory', impact: 'Bajo', color: 'cyan' },
  { opcode: 'SLOAD', category: '💀 Storage (Leer)', gas: 2100, type: 'storage', impact: 'Muy Alto', color: 'amber' },
  { opcode: 'SSTORE (frío)', category: '💀 Storage (Escribir)', gas: 22100, type: 'storage', impact: '¡CRÍTICO!', color: 'red' },
  { opcode: 'SSTORE (cálido)', category: '💀 Storage (Reescribir)', gas: 5000, type: 'storage', impact: 'Alto', color: 'amber' },
  { opcode: 'CALL', category: 'Mensaje externo', gas: 2600, type: 'call', impact: 'Alto', color: 'purple' },
  { opcode: 'DELEGATECALL', category: 'Llamada delegada (Proxy)', gas: 2600, type: 'call', impact: 'Alto', color: 'purple' },
  { opcode: 'KECCAK256', category: 'Hash', gas: '30 + 6/word', type: 'hash', impact: 'Medio', color: 'blue' },
  { opcode: 'LOG0-LOG4', category: 'Eventos', gas: '375 + data', type: 'log', impact: 'Medio', color: 'blue' },
  { opcode: 'CREATE', category: 'Deploy contrato', gas: 32000, type: 'create', impact: '¡CRÍTICO!', color: 'red' },
];

const BADGE_COLORS = {
  green: 'badge-green',
  cyan: 'badge-cyan',
  amber: 'badge-amber',
  red: 'badge-red',
  purple: 'badge-purple',
  blue: 'badge-blue',
};

export default function SlideBlock1() {
  const [hovered, setHovered] = useState(null);

  return (
    <section id="bloque-1" className="slide slide-anchor">
      {/* ---- Header ---- */}
      <div className="slide-header">
        <div className="slide-number">
          <div className="slide-number-badge">01</div>
          <span className="slide-presenter">Expositor 1</span>
        </div>
        <div className="slide-title-group">
          <p className="slide-eyebrow">Fundamentos de infraestructura DeFi</p>
          <h2 className="slide-title">La EVM como Máquina de Estados Global</h2>
          <p className="slide-subtitle">
            El backend distribuido que hace posible DeFi: cómo el modelo de ejecución de la EVM,
            sus opcodes y el sistema de Gas dictan el diseño de cada protocolo financiero descentralizado.
          </p>
        </div>
        <div className="flex gap-sm" style={{ flexShrink: 0 }}>
          <span className="badge badge-blue">Yellowpaper §9</span>
          <span className="badge badge-cyan">Ethereumbook</span>
        </div>
      </div>

      {/* ---- Metrics row ---- */}
      <div className="metrics-row mb-lg">
        <div className="metric-card">
          <div className="metric-value text-accent">256-bit</div>
          <div className="metric-label">Tamaño de palabra EVM</div>
        </div>
        <div className="metric-card">
          <div className="metric-value text-green">1.024</div>
          <div className="metric-label">Profundidad de stack máxima</div>
        </div>
        <div className="metric-card">
          <div className="metric-value text-amber">30M</div>
          <div className="metric-label">Gas limit por bloque (~2025)</div>
        </div>
        <div className="metric-card">
          <div className="metric-value text-red">22,100</div>
          <div className="metric-label">Gas por SSTORE (cold write)</div>
        </div>
        <div className="metric-card">
          <div className="metric-value" style={{ color: 'var(--accent-purple)' }}>~7,375x</div>
          <div className="metric-label">SSTORE vs ADD (ratio de costo)</div>
        </div>
      </div>

      {/* ---- Main Grid ---- */}
      <div className="content-grid content-grid-2-1">
        {/* Left: Gas Table */}
        <div>
          <div className="card card-glow">
            <div className="card-header">
              <span className="card-icon">⛽</span>
              <span className="card-title">Tabla Comparativa de Costos de Gas por Opcode</span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="defi-table">
                <thead>
                  <tr>
                    <th>Opcode</th>
                    <th>Categoría</th>
                    <th>Gas (EIP-2929)</th>
                    <th>Impacto DeFi</th>
                  </tr>
                </thead>
                <tbody>
                  {GAS_OPCODES.map((row, i) => (
                    <tr
                      key={i}
                      className={
                        row.type === 'storage' && row.gas >= 20000 ? 'danger-row' :
                        row.type === 'create'  ? 'danger-row' :
                        row.type === 'storage' ? 'highlight-row' : ''
                      }
                      onMouseEnter={() => setHovered(i)}
                      onMouseLeave={() => setHovered(null)}
                      style={{ cursor: 'default' }}
                    >
                      <td>
                        <span className="text-mono fw-bold">{row.opcode}</span>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>{row.category}</td>
                      <td>
                        <span className="text-mono fw-bold"
                          style={{ color: row.color === 'red' ? 'var(--accent-red)' :
                                        row.color === 'amber' ? 'var(--accent-amber)' :
                                        row.color === 'green' ? 'var(--accent-green)' :
                                        row.color === 'cyan' ? 'var(--accent-secondary)' :
                                        row.color === 'purple' ? 'var(--accent-purple)' :
                                        'var(--accent-primary)' }}>
                          {row.gas.toLocaleString()}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${BADGE_COLORS[row.color]}`}>{row.impact}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: '12px', padding: '10px', background: 'rgba(248,113,113,0.06)', borderRadius: '8px', border: '1px solid rgba(248,113,113,0.2)' }}>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                <strong style={{ color: 'var(--accent-red)' }}>⚠ Regla de Oro en DeFi:</strong>{' '}
                Un <code className="text-mono" style={{ color: 'var(--accent-amber)' }}>SSTORE</code> cuesta
                ~7,375× más que un <code className="text-mono" style={{ color: 'var(--accent-green)' }}>ADD</code>.
                Por eso los protocolos como Uniswap V3 <em>empaquetan</em> múltiples valores en un solo slot de 32 bytes (bit-packing),
                y Aave usa mappings estructurados para minimizar escrituras a storage.
              </p>
            </div>
          </div>

          {/* EVM State Transition */}
          <div className="card mt-md">
            <div className="card-header">
              <span className="card-icon">🔄</span>
              <span className="card-title">EVM: Modelo de Transición de Estado</span>
            </div>
            <div className="equation-box mb-md">
              <div className="equation-label">Yellowpaper §2 — Formalización del Estado Global</div>
              <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                σ<sub>t+1</sub> ≡ Υ(σ<sub>t</sub>, T)
              </div>
              <p className="text-xs text-muted" style={{ marginTop: '6px', textAlign: 'left' }}>
                Donde <strong>σ</strong> = estado mundial (World State), <strong>T</strong> = transacción válida,
                <strong> Υ</strong> = función de transición de estado de la EVM.
                Cada llamada a un protocolo DeFi es una transición atómica.
              </p>
            </div>

            {/* Execution Model */}
            <div className="section-label">Modelo de Ejecución de Contrato DeFi</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[
                { step: 'TX', label: 'Transacción firmada llega al nodo', color: 'cyan' },
                { step: 'INTRINSIC', label: 'Chequeo de gas intrínseco (21,000 base)', color: 'blue' },
                { step: 'EXECUTE', label: 'EVM carga bytecode del contrato DeFi', color: 'primary' },
                { step: 'STACK OPS', label: 'Push/Pop opcodes: ADD, MUL, LT, JUMPI…', color: 'primary' },
                { step: 'SLOAD/SSTORE', label: '⚠ Accesos a Persistent Storage — costoso', color: 'amber' },
                { step: 'CALL/DelegateCall', label: 'Interop entre protocolos (composability)', color: 'purple' },
                { step: 'REVERT / STOP', label: 'Estado confirmado ó rollback atómico', color: 'green' },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-sm" style={{ fontSize: '0.78rem' }}>
                  <span
                    className={`badge badge-${s.color === 'primary' ? 'blue' : s.color === 'cyan' ? 'cyan' : s.color === 'amber' ? 'amber' : s.color === 'purple' ? 'purple' : s.color === 'green' ? 'green' : 'blue'}`}
                    style={{ minWidth: '100px', justifyContent: 'center' }}
                  >
                    {s.step}
                  </span>
                  <span className="text-secondary">→</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Key concepts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          {/* Storage Architecture */}
          <div className="card">
            <div className="card-header">
              <span className="card-icon">🗄️</span>
              <span className="card-title">Arquitectura de Almacenamiento EVM</span>
            </div>
            <div className="keypoints">
              {[
                {
                  icon: '⚡',
                  title: 'Stack (Gratuito)',
                  desc: '16 slots de 32 bytes. LIFO. Costo mínimo. Toda operación DeFi usa el stack como memoria de trabajo.'
                },
                {
                  icon: '🧠',
                  title: 'Memory (Volátil)',
                  desc: 'RAM de la EVM. Se expande dinámicamente (costo cuadrático). Descartada al finalizar la ejecución del contrato.'
                },
                {
                  icon: '💎',
                  title: 'Storage (Persistente & Caro)',
                  desc: 'Trie de Merkle-Patricia. 2^256 slots de 32 bytes. Persiste entre transacciones. SSTORE cold = 22,100 gas. Es la "base de datos" de cada protocolo DeFi.'
                },
                {
                  icon: '📜',
                  title: 'Calldata (Read-only)',
                  desc: 'Datos de entrada de la TX. ~4 gas/byte (no-zero). Uniswap V3 optimiza codificando parámetros de swap en calldata en lugar de memory.'
                },
              ].map((kp, i) => (
                <div key={i} className="keypoint">
                  <span className="keypoint-icon">{kp.icon}</span>
                  <div>
                    <strong>{kp.title}:</strong>{' '}
                    <span>{kp.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Code: Slot Packing */}
          <div className="card">
            <div className="card-header">
              <span className="card-icon">💡</span>
              <span className="card-title">Optimización DeFi: Bit-Packing en Slot</span>
            </div>
            <CodeBlock lang="Solidity — UniswapV3Pool.sol">{`<span class="cm">// ✅ 1 solo SLOAD lee los 4 valores</span>
<span class="cm">// Empaquetados en 1 slot de 32 bytes</span>
<span class="kw">struct</span> <span class="tp">Slot0</span> {
  <span class="cm">// Precio actual (160 bits)</span>
  <span class="tp">uint160</span> sqrtPriceX96;
  <span class="cm">// Tick actual (24 bits)</span>
  <span class="tp">int24</span>   tick;
  <span class="cm">// Índice de observación del oráculo (16 bits)</span>
  <span class="tp">uint16</span>  observationIndex;
  <span class="cm">// Cardinalidad del oráculo (16 bits)</span>
  <span class="tp">uint16</span>  observationCardinality;
  <span class="cm">// Protocolo fee (8 bits)</span>
  <span class="tp">uint8</span>   feeProtocol;
  <span class="cm">// Reentrancy guard (8 bits)</span>
  <span class="tp">bool</span>    unlocked; <span class="cm">// Reentrancy guard (8 bits)</span>
}

<span class="cm">// ❌ ANTI-PATRÓN: 4 variables separadas = 4 SSTORE</span>
<span class="tp">uint160</span> <span class="kw">public</span> sqrtPriceX96; <span class="cm">// slot 0</span>
<span class="tp">int24</span>   <span class="kw">public</span> tick;           <span class="cm">// slot 1</span>
<span class="tp">uint16</span>  <span class="kw">public</span> observIdx;      <span class="cm">// slot 2</span>
<span class="tp">bool</span>    <span class="kw">public</span> unlocked;       <span class="cm">// slot 3</span>`}</CodeBlock>
            <p className="text-sm text-secondary mt-sm">
              Ahorro: <strong className="text-green">3 SSTORE evitados</strong> = ~66,300 gas menos por swap.
              A $0.01/gas y 1M swaps/día → <strong className="text-amber">$663,000 ahorrados diariamente</strong>.
            </p>
          </div>

          {/* Gas Economics */}
          <div className="card">
            <div className="card-header">
              <span className="card-icon">📐</span>
              <span className="card-title">Por qué Storage dicta el diseño DeFi</span>
            </div>
            <div className="keypoints">
              <div className="keypoint">
                <span className="keypoint-icon">🏦</span>
                <div>
                  <strong>Maker Vaults:</strong> El estado de cada Vault (deuda, colateral, tasa) debe leerse/escribirse
                  en storage. Maker minimiza SSTORE mediante un <em>contrato central "Vat"</em> que agrupa todo el estado.
                </div>
              </div>
              <div className="keypoint">
                <span className="keypoint-icon">⚡</span>
                <div>
                  <strong>Aave V3:</strong> Empaqueta configuración de reservas en una sola variable{' '}
                  <code className="text-mono text-amber">ReserveConfigurationMap</code> (256 bits) → 1 SLOAD
                  en lugar de 8 lecturas separadas.
                </div>
              </div>
              <div className="keypoint">
                <span className="keypoint-icon">🗺️</span>
                <div>
                  <strong>Uniswap V3:</strong> El <code className="text-mono text-cyan">tickBitmap</code> usa
                  uint256 para representar 256 ticks → búsqueda en O(1) evitando loops de SLOAD.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
