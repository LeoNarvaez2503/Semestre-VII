---
theme: seriph
colorSchema: dark
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: Arquitectura de Software en DeFi
titleTemplate: '%s — Defensa Técnica'
fonts:
  sans: Inter
  mono: JetBrains Mono
routerMode: hash
---

<!-- ═══════════════════════════════════════════════
     SLIDE 1 — PORTADA
     ═══════════════════════════════════════════════ -->

<div class="cover-bg"></div>

<div class="abs-tl m-12">
  <span class="badge badge-blue">Ingeniería de Software · Universidad</span>
</div>

# Arquitectura de Software<br>en **DeFi**

<p style="color:#94a3b8; font-size:1.05rem; max-width:60ch; margin: 1rem 0 2rem">
  Cómo la arquitectura de software resuelve los problemas financieros<br>
  mediante protocolos descentralizados — desde la EVM hasta la verificación formal.
</p>

<div class="grid-4" style="max-width: 600px; margin-bottom: 2rem">
  <div class="metric"><div class="metric-value">6</div><div class="metric-label">Expositores</div></div>
  <div class="metric"><div class="metric-value">60</div><div class="metric-label">Minutos</div></div>
  <div class="metric"><div class="metric-value">6</div><div class="metric-label">Protocolos</div></div>
  <div class="metric"><div class="metric-value">27</div><div class="metric-label">Slides</div></div>
</div>

<div style="display:flex; gap: 8px; flex-wrap: wrap">
  <span class="badge badge-blue">Ethereum EVM</span>
  <span class="badge badge-cyan">Uniswap V3</span>
  <span class="badge badge-blue">MakerDAO</span>
  <span class="badge badge-purple">Aave V3</span>
  <span class="badge badge-amber">Chainlink</span>
  <span class="badge badge-green">Foundry · Certora</span>
</div>

---

<!-- ═══════════════════════════════════════════════
     SLIDE 2 — AGENDA
     ═══════════════════════════════════════════════ -->

# Agenda — 60 Minutos · 6 Bloques

<div class="grid-2" style="gap: 1.25rem; margin-top: 1rem">

<div>

<div class="card card-glow" style="margin-bottom: 10px">
  <div style="display:flex; align-items:center; gap:10px">
    <span style="font-size:1.5rem; font-family:var(--font-mono); font-weight:800; color:#6382ff">01</span>
    <div>
      <div style="font-weight:700; color:#e2e8f0">EVM como Máquina de Estados</div>
      <div style="font-size:0.72rem; color:#64748b">Gas · Storage · Opcodes · EIP-2929 · Expositor 1</div>
    </div>
  </div>
</div>

<div class="card" style="margin-bottom: 10px">
  <div style="display:flex; align-items:center; gap:10px">
    <span style="font-size:1.5rem; font-family:var(--font-mono); font-weight:800; color:#38bdf8">02</span>
    <div>
      <div style="font-weight:700; color:#e2e8f0">AMMs — Uniswap V3</div>
      <div style="font-size:0.72rem; color:#64748b">x·y=k · Liquidez Concentrada · Tick Bitmap · Expositor 2</div>
    </div>
  </div>
</div>

<div class="card" style="margin-bottom: 10px">
  <div style="display:flex; align-items:center; gap:10px">
    <span style="font-size:1.5rem; font-family:var(--font-mono); font-weight:800; color:#34d399">03</span>
    <div>
      <div style="font-weight:700; color:#e2e8f0">Composability — Money Legos</div>
      <div style="font-size:0.72rem; color:#64748b">MakerDAO Vaults · Vat.sol · Aave · Expositor 3</div>
    </div>
  </div>
</div>

</div>

<div>

<div class="card" style="margin-bottom: 10px">
  <div style="display:flex; align-items:center; gap:10px">
    <span style="font-size:1.5rem; font-family:var(--font-mono); font-weight:800; color:#fbbf24">04</span>
    <div>
      <div style="font-weight:700; color:#e2e8f0">Oráculos & Flash Loans</div>
      <div style="font-size:0.72rem; color:#64748b">Chainlink DON · Atomicidad · REVERT · Expositor 4</div>
    </div>
  </div>
</div>

<div class="card" style="margin-bottom: 10px">
  <div style="display:flex; align-items:center; gap:10px">
    <span style="font-size:1.5rem; font-family:var(--font-mono); font-weight:800; color:#a78bfa">05</span>
    <div>
      <div style="font-weight:700; color:#e2e8f0">Upgrade Patterns — El Patrón Proxy</div>
      <div style="font-size:0.72rem; color:#64748b">delegatecall · EIP-1967 · UUPS · Transparent · Expositor 5</div>
    </div>
  </div>
</div>

<div class="card" style="margin-bottom: 10px">
  <div style="display:flex; align-items:center; gap:10px">
    <span style="font-size:1.5rem; font-family:var(--font-mono); font-weight:800; color:#f472b6">06</span>
    <div>
      <div style="font-weight:700; color:#e2e8f0">QA & Verificación Formal</div>
      <div style="font-size:0.72rem; color:#64748b">Foundry · Certora CVL · Invariant Tests · E2E · Expositor 6</div>
    </div>
  </div>
</div>

</div>

</div>

---
layout: section
---

<div style="font-family:var(--font-mono); font-size:0.8rem; color:#6382ff; text-transform:uppercase; letter-spacing:0.14em; margin-bottom:0.5rem">
  Expositor 1 · Fundamentos
</div>

# Bloque 01
## La EVM como Máquina de Estados Global

<p style="color:#64748b; margin-top:0.75rem">El backend distribuido de DeFi</p>

---

<!-- ═══════════════════════════════════════════════
     SLIDE 4 — EVM Arquitectura
     ═══════════════════════════════════════════════ -->

# La EVM — Estado Global y Modelo de Ejecución

<div class="grid-2" style="margin-top: 0.75rem; gap: 1.25rem">

<div>

<div class="eq-box" style="margin-bottom: 1rem">
  <div class="eq-label">Yellowpaper §2 — Transición de Estado</div>
  <div style="font-size: 1.3rem; font-family: var(--font-mono); color: #e2e8f0">
    σ<sub>t+1</sub> ≡ Υ(σ<sub>t</sub>, T)
  </div>
  <div style="font-size: 0.72rem; color: #64748b; margin-top: 6px">
    σ = World State · T = TX válida · Υ = función de transición EVM
  </div>
</div>

<div class="mono-label">Capas de almacenamiento EVM</div>

<div class="kp">⚡ <div><strong style="color:#e2e8f0">Stack</strong> — 1024 slots × 32 bytes. LIFO. Sin costo extra. Memoria de trabajo de toda operación DeFi.</div></div>
<div class="kp amber">🧠 <div><strong style="color:#e2e8f0">Memory</strong> — RAM volátil. Costo cuadrático al expandirse. Descartada al final de la call.</div></div>
<div class="kp red">💎 <div><strong style="color:#e2e8f0">Storage</strong> — Trie Merkle-Patricia. 2<sup>256</sup> slots × 32 bytes. Persiste entre TXs. <strong style="color:#f87171">SSTORE cold = 22,100 gas.</strong></div></div>
<div class="kp green">📜 <div><strong style="color:#e2e8f0">Calldata</strong> — Parámetros de TX. Read-only. ~4 gas/byte. Uniswap V3 lo maximiza para ahorrar storage.</div></div>

</div>

<div>

<div class="mono-label">Pipeline de ejecución DeFi</div>
<div style="display:flex; flex-direction:column; gap:5px">

<div v-click style="display:flex; align-items:center; gap:8px; padding:7px 10px; background:var(--bg-elevated); border-radius:7px; border-left:2px solid #38bdf8; font-size:0.78rem">
  <span class="badge badge-cyan" style="min-width:90px;justify-content:center">TX</span>
  <span style="color:#94a3b8">Transacción firmada llega al nodo</span>
</div>
<div v-click style="display:flex; align-items:center; gap:8px; padding:7px 10px; background:var(--bg-elevated); border-radius:7px; border-left:2px solid #6382ff; font-size:0.78rem">
  <span class="badge badge-blue" style="min-width:90px;justify-content:center">INTRINSIC</span>
  <span style="color:#94a3b8">Chequeo gas base (21,000) + calldata</span>
</div>
<div v-click style="display:flex; align-items:center; gap:8px; padding:7px 10px; background:var(--bg-elevated); border-radius:7px; border-left:2px solid #6382ff; font-size:0.78rem">
  <span class="badge badge-blue" style="min-width:90px;justify-content:center">BYTECODE</span>
  <span style="color:#94a3b8">EVM carga bytecode del contrato DeFi</span>
</div>
<div v-click style="display:flex; align-items:center; gap:8px; padding:7px 10px; background:var(--bg-elevated); border-radius:7px; border-left:2px solid #fbbf24; font-size:0.78rem">
  <span class="badge badge-amber" style="min-width:90px;justify-content:center">SLOAD/SSTORE</span>
  <span style="color:#94a3b8">⚠ Accesos a Storage — operación más costosa</span>
