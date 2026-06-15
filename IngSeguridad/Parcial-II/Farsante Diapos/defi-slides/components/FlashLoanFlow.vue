<template>
  <div class="fl-demo">
    <!-- Steps -->
    <div class="fl-steps">
      <div v-for="step in steps" :key="step.id"
        :class="['fl-step', { active: activeStep === step.id, past: activeStep > step.id, reverted: reverted && step.id === 5 }]">
        <div :class="['fl-step-num', step.color]">
          {{ activeStep > step.id && !reverted ? '✓' : step.id }}
        </div>
        <div class="fl-step-body">
          <div class="fl-step-phase">{{ step.phase }}</div>
          <div class="fl-step-title">{{ step.title }}</div>
          <div v-if="activeStep === step.id" class="fl-step-state">→ {{ step.state }}</div>
        </div>
      </div>
    </div>

    <!-- Revert alert -->
    <div v-if="reverted" class="fl-revert">
      💥 <strong>REVERT — "FL:balanceMismatch"</strong><br/>
      <span style="font-size:0.72rem;color:#94a3b8">Rollback total del estado EVM. Como si la TX nunca hubiera existido.</span>
    </div>

    <!-- Button -->
    <button @click="simulate" :disabled="running" class="fl-btn">
      {{ running ? '⏳ Ejecutando TX...' : reverted ? '↺ Reiniciar' : '⚡ Simular Flash Loan + REVERT' }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const steps = [
  { id: 1, phase: 'INICIO', color: 'cyan', title: 'Pool.flashLoan(1,000,000 USDC)', state: 'Snapshot balanceInicial = 1,000,000 USDC' },
  { id: 2, phase: 'TRANSFER', color: 'blue', title: 'Pool transfiere fondos al receptor', state: 'receiver.balance += 1,000,000 USDC' },
  { id: 3, phase: 'EXECUTE', color: 'amber', title: 'executeOperation() — Lógica DeFi', state: 'Arbitraje / Liquidación / Swap en curso...' },
  { id: 4, phase: 'CHECK', color: 'purple', title: 'Verificar: balance ≥ capital + fee', state: 'require(balance >= 1,000,500 USDC) ← 0.05% fee' },
  { id: 5, phase: 'REVERT', color: 'red', title: '💥 REVERT — balance insuficiente', state: 'Estado EVM revertido completamente' },
]

const activeStep = ref(0)
const running = ref(false)
const reverted = ref(false)

function simulate() {
  if (reverted.value) {
    activeStep.value = 0; reverted.value = false; return
  }
  running.value = true
  reverted.value = false
  activeStep.value = 0
  let s = 1
  const iv = setInterval(() => {
    activeStep.value = s
    s++
    if (s > 5) {
      clearInterval(iv)
      setTimeout(() => { reverted.value = true; running.value = false }, 400)
    }
  }, 650)
}
</script>

<style scoped>
.fl-demo { display: flex; flex-direction: column; gap: 8px; }
.fl-steps { display: flex; flex-direction: column; gap: 5px; }
.fl-step {
  display: flex; align-items: flex-start; gap: 10px;
  padding: 8px 12px; border-radius: 8px;
  border: 1px solid rgba(99,130,255,0.1);
  transition: all 0.3s ease;
  opacity: 0.45;
}
.fl-step.active { opacity: 1; border-color: rgba(99,130,255,0.4); background: rgba(99,130,255,0.07); }
.fl-step.past   { opacity: 0.85; background: rgba(52,211,153,0.04); border-color: rgba(52,211,153,0.2); }
.fl-step.reverted { border-color: rgba(248,113,113,0.4); background: rgba(248,113,113,0.07); opacity: 1; }
.fl-step-num {
  width: 26px; height: 26px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-mono); font-size: 0.72rem; font-weight: 700;
  flex-shrink: 0;
  border: 1px solid;
}
.fl-step-num.cyan   { color: #38bdf8; border-color: rgba(56,189,248,0.5); background: rgba(56,189,248,0.1); }
.fl-step-num.blue   { color: #6382ff; border-color: rgba(99,130,255,0.5); background: rgba(99,130,255,0.1); }
.fl-step-num.amber  { color: #fbbf24; border-color: rgba(251,191,36,0.5); background: rgba(251,191,36,0.1); }
.fl-step-num.purple { color: #a78bfa; border-color: rgba(167,139,250,0.5); background: rgba(167,139,250,0.1); }
.fl-step-num.red    { color: #f87171; border-color: rgba(248,113,113,0.5); background: rgba(248,113,113,0.1); }
.fl-step-phase { font-family: var(--font-mono); font-size: 0.65rem; font-weight: 700; color: #4b5680; text-transform: uppercase; letter-spacing: 0.1em; }
.fl-step-title { font-size: 0.8rem; font-weight: 600; color: #e2e8f0; }
.fl-step-state { font-family: var(--font-mono); font-size: 0.68rem; color: #fbbf24; margin-top: 3px; }
.fl-revert {
  padding: 10px 14px;
  background: rgba(248,113,113,0.08);
  border: 1px solid rgba(248,113,113,0.3);
  border-radius: 8px;
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: #f87171;
  line-height: 1.6;
}
.fl-btn {
  padding: 9px 18px; border-radius: 8px;
  background: rgba(99,130,255,0.1);
  border: 1px solid rgba(99,130,255,0.35);
  color: #6382ff;
  font-family: var(--font-mono); font-size: 0.78rem; font-weight: 700;
  cursor: pointer; transition: all 0.15s; width: 100%;
}
.fl-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.fl-btn:not(:disabled):hover { background: rgba(99,130,255,0.18); }
</style>
