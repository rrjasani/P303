<script setup>
import { ref, computed } from "vue";
import { state, advanceStage, setException, clearException, resetDemo } from "../store.js";
import { STAGES, stageIndex } from "../data.js";

// Build-time aid so reviewers can walk through every stage and exception
// state without a backend to drive them. Not part of the client experience —
// kept visually distinct (dashed border, hatched fill) for that reason.
const open = ref(false);
const atEnd = computed(() => stageIndex(state.order.stage) >= STAGES.length - 1);
</script>

<template>
  <button class="demo-toggle" @click="open = !open">{{ open ? "Close demo" : "Demo controls" }}</button>

  <div v-if="open" class="sheet-backdrop" @click.self="open = false">
    <div class="sheet demo-panel">
      <h4>Advance the order</h4>
      <div class="demo-grid">
        <button class="demo-btn" :disabled="atEnd" @click="advanceStage">
          Next stage → {{ atEnd ? "done" : STAGES[stageIndex(state.order.stage) + 1].label }}
        </button>
        <button class="demo-btn" @click="resetDemo">Reset order</button>
      </div>

      <h4 style="margin-top: 14px">Trigger an exception state</h4>
      <div class="demo-grid">
        <button class="demo-btn" @click="setException('needs_input')">Needs your input</button>
        <button class="demo-btn" @click="setException('waiting_on_practitioner')">Waiting on practitioner</button>
        <button class="demo-btn" @click="setException('delayed_backorder')">Delayed — backorder</button>
        <button class="demo-btn" @click="setException('payment_required')">Payment failed</button>
        <button class="demo-btn" @click="clearException">Clear exception</button>
      </div>
    </div>
  </div>
</template>