</div>
<div v-click style="display:flex; align-items:center; gap:8px; padding:7px 10px; background:var(--bg-elevated); border-radius:7px; border-left:2px solid #a78bfa; font-size:0.78rem">
  <span class="badge badge-purple" style="min-width:90px;justify-content:center">CALL/DELEGATE</span>
  <span style="color:#94a3b8">Interop entre protocolos (composability)</span>
</div>
<div v-click style="display:flex; align-items:center; gap:8px; padding:7px 10px; background:var(--bg-elevated); border-radius:7px; border-left:2px solid #34d399; font-size:0.78rem">
  <span class="badge badge-green" style="min-width:90px;justify-content:center">STOP/REVERT</span>
  <span style="color:#94a3b8">Estado confirmado ó rollback atómico total</span>
</div>

</div>

<div style="margin-top:0.75rem; padding: 8px 12px; background: rgba(248,113,113,0.06); border: 1px solid rgba(248,113,113,0.2); border-radius:8px; font-size:0.78rem; color:#94a3b8">
  <strong style="color:#f87171">Regla de oro DeFi:</strong> Cada llamada a un protocolo es una transición atómica del estado mundial.
  Si algo falla → REVERT completo, sin efectos parciales.
</div>

</div>

</div>

---

<!-- ═══════════════════════════════════════════════
     SLIDE 5 — Gas Opcodes Table
     ═══════════════════════════════════════════════ -->

# Gas Economics — ¿Por qué Storage dicta el diseño DeFi?

<div class="grid-4" style="margin-bottom: 0.75rem">
  <div class="metric"><div class="metric-value" style="color:#6382ff">256-bit</div><div class="metric-label">Palabra EVM</div></div>
  <div class="metric"><div class="metric-value" style="color:#34d399">1,024</div><div class="metric-label">Profundidad stack</div></div>
  <div class="metric"><div class="metric-value" style="color:#f87171">22,100</div><div class="metric-label">SSTORE cold (gas)</div></div>
  <div class="metric"><div class="metric-value" style="color:#fbbf24">~7,375×</div><div class="metric-label">SSTORE vs ADD</div></div>
</div>

<table class="defi-table">
  <thead><tr><th>Opcode</th><th>Categoría</th><th>Gas (EIP-2929)</th><th>Impacto en DeFi</th></tr></thead>
  <tbody>
    <tr><td><code>ADD / SUB</code></td><td>Aritmética</td><td>3</td><td><span class="badge badge-green">Insignificante</span></td></tr>
    <tr><td><code>MLOAD / MSTORE</code></td><td>Memoria</td><td>3</td><td><span class="badge badge-green">Bajo</span></td></tr>
    <tr><td><code>KECCAK256</code></td><td>Hash</td><td>30 + 6/word</td><td><span class="badge badge-cyan">Medio</span></td></tr>
    <tr><td><code>CALL / DELEGATECALL</code></td><td>Interop entre contratos</td><td>2,600</td><td><span class="badge badge-blue">Alto</span></td></tr>
    <tr class="row-amber"><td><code>SLOAD</code></td><td>💀 Storage (Leer)</td><td>2,100</td><td><span class="badge badge-amber">Muy Alto</span></td></tr>
    <tr class="row-red"><td><code>SSTORE (frío)</code></td><td>💀 Storage (Escribir)</td><td>22,100</td><td><span class="badge badge-red">¡CRÍTICO!</span></td></tr>
    <tr class="row-red"><td><code>CREATE</code></td><td>Deploy de contrato</td><td>32,000</td><td><span class="badge badge-red">¡CRÍTICO!</span></td></tr>
  </tbody>
</table>

<div class="grid-2" style="margin-top: 0.75rem; gap: 0.75rem">
<div class="kp">🏦 <div><strong style="color:#e2e8f0">Maker (Vat.sol):</strong> agrupa todo el estado en un contrato central → minimiza SSTORE entre calls.</div></div>
<div class="kp green">🗺️ <div><strong style="color:#e2e8f0">Uniswap V3:</strong> <code>tickBitmap</code> packs 256 ticks en 1 uint256 → O(1) SLOAD en lugar de N lecturas.</div></div>
</div>

---

<!-- ═══════════════════════════════════════════════
     SLIDE 6 — Bit-Packing en Storage
     ═══════════════════════════════════════════════ -->

# Bit-Packing — Optimización de Storage en DeFi

<div class="grid-2" style="margin-top: 0.75rem; gap: 1.25rem">

<div>

<div class="mono-label">✅ Uniswap V3 — Slot0 (1 SLOAD lee todo)</div>

```solidity
// Un solo slot de 32 bytes contiene 4 valores
struct Slot0 {
  uint160 sqrtPriceX96;       // Precio √ (160 bits)
  int24   tick;               // Tick actual  (24 bits)
  uint16  observationIndex;   // Índice oracle (16 bits)
  uint16  observationCardinality; // (16 bits)
  uint16  observationCardinalityNext;
  uint8   feeProtocol;        // Fee protocolo (8 bits)
  bool    unlocked;           // Reentrancy guard (8 bits)
}
// Total: 160+24+16+16+16+8+8 = 248 bits < 256 bits ✓
// = 1 solo SLOAD para leer el estado completo del pool
```

</div>

<div>

<div class="mono-label">❌ Anti-patrón — 4 SSTORE separados</div>

```solidity
// 4 variables = 4 slots de storage = 4 SLOAD/SSTORE
uint160 public sqrtPriceX96;  // slot 0  ← 22,100 gas
int24   public tick;          // slot 1  ← 22,100 gas
uint16  public observIdx;     // slot 2  ← 22,100 gas
bool    public unlocked;      // slot 3  ← 22,100 gas
// TOTAL escritura inicial: 88,400 gas
// vs Slot0 empaquetado:    22,100 gas ← 75% ahorro
```

<div class="card card-green" style="margin-top: 0.75rem; font-size: 0.8rem">
  <div style="display:flex; gap:6px; align-items:center; margin-bottom:4px">
    <span class="badge badge-green">Ahorro real</span>
    <strong style="color:#34d399">3 SSTORE evitados = ~66,300 gas por swap</strong>
  </div>
  <div style="color:#64748b">
    A escala de Uniswap V3 (1M swaps/día):<br>
    → <strong style="color:#fbbf24">$663,000 ahorrados diariamente</strong> en gas colectivo de usuarios
  </div>
</div>

<div class="kp amber" style="margin-top: 0.5rem">📐 <div><strong style="color:#e2e8f0">Aave V3</strong> empaqueta toda la config de una reserva en <code>ReserveConfigurationMap</code> (256 bits) → 1 SLOAD en lugar de 8 lecturas separadas.</div></div>

</div>

</div>

---
layout: section
---

<div style="font-family:var(--font-mono); font-size:0.8rem; color:#38bdf8; text-transform:uppercase; letter-spacing:0.14em; margin-bottom:0.5rem">
  Expositor 2 · Motor matemático de intercambio
</div>

# Bloque 02
## AMMs — Uniswap V3 & Liquidez Concentrada

<p style="color:#64748b; margin-top:0.75rem">Del producto constante a los rangos de precio discretizados</p>

---

<!-- ═══════════════════════════════════════════════
     SLIDE 8 — CFMM x*y=k vs V3
     ═══════════════════════════════════════════════ -->

# AMMs — Del Producto Constante a Liquidez Concentrada

<div class="grid-3" style="margin-top: 0.75rem; gap: 1rem">

<div class="eq-box">
  <div class="eq-label">CFMM Clásico — V1/V2</div>
  <div style="font-size:1.5rem; font-family:var(--font-mono); color:#e2e8f0; margin: 0.5rem 0">x · y = k</div>
  <div style="font-size:0.72rem; color:#64748b">
    x, y = reservas de token<br>
    k = constante invariante<br>
    Liquidez distribuida en (0, ∞)<br>
    <strong style="color:#f87171">Capital inactivo fuera del precio de mercado</strong>
  </div>
</div>

<div class="eq-box" style="border-color:rgba(56,189,248,0.4); border-left-color:#38bdf8">
  <div class="eq-label">V3 — Liquidez Concentrada en [p_a, p_b]</div>
  <div style="font-size:0.95rem; font-family:var(--font-mono); color:#e2e8f0; margin: 0.5rem 0">
    (x + L/√p_b)(y + L·√p_a) = L²
  </div>
  <div style="font-size:0.72rem; color:#64748b">
    L = √(xy) = liquidez virtual<br>
    Traslación de la curva V2<br>
    Capital activo <strong style="color:#38bdf8">sólo en [p_a, p_b]</strong><br>
    ~4,000x más eficiente en stablecoin pairs
  </div>
</div>

<div class="eq-box" style="border-color:rgba(52,211,153,0.4); border-left-color:#34d399">
  <div class="eq-label">Tick → Precio (EVM int24)</div>
  <div style="font-size:1.3rem; font-family:var(--font-mono); color:#e2e8f0; margin: 0.5rem 0">
    p(i) = 1.0001<sup>i</sup>
  </div>
  <div style="font-size:0.72rem; color:#64748b">
    Cada tick = 0.01% de movimiento<br>
    (1 basis point exacto)<br>
    Precio almacenado como √P<br>
    en formato <code>Q64.96 fixed-point</code>
  </div>
