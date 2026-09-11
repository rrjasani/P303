<script setup>
import { ref, computed } from "vue";
import { state, advanceStage, setException, clearException, resetDemo } from "../store.js";
import { STAGES, stageIndex } from "../data.js";

// Build-time aid so reviewers can walk every stage and exception state
// without a backend to drive them. Not part of the client experience —
// kept visually distinct (dashed border, hatched fill) for that reason.
const open = ref(true);
const atEnd = computed(() => stageIndex(state.order.stage) >= STAGES.length - 1);
</script>

<template>
  <aside v-if="open" class="scenario-panel">
    <div class="scenario-panel-head">
      <h4>Scenarios</h4>
      <button class="scenario-close" aria-label="Close scenarios" @click="open = false">×</button>
    </div>

    <div class="scenario-group">
      <div class="scenario-group-label">Advance the order</div>
      <button class="scenario-btn" :disabled="atEnd" @click="advanceStage">
        Next: {{ atEnd ? "Done" : STAGES[stageIndex(state.order.stage) + 1].label }}
      </button>
      <button class="scenario-btn" @click="resetDemo">Reset order</button>
    </div>

    <div class="scenario-group">
      <div class="scenario-group-label">Trigger an exception</div>
      <button class="scenario-btn" @click="setException('needs_input')">Needs your input</button>
      <button class="scenario-btn" @click="setException('waiting_on_practitioner')">Waiting on practitioner</button>
      <button class="scenario-btn" @click="setException('delayed_backorder')">Delayed — backorder</button>
      <button class="scenario-btn" @click="setException('payment_required')">Payment failed</button>
      <button class="scenario-btn" @click="clearException">Clear exception</button>
    </div>
  </aside>

  <button v-else class="scenario-toggle" @click="open = true">Scenarios</button>
</template>
