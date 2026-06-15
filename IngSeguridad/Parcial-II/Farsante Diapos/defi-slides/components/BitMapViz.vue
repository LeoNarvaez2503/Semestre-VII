<template>
  <div class="bitmap-demo">
    <!-- Legend -->
    <div class="bm-legend">
      <div class="bm-leg-item"><div class="bit-cell bit-current" style="width:20px;height:20px;display:inline-flex">▶</div><span>Precio actual</span></div>
      <div class="bm-leg-item"><div class="bit-cell bit-active" style="width:20px;height:20px;display:inline-flex">1</div><span>Tick con liquidez</span></div>
      <div class="bm-leg-item"><div class="bit-cell bit-inactive" style="width:20px;height:20px;display:inline-flex">0</div><span>Tick vacío</span></div>
      <div v-if="foundTick !== null" class="bm-leg-item"><div class="bit-cell bit-found" style="width:20px;height:20px;display:inline-flex">★</div><span>Encontrado</span></div>
    </div>

    <!-- Bitmap grid -->
    <div class="bm-grid">
      <div v-for="(bit, i) in bitmap" :key="i"
        :class="[
          'bit-cell',
          i === CURRENT ? 'bit-current' :
          i === foundTick ? 'bit-found' :
          i === scanPos && mode === 'linear' ? 'bit-active' :
          bit === 1 ? 'bit-active' : 'bit-inactive'
        ]">
        {{ i === CURRENT ? '▶' : i === foundTick ? '★' : bit }}
      </div>
    </div>

    <!-- Index labels -->
    <div class="bm-labels">
      <span>tick 0</span>
      <span>tick {{ CURRENT }} (actual)</span>
      <span>tick 31</span>
    </div>

    <!-- Result -->
    <div v-if="foundTick !== null" class="bm-result">
      <span class="badge badge-green">✓ Tick #{{ foundTick }} encontrado</span>
      <span class="bm-complexity" :style="{ color: mode === 'bitmap' ? '#34d399' : '#fbbf24' }">
        {{ mode === 'bitmap' ? '⚡ O(1) — operación bit en uint256' : `🐌 O(n) — ${foundTick - CURRENT} iteraciones` }}
      </span>
    </div>
    <div v-else-if="running" class="bm-result">
      <span style="color:#64748b; font-family: var(--font-mono); font-size: 0.75rem">Escaneando...</span>
    </div>

    <!-- Controls -->
    <div class="bm-controls">
      <button @click="runLinear" :disabled="running" class="bm-btn amber">
        {{ running && mode === 'linear' ? '⏳ Escaneando...' : '▶ Simular O(n) Lineal' }}
      </button>
      <button @click="runBitmap" :disabled="running" class="bm-btn green">
        {{ running && mode === 'bitmap' ? '⚡ Resolviendo...' : '⚡ Simular O(1) Bitmap' }}
      </button>
      <button @click="reset" class="bm-btn muted">↺ Reset</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const BITMAP = [0,0,1,0,0,0,1,0,0,1,0,0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,1,0,0,1,0,0]
const CURRENT = 8

const bitmap = ref([...BITMAP])
const foundTick = ref(null)
const scanPos = ref(-1)
const running = ref(false)
const mode = ref('')

function reset() {
  foundTick.value = null
  scanPos.value = -1
  running.value = false
  mode.value = ''
}

function runLinear() {
  reset()
  mode.value = 'linear'
  running.value = true
  let i = CURRENT + 1
  const interval = setInterval(() => {
    scanPos.value = i
    if (bitmap.value[i] === 1) {
      foundTick.value = i
      running.value = false
      clearInterval(interval)
    }
    i++
    if (i >= bitmap.value.length) {
      running.value = false
      clearInterval(interval)
    }
  }, 160)
}

function runBitmap() {
  reset()
  mode.value = 'bitmap'
  running.value = true
  setTimeout(() => {
    foundTick.value = bitmap.value.findIndex((v, i) => i > CURRENT && v === 1)
    running.value = false
  }, 350)
}
</script>

<style scoped>
.bitmap-demo { display: flex; flex-direction: column; gap: 10px; }
.bm-legend { display: flex; gap: 12px; flex-wrap: wrap; }
.bm-leg-item { display: flex; align-items: center; gap: 5px; font-size: 0.72rem; color: #64748b; }
.bm-grid {
  display: grid;
  grid-template-columns: repeat(16, 1fr);
  gap: 3px;
  padding: 10px;
  background: #040810;
  border-radius: 8px;
  border: 1px solid rgba(99,130,255,0.12);
}
.bm-labels { display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 0.6rem; color: #4b5680; padding: 0 10px; }
.bm-result { display: flex; align-items: center; gap: 10px; padding: 8px 10px; background: rgba(52,211,153,0.05); border-radius: 6px; border: 1px solid rgba(52,211,153,0.15); }
.bm-complexity { font-family: var(--font-mono); font-size: 0.75rem; font-weight: 700; }
.bm-controls { display: flex; gap: 8px; flex-wrap: wrap; }
.bm-btn {
  padding: 7px 14px;
  border-radius: 8px;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
  border: 1px solid;
  transition: all 0.15s;
}
.bm-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.bm-btn.amber { background: rgba(251,191,36,0.1); border-color: rgba(251,191,36,0.4); color: #fbbf24; }
.bm-btn.green { background: rgba(52,211,153,0.1); border-color: rgba(52,211,153,0.4); color: #34d399; }
.bm-btn.muted { background: transparent; border-color: rgba(99,130,255,0.2); color: #4b5680; }
</style>