</div>

</div>

<div class="grid-2" style="margin-top: 0.75rem; gap: 0.75rem">

<div class="kp">
  📐 <div>
    <strong style="color:#e2e8f0">sqrtPriceX96</strong> — El precio se almacena como √(price) × 2⁹⁶ en un entero de 160 bits
    para evitar división en la EVM y mantener precisión. Toda la aritmética del pool opera sobre raíces cuadradas.
  </div>
</div>

<div class="kp green">
  💡 <div>
    <strong style="color:#e2e8f0">Posición LP = NFT (ERC-721)</strong> en V3.
    Cada LP tiene su propio rango [tickLower, tickUpper].
    El contrato <code>NonfungiblePositionManager</code> gestiona los NFTs de posición.
  </div>
</div>

</div>

---

<!-- ═══════════════════════════════════════════════
     SLIDE 9 — Tick Bitmap Interactivo
     ═══════════════════════════════════════════════ -->

# Tick Bitmap — Búsqueda O(n) → O(1)

<div class="grid-2" style="margin-top: 0.75rem; gap: 1.25rem">

<div>

<div class="mono-label">Problema: ¿Cómo encontrar el siguiente tick inicializado?</div>

<div class="card card-glow">
  <BitMapViz />
</div>

</div>

<div>

<div class="mono-label">Implementación — nextInitializedTickWithinOneWord</div>

```solidity
function nextInitializedTickWithinOneWord(
  mapping(int16 => uint256) storage self,
  int24  tick,
  int24  tickSpacing,
  bool   lte        // buscar hacia abajo o arriba
) internal view returns (int24 next, bool initialized) {
  int24 compressed = tick / tickSpacing;

  if (lte) {
    (int16 wordPos, uint8 bitPos) = position(compressed);
    // Máscara: todos los bits ≤ bitPos
    uint256 mask = (1 << bitPos) - 1 + (1 << bitPos);
    uint256 masked = self[wordPos] & mask;

    initialized = masked != 0;
    // msb() = Most Significant Bit — O(1) ⚡
    next = initialized
      ? (compressed - int24(bitPos - msb(masked))) * tickSpacing
      : (compressed - int24(bitPos)) * tickSpacing;
  }
  // else: usa lsb() para buscar hacia arriba
}
```

<div class="card card-amber" style="margin-top: 0.75rem; font-size: 0.78rem">
  <div style="display:flex; gap: 1rem">
    <div style="text-align:center; padding: 0 1rem">
      <div style="font-family:var(--font-mono); color:#f87171; font-size:1.1rem; font-weight:700">O(n)</div>
      <div style="color:#64748b; font-size:0.65rem">SLOAD × ticks</div>
    </div>
    <div style="color:#64748b; align-self:center; font-size:1.2rem">→</div>
    <div style="text-align:center; padding: 0 1rem">
      <div style="font-family:var(--font-mono); color:#34d399; font-size:1.1rem; font-weight:700">O(1)</div>
      <div style="color:#64748b; font-size:0.65rem">1 SLOAD + msb/lsb</div>
    </div>
    <div style="color:#64748b; align-self:center; font-size:0.78rem">Un word = 256 ticks<br>en 1 SLOAD</div>
  </div>
</div>

</div>

</div>

---

<!-- ═══════════════════════════════════════════════
     SLIDE 10 — Uniswap V3 Arquitectura
     ═══════════════════════════════════════════════ -->

# Uniswap V3 — Arquitectura de Contratos

<div class="grid-2" style="margin-top: 0.75rem; gap: 1.25rem">

<div>

<div class="mono-label">Separación Core / Periphery</div>

<div style="display:flex; flex-direction:column; gap:8px">

<div class="card card-glow">
  <div style="font-family:var(--font-mono); font-size:0.72rem; color:#a78bfa; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:6px">Periphery (sin upgrade)</div>
  <div style="display:flex; gap:6px; flex-wrap:wrap">
    <span class="badge badge-purple">SwapRouter02</span>
    <span class="badge badge-purple">NonfungiblePositionManager</span>
    <span class="badge badge-purple">QuoterV2</span>
  </div>
</div>

<div style="text-align:center; color:#4b5680">↕ IUniswapV3Pool interface</div>

<div class="card">
  <div style="font-family:var(--font-mono); font-size:0.72rem; color:#6382ff; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:6px">Core (inmutable)</div>
  <div style="display:flex; gap:6px; flex-wrap:wrap">
    <span class="badge badge-blue">UniswapV3Factory</span>
    <span class="badge badge-blue">UniswapV3Pool</span>
  </div>
</div>

<div style="text-align:center; color:#4b5680">↕ Libraries</div>

<div class="card">
  <div style="font-family:var(--font-mono); font-size:0.72rem; color:#34d399; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:6px">Libraries on-chain</div>
  <div style="display:flex; gap:6px; flex-wrap:wrap">
    <span class="badge badge-green">TickBitmap</span>
    <span class="badge badge-green">TickMath</span>
    <span class="badge badge-green">SwapMath</span>
    <span class="badge badge-green">SqrtPriceMath</span>
    <span class="badge badge-green">Oracle</span>
  </div>
</div>

</div>

</div>

<div>

<div class="mono-label">Estado interno del Pool</div>

<div class="card" style="font-family: var(--font-mono); font-size: 0.72rem; margin-bottom: 0.75rem">

<div class="slot-row">
  <span class="slot-addr">slot[0]</span>
  <div class="slot-bar" style="background: rgba(99,130,255,0.15); border: 1px solid rgba(99,130,255,0.3); color:#6382ff">Slot0 { sqrtPriceX96, tick, observationIndex... }</div>
</div>
<div class="slot-row">
  <span class="slot-addr">mapping</span>
  <div class="slot-bar" style="background: rgba(52,211,153,0.1); border: 1px solid rgba(52,211,153,0.25); color:#34d399">tickBitmap[int16 → uint256] — 256 ticks por word</div>
</div>
<div class="slot-row">
  <span class="slot-addr">mapping</span>
  <div class="slot-bar" style="background: rgba(56,189,248,0.1); border: 1px solid rgba(56,189,248,0.25); color:#38bdf8">ticks[int24 → Info] — liquidityGross, liquidityNet, fees</div>
</div>
<div class="slot-row">
  <span class="slot-addr">mapping</span>
  <div class="slot-bar" style="background: rgba(167,139,250,0.1); border: 1px solid rgba(167,139,250,0.25); color:#a78bfa">positions[bytes32 → Position] — LP positions</div>
</div>
<div class="slot-row">
  <span class="slot-addr">array</span>
  <div class="slot-bar" style="background: rgba(251,191,36,0.1); border: 1px solid rgba(251,191,36,0.25); color:#fbbf24">observations[1024] — TWAP Oracle circular buffer</div>
</div>

</div>

<table class="defi-table">
  <thead><tr><th>Fee Tier</th><th>tickSpacing</th><th>Uso típico</th></tr></thead>
  <tbody>
    <tr><td><code>0.01%</code></td><td>1</td><td>Stablecoins (USDC/DAI)</td></tr>
    <tr class="row-primary"><td><code>0.05%</code></td><td>10</td><td>Pares correlacionados</td></tr>
    <tr class="row-primary"><td><code>0.30%</code></td><td>60</td><td>ETH/USDC, pares principales</td></tr>
    <tr><td><code>1.00%</code></td><td>200</td><td>Activos exóticos / volátiles</td></tr>
  </tbody>
</table>

</div>

</div>

---
layout: section
---

<div style="font-family:var(--font-mono); font-size:0.8rem; color:#34d399; text-transform:uppercase; letter-spacing:0.14em; margin-bottom:0.5rem">
  Expositor 3 · Arquitectura de protocolos interdependientes
</div>

# Bloque 03
## Composability — Los Money Legos de DeFi

<p style="color:#64748b; margin-top:0.75rem">Interdependencia de estado entre protocolos autónomos</p>

---

<!-- ═══════════════════════════════════════════════
     SLIDE 12 — Maker Vault Architecture
     ═══════════════════════════════════════════════ -->

# MakerDAO MCD — Arquitectura del Contrato Vat

<div class="grid-2" style="margin-top: 0.75rem; gap: 1.25rem">

<div>

<div class="mono-label">El Vat — Contrato Contable Central</div>

```solidity
// Vat.sol — Estado de todos los Vaults en 1 contrato
mapping (bytes32 => Ilk)                public ilks;  // config por colateral
mapping (bytes32 => mapping (address => Urn)) public urns;  // Vault state
mapping (bytes32 => mapping (address => uint)) public gem;  // colateral libre
mapping (address => uint256) public dai;  // DAI interno
mapping (address => uint256) public sin;  // Deuda del sistema
uint256 public debt; // DAI total en circulación
uint256 public vice; // Deuda incobrable total

// Operación central: modificar deuda y colateral
function frob(bytes32 i, address u, address v, address w,
              int dink, int dart) external {
  Urn memory urn = urns[i][u];
  Ilk memory ilk = ilks[i];
  urn.ink = _add(urn.ink, dink); // colateral
  urn.art = _add(urn.art, dart); // deuda en unidades
  // Invariante de solvencia:
  require(mul(urn.art, ilk.rate) <= mul(urn.ink, ilk.spot),
    "Vat/not-safe"); // REVERT si sub-colateralizado
}
```

</div>

<div>

<div class="mono-label">Parámetros de Riesgo por Colateral (ilk)</div>

<table class="defi-table" style="margin-bottom: 0.75rem">
  <thead><tr><th>Param</th><th>Tipo</th><th>Función</th></tr></thead>
  <tbody>
    <tr><td><code>line</code></td><td><span class="badge badge-blue">uint256</span></td><td>Debt Ceiling (DAI máx)</td></tr>
    <tr><td><code>dust</code></td><td><span class="badge badge-blue">uint256</span></td><td>Vault mínimo (anti-spam)</td></tr>
    <tr class="row-amber"><td><code>mat</code></td><td><span class="badge badge-amber">ray</span></td><td>Liquidation Ratio</td></tr>
    <tr><td><code>duty</code></td><td><span class="badge badge-purple">ray</span></td><td>Stability Fee (tasa continua)</td></tr>
    <tr class="row-red"><td><code>chop</code></td><td><span class="badge badge-red">wad</span></td><td>Liquidation Penalty</td></tr>
  </tbody>
</table>

<div class="mono-label">Contratos del sistema MCD</div>
<div style="display:grid; grid-template-columns: 1fr 1fr; gap:5px; font-size:0.72rem">

<div v-click class="card" style="padding: 6px 10px">
  <div style="font-family:var(--font-mono); font-weight:700; color:#6382ff">Jug.sol</div>
  <div style="color:#64748b">Accrual de Stability Fee</div>
</div>
<div v-click class="card" style="padding: 6px 10px">
  <div style="font-family:var(--font-mono); font-weight:700; color:#f87171">Dog.sol</div>
  <div style="color:#64748b">Liquidación de Vaults</div>
</div>
<div v-click class="card" style="padding: 6px 10px">
  <div style="font-family:var(--font-mono); font-weight:700; color:#fbbf24">Spot.sol</div>
  <div style="color:#64748b">Precios desde oracle OSM</div>
</div>
<div v-click class="card" style="padding: 6px 10px">
  <div style="font-family:var(--font-mono); font-weight:700; color:#34d399">Join.sol</div>
  <div style="color:#64748b">Bridge ERC-20 → Vat</div>
</div>
<div v-click class="card" style="padding: 6px 10px">
  <div style="font-family:var(--font-mono); font-weight:700; color:#a78bfa">Flap/Flop</div>
  <div style="color:#64748b">Subastas surplus/debt</div>
</div>
<div v-click class="card" style="padding: 6px 10px">
  <div style="font-family:var(--font-mono); font-weight:700; color:#38bdf8">DSProxy</div>
  <div style="color:#64748b">Proxy del usuario</div>
</div>

</div>

</div>

</div>

---

<!-- ═══════════════════════════════════════════════
     SLIDE 13 — Money Legos Diagrama
     ═══════════════════════════════════════════════ -->

# Composability — Money Legos en 1 Transacción Atómica

<div class="grid-2" style="margin-top: 0.75rem; gap: 1.25rem">

<div>

<div class="mono-label">Flujo de composición DeFi</div>

<div style="display:flex; flex-direction:column; align-items:center">

<div class="proto-box" style="border-color: rgba(52,211,153,0.4); background: rgba(52,211,153,0.05); width:100%">
  <span class="proto-icon">👤</span>
  <div>
    <div class="proto-name" style="color:#34d399">Usuario (EOA / Smart Wallet)</div>
    <div class="proto-desc">Posee colateral: ETH, WBTC, stETH...</div>
  </div>
</div>

<div class="conn-arrow">↓<br><span class="conn-token">⚡ Deposita colateral</span></div>

<div class="proto-box" style="width:100%">
  <span class="proto-icon">🏦</span>
  <div>
    <div class="proto-name" style="color:#6382ff">MakerDAO Vault (Urn)</div>
    <div class="proto-desc"><code>frob(ETH-A, +ink, +dart)</code> → mint DAI · Colateral > 150% · Stability Fee accrúa</div>
  </div>
</div>

<div class="conn-arrow">↓<br><span class="conn-token">🪙 DAI sintético</span></div>

<div class="proto-box" style="border-color: rgba(167,139,250,0.4); background: rgba(167,139,250,0.05); width:100%">
  <span class="proto-icon">👻</span>
  <div>
    <div class="proto-name" style="color:#a78bfa">Aave V3 Pool</div>
    <div class="proto-desc"><code>supply(DAI) → aDAI</code> · Interest-bearing receipt token · Usable como colateral</div>
  </div>
</div>

<div class="conn-arrow">↓<br><span class="conn-token">🏷 aDAI</span></div>

<div class="proto-box" style="border-color: rgba(56,189,248,0.4); background: rgba(56,189,248,0.05); width:100%">
  <span class="proto-icon">🦄</span>
  <div>
    <div class="proto-name" style="color:#38bdf8">Uniswap V3 Pool</div>
    <div class="proto-desc"><code>mint(aDAI/USDC, [tickL, tickU])</code> → NFT LP · Fees por swap en el rango</div>
  </div>
</div>

</div>

</div>

<div>

<div class="mono-label">Riesgos de Composability</div>

<div class="kp red" style="margin-bottom: 8px">
  🔗 <div>
    <strong style="color:#f87171">Interdependencia de Estado:</strong> Si Aave pausa un activo,
    todos los protocolos que lo usan como colateral aguas arriba fallan en cascada.
    El "systemic risk" es proporcional al nivel de composición.
  </div>
</div>

<div class="kp amber" style="margin-bottom: 8px">
  📊 <div>
    <strong style="color:#fbbf24">Oracle Dependency:</strong> Maker necesita feeds de precio
    para calcular <code>tab ≤ ink × spot</code>.
    Un oracle comprometido colapsa el invariante de solvencia del sistema.
  </div>
</div>

<div class="kp green">
  ✅ <div>
    <strong style="color:#34d399">Mitigaciones:</strong>
    Emergency Shutdown (GSM · 72h delay), Debt Ceilings por ilk,
    Oracle Security Module (OSM · 1h delay), Governance Security Module.
  </div>
</div>

<div class="card" style="margin-top: 0.75rem; font-size:0.78rem; color:#94a3b8">
  <strong style="color:#e2e8f0">Clave arquitectónica:</strong> La composability es posible porque los contratos ERC-20/ERC-721
  son <em>interfaces estándar</em>. Cualquier protocolo que produce un token conforme puede ser
  consumido por cualquier otro sin coordinación previa — es la "web de servicios" de DeFi.
</div>

</div>

</div>

---
layout: section
---

<div style="font-family:var(--font-mono); font-size:0.8rem; color:#fbbf24; text-transform:uppercase; letter-spacing:0.14em; margin-bottom:0.5rem">
  Expositor 4 · Middleware e Infraestructura crítica
</div>

# Bloque 04
## Oráculos & Flash Loans — Atomicidad DeFi

<p style="color:#64748b; margin-top:0.75rem">Primitivas sin análogo en finanzas tradicionales</p>

---

<!-- ═══════════════════════════════════════════════
     SLIDE 15 — Oracles Architecture
     ═══════════════════════════════════════════════ -->

# Oráculos — Middleware de Datos Off-Chain

<div class="grid-2" style="margin-top: 0.75rem; gap: 1.25rem">

<div>

<div class="mono-label">Arquitectura Chainlink DON</div>

<div style="display:flex; flex-direction:column; gap:6px; background: #040810; border-radius:10px; padding: 12px; border: 1px solid var(--border-subtle)">

<div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:4px">
  <div style="background:var(--bg-elevated); border-radius:5px; padding:5px; text-align:center; font-size:0.65rem; color:#64748b">CEX-A<br>Binance</div>
  <div style="background:var(--bg-elevated); border-radius:5px; padding:5px; text-align:center; font-size:0.65rem; color:#64748b">CEX-B<br>Coinbase</div>
  <div style="background:var(--bg-elevated); border-radius:5px; padding:5px; text-align:center; font-size:0.65rem; color:#64748b">DEX<br>Uniswap</div>
</div>

<div style="text-align:center; color:#4b5680; font-size:0.72rem">↓ precios off-chain</div>

<div style="background:rgba(251,191,36,0.06); border:1px solid rgba(251,191,36,0.25); border-radius:8px; padding:8px; text-align:center">
  <span class="badge badge-amber">Chainlink Oracle Network (21+ nodos)</span>
  <div style="font-size:0.67rem; color:#64748b; margin-top:4px">Cada nodo firma su reporte on-chain → mediana ponderada = feed</div>
</div>

<div style="text-align:center; color:#4b5680; font-size:0.72rem">↓ latestRoundData()</div>

<div style="background:rgba(99,130,255,0.06); border:1px solid rgba(99,130,255,0.25); border-radius:8px; padding:8px; text-align:center">
  <span class="badge badge-blue">Oracle Security Module (Maker · 1h delay)</span>
  <div style="font-size:0.67rem; color:#64748b; margin-top:4px">Buffer: precio comprometido detectable antes de liquidaciones masivas</div>
</div>

<div style="text-align:center; color:#4b5680; font-size:0.72rem">↓ Spot.poke()</div>

<div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:4px">
  <div style="border:1px solid rgba(99,130,255,0.3); border-radius:5px; padding:5px; text-align:center; font-size:0.65rem; color:#6382ff">Maker Vat<br>liquidación</div>
  <div style="border:1px solid rgba(167,139,250,0.3); border-radius:5px; padding:5px; text-align:center; font-size:0.65rem; color:#a78bfa">Aave Pool<br>LTV check</div>
  <div style="border:1px solid rgba(52,211,153,0.3); border-radius:5px; padding:5px; text-align:center; font-size:0.65rem; color:#34d399">Compound<br>collateral</div>
</div>

</div>

</div>

<div>

<table class="defi-table" style="margin-bottom: 0.75rem">
  <thead><tr><th>Tipo</th><th>Fuente</th><th>Uso DeFi</th><th>Riesgo</th></tr></thead>
  <tbody>
    <tr class="row-primary"><td><code>Chainlink DON</code></td><td>Off-chain</td><td>Maker, Aave, Compound</td><td>Centralización nodos</td></tr>
    <tr class="row-green"><td><code>TWAP V3</code></td><td>On-chain pool</td><td>Anti flash-loan</td><td>Liquidez insuficiente</td></tr>
    <tr><td><code>Pyth Network</code></td><td>Pull oracle</td><td>Perps, Options</td><td>Latencia publicación</td></tr>
    <tr class="row-red"><td><code>Spot Price V2</code></td><td>Pool (1 bloque)</td><td>Obsoleto</td><td>Flash loan attack ⚠</td></tr>
  </tbody>
</table>

<div class="mono-label">TWAP — Precio ponderado por tiempo (Uniswap V3)</div>

```solidity
// Oracle.sol — Observación circular buffer (1024 entradas)
struct Observation {
  uint32  blockTimestamp;      // Timestamp del bloque
  int56   tickCumulative;      // Suma acumulada de ticks
  uint160 secondsPerLiquidityCumulativeX128;
  bool    initialized;
}

// TWAP a 30 minutos: resistente a manipulación 1 bloque
// Costo manipular TWAP = capital × tiempo × costo-oportunidad
```

<div class="kp" style="margin-top: 0.5rem">🛡 <div>Manipular TWAP de 30 min requiere controlar el precio durante ese tiempo, lo que cuesta <strong style="color:#fbbf24">más gas del que generaría el ataque</strong>.</div></div>

</div>

</div>

---

<!-- ═══════════════════════════════════════════════
     SLIDE 16 — Flash Loans
     ═══════════════════════════════════════════════ -->

# Flash Loans — Préstamos sin Colateral en 1 TX Atómica

<div class="grid-2" style="margin-top: 0.75rem; gap: 1.25rem">

<div>

<FlashLoanFlow />

</div>

<div>

<div class="mono-label">Implementación — Aave V3 Pool.sol</div>

```solidity {all|8-10|13-16|18-22|all}
function _executeFlashLoanSimple(
  address receiverAddress, address asset,
  uint256 amount, bytes calldata params,
  uint256 flashLoanPremiumTotal
) internal {
  // 1. Snapshot del balance ANTES
  uint256 balanceBefore = IERC20(asset).balanceOf(address(this));
  // Fee = 0.05% del monto (FLASHLOAN_PREMIUM)
  uint256 premium = amount.percentMul(flashLoanPremiumTotal);

  // 2. Transfiere fondos al receptor
  IERC20(asset).safeTransfer(receiverAddress, amount);

  // 3. Receptor ejecuta lógica DeFi arbitraria
  require(
    IFlashLoanSimpleReceiver(receiverAddress)
      .executeOperation(asset, amount, premium, msg.sender, params),
    "FL:executionFailed"
  );

  // 4. ⚠️ EL CHEQUEO CRÍTICO — debe pasar o REVERT total
  require(
    IERC20(asset).balanceOf(address(this)) >= balanceBefore + premium,
    "FL:balanceMismatch" // 💥 REVERT → rollback TOTAL del estado
  );
}
```

<div class="grid-2" style="gap: 0.5rem; margin-top: 0.5rem">
<div class="kp green"><span style="color:#34d399">✓</span> Arbitraje sin capital previo</div>
<div class="kp green"><span style="color:#34d399">✓</span> Auto-liquidación de Vaults</div>
<div class="kp red"><span style="color:#f87171">⚠</span> Oracle manipulation (V2 spot)</div>
<div class="kp amber"><span style="color:#fbbf24">★</span> Posible solo por atomicidad EVM</div>
</div>

</div>

</div>

---
layout: section
---

<div style="font-family:var(--font-mono); font-size:0.8rem; color:#a78bfa; text-transform:uppercase; letter-spacing:0.14em; margin-bottom:0.5rem">
  Expositor 5 · Actualizabilidad en producción
</div>

# Bloque 05
## Upgrade Patterns — El Patrón Proxy

<p style="color:#64748b; margin-top:0.75rem">Separar lógica de estado para actualizar código sin migrar TVL</p>

---

<!-- ═══════════════════════════════════════════════
     SLIDE 18 — Proxy Pattern Architecture
     ═══════════════════════════════════════════════ -->

# El Patrón Proxy — delegatecall & Contexto de Ejecución

<div class="grid-2" style="margin-top: 0.75rem; gap: 1.25rem">

<div>

<div class="mono-label">¿Por qué los contratos necesitan upgrades?</div>

<div class="kp red" style="margin-bottom: 6px">🐛 <div><strong style="color:#e2e8f0">Bugs post-deploy:</strong> Un smart contract inmutable con un bug puede inmovilizar millones. Sin proxy, la única solución es migrar todo el TVL.</div></div>
<div class="kp amber" style="margin-bottom: 6px">📈 <div><strong style="color:#e2e8f0">Features nuevos:</strong> Nuevos fee tiers, nuevas pools, integraciones. Los usuarios no deben cambiar de dirección.</div></div>
<div class="kp green" style="margin-bottom: 12px">✅ <div><strong style="color:#e2e8f0">Solución:</strong> Separar <em>lógica</em> (upgradeable) de <em>estado</em> (permanente) usando <code>delegatecall</code>.</div></div>

<div class="mono-label">delegatecall vs call normal</div>

<table class="defi-table">
  <thead><tr><th></th><th>CALL</th><th>DELEGATECALL</th></tr></thead>
  <tbody>
    <tr><td>Ejecuta código de</td><td>Contrato B</td><td>Contrato B</td></tr>
    <tr class="row-primary"><td>msg.sender</td><td>Proxy (A)</td><td>Usuario original</td></tr>
    <tr class="row-primary"><td>Storage usado</td><td>Contrato B</td><td>Proxy (A) ✓</td></tr>
    <tr class="row-primary"><td>msg.value</td><td>Nuevo valor</td><td>Original</td></tr>
    <tr><td>Gas</td><td>2,600</td><td>2,600</td></tr>
  </tbody>
</table>

<div class="card card-glow" style="margin-top: 0.75rem; font-size: 0.78rem">
  <strong>Clave:</strong> El código de la <em>implementación</em> corre en el <em>storage del proxy</em>.
  El proxy mantiene el TVL ($, balances, reserves), la implementación sólo tiene la lógica.
</div>

</div>

<div>

<div class="mono-label">Anatomy de un Proxy — fallback function</div>

```solidity
// Proxy.sol — Corazón del patrón
// Todo call que no coincide con función del proxy
// se delega a la implementación actual
fallback() external payable {
  _delegate(_implementation());
}

function _delegate(address implementation) internal virtual {
  assembly {
    // 1. Copiar calldata (parámetros del usuario)
    calldatacopy(0, 0, calldatasize())

    // 2. delegatecall: ejecuta lógica de 'implementation'
    //    pero CON el storage y context del PROXY
    let result := delegatecall(
      gas(),           // todo el gas disponible
      implementation,  // donde está la LÓGICA
      0,               // calldata start
      calldatasize(),  // calldata length
      0, 0             // returndata (tamaño desconocido aún)
    )
    // 3. Devolver el resultado tal cual
    returndatacopy(0, 0, returndatasize())
    switch result
    case 0 { revert(0, returndatasize()) }
    default { return(0, returndatasize()) }
  }
}
```

</div>

</div>

---

<!-- ═══════════════════════════════════════════════
     SLIDE 19 — EIP-1967 Storage Slots
     ═══════════════════════════════════════════════ -->

# EIP-1967 — Storage Slots Estandarizados para Proxies

<div class="grid-2" style="margin-top: 0.75rem; gap: 1.25rem">

<div>

<div class="mono-label">El problema: Storage Collision</div>

```solidity
// ❌ Proxy ingenuo: la variable del compilador en slot 0
// colisiona con la variable del contrato de lógica
contract NaiveProxy {
  address public _implementation; // ← slot 0
  // ...
}

contract Implementation {
  address public owner; // ← slot 0 también! COLISIÓN 💥
  // delegatecall escribe el address del owner
  // donde el proxy guardaba la implementation...
}
```

<div class="card card-red" style="margin-top: 0.75rem; font-size:0.78rem">
  <strong style="color:#f87171">Impacto real:</strong> Una collision puede hacer que el protocolo lea como "implementation" el valor de una variable de usuario.
  Vulnerabilidad crítica en múltiples protocolos 2020-2021.
</div>

<div class="mono-label" style="margin-top:0.75rem">✅ Solución EIP-1967: offset keccak256 - 1</div>

```solidity
// La "magia": usar un hash específico como slot
// Es virtualmente imposible que Solidity colisione aquí
bytes32 internal constant _IMPLEMENTATION_SLOT =
  bytes32(uint256(keccak256("eip1967.proxy.implementation")) - 1);
//  = 0x360894a13ba1a3210667c828492db98dca3e2076...

bytes32 internal constant _ADMIN_SLOT =
  bytes32(uint256(keccak256("eip1967.proxy.admin")) - 1);
//  = 0xb53127684a568b3173ae13b9f8a6016e243e63b6...
```

</div>

<div>

<div class="mono-label">Patrones de Proxy en DeFi — Comparativa</div>

<div class="card" style="margin-bottom: 8px">
  <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px">
    <div><span class="badge badge-blue">Transparent Proxy</span> <span style="font-size:0.65rem; color:#64748b">OpenZeppelin · EIP-1967</span></div>
    <span class="badge badge-amber">~2,700 gas overhead/call</span>
  </div>
  <div style="font-size:0.72rem; color:#94a3b8">Admin separado que no puede llamar al proxy como usuario. Evita selector clashing. Adoptado por Aave V2/V3.</div>
</div>

<div class="card" style="margin-bottom: 8px">
  <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px">
    <div><span class="badge badge-green">UUPS Proxy</span> <span style="font-size:0.65rem; color:#64748b">EIP-1822 · Menor gas</span></div>
    <span class="badge badge-green">~2,000 gas overhead/call</span>
  </div>
  <div style="font-size:0.72rem; color:#94a3b8">Lógica de upgrade en la implementación. Riesgo: olvidar incluir upgradeability en V2 → proxy permanentemente locked.</div>
</div>

<div class="card">
  <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px">
    <div><span class="badge badge-purple">Beacon Proxy</span> <span style="font-size:0.65rem; color:#64748b">EIP-1967 · Múltiples proxies</span></div>
    <span class="badge badge-red">~3,200 gas overhead/call</span>
  </div>
  <div style="font-size:0.72rem; color:#94a3b8">1 upgrade actualiza N proxies a la vez. Ideal para fábricas (Uniswap Factory pattern). Extra hop: proxy → beacon → impl.</div>
</div>

<div class="kp" style="margin-top: 0.75rem">🌐 <div><strong style="color:#e2e8f0">Caso Real:</strong> USDS (MakerDAO Sky) usa <code>ERC1967Proxy</code>. Aave V3: todos los Pool, aTokens y VariableDebtTokens son proxies actualizables mediante governance.</div></div>

</div>

</div>

---

<!-- ═══════════════════════════════════════════════
     SLIDE 20 — Storage Layout Collision Warning
     ═══════════════════════════════════════════════ -->

# Storage Layout — La Regla de Oro de los Upgrades

<div class="grid-2" style="margin-top: 0.75rem; gap: 1.25rem">

<div>

```solidity
// ── REGLA: Nunca reordenar variables entre versiones ──

// ✅ ImplV1 — Layout original
contract ProtocolV1 {
  uint256 public totalSupply; // slot 0
  address public owner;       // slot 1
  mapping(address=>uint) balances; // slot 2+
}

// ❌ ImplV2_BAD — Reordenó variables
contract ProtocolV2_BAD {
  address public owner;       // slot 0 ← COLISIÓN
  uint256 public totalSupply; // slot 1 ← SWAP
  mapping(address=>uint) balances;
  // Los 'balances' ahora leen del slot equivocado
  // EL TVL DEL PROTOCOLO ESTÁ COMPROMETIDO 💥
}

// ✅ ImplV2_SAFE — Solo añade al final
contract ProtocolV2_SAFE {
  uint256 public totalSupply; // slot 0 ✓ mismo
  address public owner;       // slot 1 ✓ mismo
  mapping(address=>uint) balances; // slot 2+ ✓
  uint256 public newFeature;  // slot nuevo al final ✓
}
```

</div>

<div>

<div class="mono-label">Herramientas de seguridad</div>

<div class="card card-glow" style="margin-bottom: 8px; font-size:0.78rem">
  <div style="font-family:var(--font-mono); font-weight:700; color:#6382ff; margin-bottom:4px">OpenZeppelin Upgrades Plugin</div>
  <div style="color:#94a3b8">Valida automáticamente storage layout compatibility entre versiones. Se integra con Hardhat y Foundry. Bloquea el deploy si hay colisión.</div>
</div>

<div class="card" style="margin-bottom: 8px; font-size:0.78rem">
  <div style="font-family:var(--font-mono); font-weight:700; color:#34d399; margin-bottom:4px">forge inspect ContractName storage-layout</div>
  <div style="color:#94a3b8">Foundry genera el layout completo de storage. Comparar el output entre V1 y V2 antes de cualquier upgrade a mainnet.</div>
</div>

<div class="card" style="margin-bottom: 0.75rem; font-size:0.78rem">
  <div style="font-family:var(--font-mono); font-weight:700; color:#fbbf24; margin-bottom:4px">StorageGap Pattern</div>
  <div style="color:#94a3b8">Reservar slots vacíos en contratos base para upgrades futuros:<br><code>uint256[50] private __gap;</code> — Permite añadir variables futuras sin collision.</div>
</div>

<div class="kp red">
  ⚠️ <div>
    <strong style="color:#f87171">Incidente real (2021):</strong>
    Un protocolo DeFi perdió $30M por una storage collision al hacer upgrade sin revisar el layout.
    El nuevo contrato leía como "balance de usuario" el slot que contenía la dirección del owner anterior.
  </div>
</div>

</div>

</div>

---
layout: section
---

<div style="font-family:var(--font-mono); font-size:0.8rem; color:#f472b6; text-transform:uppercase; letter-spacing:0.14em; margin-bottom:0.5rem">
  Expositor 6 · QA en código financiero inmutable
</div>

# Bloque 06
## Verificación Formal, Fuzzing & E2E en DeFi

<p style="color:#64748b; margin-top:0.75rem">En DeFi, un bug post-deploy puede ser permanente e irreversible</p>

---

<!-- ═══════════════════════════════════════════════
     SLIDE 22 — Foundry Invariant Testing
     ═══════════════════════════════════════════════ -->

# Foundry — Invariant Testing & Stateful Fuzzing

<div class="grid-2" style="margin-top: 0.75rem; gap: 1.25rem">

<div>

```solidity {all|1-8|10-16|18-27|all}
// test/ProtocolInvariant.t.sol
contract ProtocolInvariantTest is StdInvariant, Test {
  DefiProtocol protocol;
  Handler       handler;

  function setUp() public {
    protocol = new DefiProtocol();
    handler  = new Handler(protocol);
    // Foundry genera secuencias aleatorias
    // de llamadas (stateful fuzzing)
    targetContract(address(handler));
  }

  /// @notice INVARIANTE 1: SOLVENCIA
  /// El protocolo NUNCA puede tener más deuda
  /// que activos colateralizados — en CUALQUIER estado.
  function invariant_solvency() public view {
    assertGe(
      protocol.totalAssets(),  // colateral total
      protocol.totalDebt(),    // deuda total (DAI)
      "BREAK: Protocol insolvent!"
    );
  }

  /// @notice INVARIANTE 2: CONSERVACIÓN
  /// suma(balances) debe igualar totalSupply exactamente.
  function invariant_conservation() public view {
    assertEq(
      handler.ghost_sumBalances(),
      protocol.token().totalSupply(),
      "BREAK: Token supply mismatch!"
    );
  }
}
```

</div>

<div>

<div class="mono-label">¿Qué hace Foundry que JUnit no puede?</div>

<div class="kp purple" style="margin-bottom: 6px">
  🔬 <div><strong style="color:#a78bfa">Stateful Fuzzing:</strong> Genera miles de secuencias aleatorias de llamadas a contratos, manteniendo estado entre llamadas. Encuentra bugs que sólo aparecen después de N transacciones específicas.</div>
</div>
<div class="kp" style="margin-bottom: 6px">
  🏴 <div><strong style="color:#e2e8f0">Invariantes matemáticas:</strong> En lugar de testear casos concretos, defines propiedades que DEBEN ser ciertas en CUALQUIER estado alcanzable del sistema.</div>
</div>
<div class="kp green" style="margin-bottom: 6px">
  🍴 <div><strong style="color:#34d399">Fork de mainnet:</strong> <code>forge test --fork-url $RPC</code> — Los tests corren contra el estado real de Ethereum. Puedes testear comportamiento con datos reales.</div>
</div>
<div class="kp amber">
  🔥 <div><strong style="color:#fbbf24">Diff testing:</strong> Comparar implementaciones V1 vs V2 con los mismos inputs aleatorios. Si divergen, hay un bug.</div>
</div>

<div class="card" style="margin-top: 0.75rem; font-family: var(--font-mono); font-size:0.72rem; background:#040810; border-color:var(--border-accent)">
  <div style="color:#64748b; margin-bottom:4px"># Comando</div>
  <div style="color:#34d399">$ forge test --match-test invariant_ \</div>
  <div style="color:#34d399">    --invariant-runs 10000 \</div>
  <div style="color:#34d399">    --invariant-depth 100</div>
  <div style="color:#64748b; margin-top:6px"># Resultado en run reciente de Aave</div>
  <div style="color:#e2e8f0">✓ invariant_solvency [PASS] (10000 runs, 2.3s)</div>
  <div style="color:#e2e8f0">✓ invariant_conservation [PASS] (10000 runs, 1.8s)</div>
</div>

</div>

</div>

---

<!-- ═══════════════════════════════════════════════
     SLIDE 23 — Certora Formal Verification
     ═══════════════════════════════════════════════ -->

# Certora — Verificación Formal con CVL

<div class="grid-2" style="margin-top: 0.75rem; gap: 1.25rem">

<div>

<div class="mono-label">CVL — Certora Verification Language</div>

```text
// Diferencia con testing: Certora verifica TODOS
// los caminos de ejecución posibles, no muestras.
// Es una PRUEBA MATEMÁTICA, no estadística.

// Regla 1: No es posible mintear sin colateral suficiente
rule no_free_minting {
  env e; address user; uint256 amount;

  uint256 collateralBefore = getCollateral(user);
  uint256 debtBefore = getDebt(user);

  mint(e, user, amount);  // intentar mint

  uint256 debtAfter = getDebt(user);

  // PROBAR: si la deuda aumentó, debe haber colateral
  assert debtAfter > debtBefore =>
    collateralBefore * 100 >= debtAfter * MIN_RATIO,
    "Violación: mint sin colateral suficiente";
}

// Regla 2: No hay reentrancy posible
rule no_reentrancy {
  env e1; env e2;
  require e1.msg.sender != e2.msg.sender;
  // ... prueba que estados intermedios son consistentes
}
// → VERIFIED ✓ en 45s — Válido para TODOS los inputs posibles
```

</div>

<div>

<div class="mono-label">Diferencias clave: Testing vs Verificación Formal</div>

<table class="defi-table" style="margin-bottom: 0.75rem">
  <thead><tr><th>Dimensión</th><th>Foundry Fuzz</th><th>Certora CVL</th></tr></thead>
  <tbody>
    <tr><td>Cobertura</td><td>Estadística (N runs)</td><td><span class="badge badge-green">100% — Todos los paths</span></td></tr>
    <tr><td>Tiempo</td><td>Segundos</td><td>Minutos (SMT solver)</td></tr>
    <tr><td>Expresividad</td><td>Solidity</td><td>Lógica temporal + cuantificadores</td></tr>
    <tr><td>Garantía</td><td>"No encontró bugs"</td><td><span class="badge badge-green">PRUEBA matemática</span></td></tr>
    <tr><td>Uso en DeFi</td><td>CI/CD, desarrollo</td><td>Pre-audit, governance</td></tr>
  </tbody>
</table>

<div class="kp green" style="margin-bottom: 6px">✓ <div>Aave V3, Compound, MakerDAO usan Certora para probar formalmente las invariantes de sus protocolos antes de cada major release.</div></div>
<div class="kp amber">★ <div><strong style="color:#fbbf24">Herramientas complementarias:</strong> Slither (static analysis), Echidna (fuzz fuzzer alternativo), Halmos (symbolic execution con Foundry).</div></div>

</div>

</div>

---

<!-- ═══════════════════════════════════════════════
     SLIDE 24 — E2E Pipeline
     ═══════════════════════════════════════════════ -->

# QA Full-Stack — Pipeline Completo DeFi

<div class="grid-2" style="margin-top: 0.75rem; gap: 1.25rem">

<div>

<div class="mono-label">Problema N+1 en extracción on-chain</div>

```typescript
// ❌ N+1 RPC calls — 100 posiciones = 100 round-trips
//    cada round-trip ~200ms → 20 segundos total
for (const pos of positions) {
  const data = await pool.positions(pos.id); // 200ms cada uno
}

// ✅ SOLUCIÓN: Multicall3 — 1 TX, N datos en paralelo
const calls = positions.map(p => ({
  target: POOL_ADDRESS,
  callData: pool.interface.encodeFunctionData('positions', [p.id]),
}))
const results = await multicall3.aggregate3(calls)
// 1 round-trip → <50ms para 100 posiciones ✅

// UI determinista: siempre query por blockNumber exacto
const state = await pool.positions(id, {
  blockTag: latestBlock  // mismo bloque = mismo estado
})
// Evita condiciones de carrera entre renders
```

<div class="kp green" style="margin-top:0.5rem">📊 <div><strong style="color:#34d399">The Graph Protocol:</strong> Indexa eventos on-chain en tiempo real. Los frontends DeFi consultan GraphQL tipado en lugar de hacer eth_call directamente.</div></div>

</div>

<div>

<div class="mono-label">Pipeline QA DeFi completo</div>

<div style="display:flex; flex-direction:column; gap:6px">

<div v-click class="card" style="display:flex; align-items:center; gap:8px; padding:8px 10px">
  <span style="font-size:1rem">⛓️</span>
  <div style="flex:1">
    <div style="font-family:var(--font-mono); font-size:0.72rem; font-weight:700; color:#6382ff">1. On-chain Data</div>
    <div style="font-size:0.68rem; color:#64748b">eth_getLogs · Multicall3 · blockTag determinista</div>
  </div>
</div>

<div v-click class="card" style="display:flex; align-items:center; gap:8px; padding:8px 10px">
  <span style="font-size:1rem">📊</span>
  <div style="flex:1">
    <div style="font-family:var(--font-mono); font-size:0.72rem; font-weight:700; color:#38bdf8">2. Indexer / Subgraph</div>
    <div style="font-size:0.68rem; color:#64748b">The Graph · GraphQL tipado · Sync tiempo real</div>
  </div>
</div>

<div v-click class="card" style="display:flex; align-items:center; gap:8px; padding:8px 10px">
  <span style="font-size:1rem">🔬</span>
  <div style="flex:1">
    <div style="font-family:var(--font-mono); font-size:0.72rem; font-weight:700; color:#a78bfa">3. Invariant Tests (Foundry)</div>
    <div style="font-size:0.68rem; color:#64748b">Stateful fuzzing · 10,000+ runs · Fork mainnet</div>
  </div>
</div>

<div v-click class="card" style="display:flex; align-items:center; gap:8px; padding:8px 10px">
  <span style="font-size:1rem">📐</span>
  <div style="flex:1">
    <div style="font-family:var(--font-mono); font-size:0.72rem; font-weight:700; color:#fbbf24">4. Formal Verification (Certora)</div>
    <div style="font-size:0.68rem; color:#64748b">CVL · Proof exhaustiva · SMT solver</div>
  </div>
</div>

<div v-click class="card" style="display:flex; align-items:center; gap:8px; padding:8px 10px">
  <span style="font-size:1rem">🧪</span>
  <div style="flex:1">
    <div style="font-family:var(--font-mono); font-size:0.72rem; font-weight:700; color:#34d399">5. E2E / UI (Cypress)</div>
    <div style="font-size:0.68rem; color:#64748b">anvil --fork-url · Wallet mock · CI/CD pipeline</div>
  </div>
</div>

</div>

<div class="card card-glow" style="margin-top: 0.75rem; font-size:0.78rem; color:#94a3b8">
  <strong style="color:#e2e8f0">A diferencia del software tradicional:</strong> En DeFi, un bug post-deploy
  puede significar la pérdida <em>permanente e irreversible</em> de millones en TVL.
  <strong style="color:#34d399">El testing exhaustivo no es opcional — es parte de la arquitectura.</strong>
</div>

</div>

</div>

---
layout: center
---

<!-- ═══════════════════════════════════════════════
     SLIDE 25 — CIERRE
     ═══════════════════════════════════════════════ -->

<div class="cover-bg"></div>

<div style="position:relative; z-index:1; text-align:center; max-width: 800px">

<span class="badge badge-green" style="margin-bottom: 1.5rem; display:inline-flex">Conclusiones</span>

# Recapitulación

<div class="grid-2" style="text-align:left; margin: 1.5rem 0; gap: 1rem">

<div class="card card-glow" style="font-size:0.82rem">
  <div class="mono-label" style="margin-bottom:6px">Bloques Técnicos</div>
  <div class="kp" style="font-size:0.75rem; margin-bottom:4px">⛓ EVM: σ(t+1) = Υ(σt, T) — cada TX es atómica</div>
  <div class="kp cyan" style="font-size:0.75rem; margin-bottom:4px">📐 AMM V3: (x+L/√pb)(y+L·√pa)=L² · O(1) bitmap</div>
  <div class="kp green" style="font-size:0.75rem; margin-bottom:4px">🏦 Composability: protocolos como servicios encadenables</div>
  <div class="kp amber" style="font-size:0.75rem; margin-bottom:4px">⚡ Flash Loans: préstamos sin colateral por atomicidad</div>
  <div class="kp purple" style="font-size:0.75rem; margin-bottom:4px">🔄 Proxies: EIP-1967 separa estado de lógica</div>
  <div class="kp" style="font-size:0.75rem">✅ QA: Invariant + Formal + E2E = confianza en código inmutable</div>
</div>

<div class="card" style="font-size:0.82rem">
  <div class="mono-label" style="margin-bottom:6px">Fuentes Técnicas</div>
  <div style="display:flex; flex-direction:column; gap:4px; font-size:0.72rem; color:#64748b">
    <div>📄 Ethereum Yellowpaper (§2, §9) — EVM spec formal</div>
    <div>📄 Uniswap V3 Whitepaper — Liquidez concentrada</div>
    <div>📄 MakerDAO MCD Whitepaper — Vat.sol, ilks</div>
    <div>📄 Aave V3 Technical Paper — Flash Loans, Pool</div>
    <div>📄 EIP-1967 — Proxy Storage Slots</div>
    <div>📄 Flash Loans.txt — Atomic borrowing</div>
    <div>📄 proxy.txt — delegatecall patterns</div>
    <div>📄 erc-1967.md — Implementation standard</div>
  </div>
</div>

</div>

<div style="display:flex; gap:8px; justify-content:center; flex-wrap:wrap; margin-top: 0.5rem">
  <span class="badge badge-blue">Arquitectura de Software</span>
  <span class="badge badge-cyan">Sistemas Distribuidos</span>
  <span class="badge badge-green">Verificación Formal</span>
  <span class="badge badge-amber">Diseño Orientado a Gas</span>
  <span class="badge badge-purple">Upgradeability</span>
</div>

</div>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&family=Outfit:wght@400;600;700;800&display=swap');
:root { --bg-void:#060a14; --bg-elevated:#1a2438; --bg-card:#101828; --border-subtle:rgba(99,130,255,0.12); --border-accent:rgba(99,130,255,0.28); --font-mono:'JetBrains Mono',monospace; --font-display:'Outfit',system-ui,sans-serif; }
.slidev-layout { background: var(--bg-void) !important; color: #e2e8f0 !important; }
h1 { font-family:var(--font-display) !important; font-weight:800 !important; letter-spacing:-0.03em !important; background:linear-gradient(135deg,#6382ff 0%,#38bdf8 50%,#34d399 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
h2 { font-family:var(--font-display) !important; font-weight:700 !important; color:#e2e8f0 !important; }
code { font-family:var(--font-mono) !important; background:rgba(99,130,255,0.12) !important; border:1px solid rgba(99,130,255,0.2) !important; border-radius:4px !important; padding:1px 6px !important; color:#7dd3fc !important; font-size:0.88em !important; }
pre,.shiki { background:#080e1c !important; border:1px solid rgba(99,130,255,0.28) !important; border-radius:10px !important; }
.badge { display:inline-flex; align-items:center; gap:4px; padding:3px 12px; border-radius:999px; font-family:var(--font-mono); font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; }
.badge-blue   { background:rgba(99,130,255,0.15);  color:#6382ff; border:1px solid rgba(99,130,255,0.3); }
.badge-cyan   { background:rgba(56,189,248,0.15);  color:#38bdf8; border:1px solid rgba(56,189,248,0.3); }
.badge-green  { background:rgba(52,211,153,0.15);  color:#34d399; border:1px solid rgba(52,211,153,0.3); }
.badge-amber  { background:rgba(251,191,36,0.15);  color:#fbbf24; border:1px solid rgba(251,191,36,0.3); }
.badge-red    { background:rgba(248,113,113,0.15); color:#f87171; border:1px solid rgba(248,113,113,0.3); }
.badge-purple { background:rgba(167,139,250,0.15); color:#a78bfa; border:1px solid rgba(167,139,250,0.3); }
.card { background:#101828; border:1px solid rgba(99,130,255,0.12); border-radius:12px; padding:1rem 1.25rem; }
.card-glow { border-color:rgba(99,130,255,0.28); box-shadow:0 0 24px rgba(99,130,255,0.1); }
.card-red    { border-color:rgba(248,113,113,0.3); background:rgba(248,113,113,0.04); }
.card-green  { border-color:rgba(52,211,153,0.3);  background:rgba(52,211,153,0.04); }
.card-amber  { border-color:rgba(251,191,36,0.3);  background:rgba(251,191,36,0.04); }
.card-purple { border-color:rgba(167,139,250,0.3); background:rgba(167,139,250,0.04); }
.defi-table { width:100%; border-collapse:collapse; font-size:0.82rem; }
.defi-table th { padding:8px 12px; font-family:var(--font-mono); font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; color:#6382ff; border-bottom:1px solid rgba(99,130,255,0.28); background:rgba(99,130,255,0.06); text-align:left; }
.defi-table td { padding:7px 12px; border-bottom:1px solid rgba(99,130,255,0.12); color:#94a3b8; }
.defi-table tbody tr:hover { background:rgba(99,130,255,0.04); }
.row-red td { color:#f87171 !important; font-weight:700; }
.row-amber td { color:#fbbf24 !important; font-weight:600; }
.row-green td { color:#34d399 !important; }
.row-primary td { color:#e2e8f0 !important; font-weight:600; }
.metric { background:#1a2438; border:1px solid rgba(99,130,255,0.12); border-radius:10px; padding:0.75rem 1rem; text-align:center; }
.metric-value { font-family:var(--font-mono); font-size:1.6rem; font-weight:700; color:#6382ff; line-height:1.2; }
.metric-label { font-size:0.65rem; color:#4b5680; text-transform:uppercase; letter-spacing:0.1em; margin-top:2px; }
.eq-box { background:rgba(6,10,24,0.8); border:1px solid rgba(99,130,255,0.28); border-left:3px solid #6382ff; border-radius:8px; padding:0.75rem 1.25rem; text-align:center; font-family:var(--font-mono); color:#e2e8f0; }
.eq-label { font-size:0.65rem; color:#4b5680; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:6px; }
.kp { display:flex; align-items:flex-start; gap:8px; padding:8px 12px; background:#1a2438; border-radius:8px; border-left:2px solid #6382ff; font-size:0.82rem; color:#94a3b8; margin-bottom:6px; }
.kp.red    { border-left-color:#f87171; }
.kp.green  { border-left-color:#34d399; }
.kp.amber  { border-left-color:#fbbf24; }
.kp.purple { border-left-color:#a78bfa; }
.kp.cyan   { border-left-color:#38bdf8; }
.grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
.grid-3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:0.75rem; }
.grid-4 { display:grid; grid-template-columns:1fr 1fr 1fr 1fr; gap:0.75rem; }
.mono-label { font-family:var(--font-mono); font-size:0.7rem; font-weight:700; color:#4b5680; text-transform:uppercase; letter-spacing:0.14em; margin-bottom:0.5rem; }
.proto-box { border:1px solid rgba(99,130,255,0.28); border-radius:12px; padding:0.75rem 1rem; display:flex; align-items:center; gap:0.75rem; background:rgba(99,130,255,0.04); margin-bottom:0.5rem; }
.proto-icon { font-size:1.4rem; flex-shrink:0; }
.proto-name { font-family:var(--font-mono); font-size:0.82rem; font-weight:700; color:#e2e8f0; }
.proto-desc { font-size:0.72rem; color:#64748b; margin-top:2px; }
.conn-arrow { text-align:center; color:#4b5680; font-size:1.2rem; line-height:1.4; margin:2px 0; }
.conn-token { display:inline-flex; align-items:center; gap:4px; padding:2px 10px; background:rgba(251,191,36,0.1); border:1px solid rgba(251,191,36,0.3); border-radius:999px; font-family:var(--font-mono); font-size:0.63rem; color:#fbbf24; }
.cover-bg { position:absolute; inset:0; background-image:linear-gradient(rgba(99,130,255,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(99,130,255,0.05) 1px,transparent 1px); background-size:60px 60px; pointer-events:none; }
.slot-row { display:flex; align-items:center; gap:0.5rem; margin-bottom:4px; font-family:var(--font-mono); font-size:0.72rem; }
.slot-addr { color:#4b5680; width:80px; flex-shrink:0; }
.slot-bar { flex:1; height:22px; border-radius:4px; display:flex; align-items:center; padding:0 8px; font-size:0.68rem; font-weight:700; }
.bit-cell { width:100%; aspect-ratio:1; border-radius:3px; display:flex; align-items:center; justify-content:center; font-family:var(--font-mono); font-size:0.55rem; font-weight:700; }
.bit-active   { background:rgba(99,130,255,0.2);  border:1px solid #6382ff; color:#6382ff; }
.bit-inactive { background:#1a2438; border:1px solid rgba(99,130,255,0.12); color:#4b5680; }
.bit-current  { background:rgba(52,211,153,0.2);  border:1px solid #34d399; color:#34d399; box-shadow:0 0 10px rgba(52,211,153,0.4); }
.bit-found    { background:rgba(251,191,36,0.2);  border:1px solid #fbbf24; color:#fbbf24; box-shadow:0 0 10px rgba(251,191,36,0.4); }
</style>
