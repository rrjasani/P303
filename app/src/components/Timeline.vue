<script setup>
import { ref, computed } from "vue";
import { STAGES, stageIndex } from "../data.js";
import { formatWhen, formatEta } from "../format.js";

const props = defineProps({
  order: { type: Object, required: true },
});

// Progressive disclosure (M2): collapsed shows only what's done + what's next;
// expand for the full five-step history.
const expanded = ref(false);

const currentIdx = computed(() => stageIndex(props.order.stage));

const steps = computed(() => {
  const idx = currentIdx.value;
  return STAGES.map((s, i) => {
    const isDone = i < idx;
    const isCurrent = i === idx;
    const ts = props.order.timestamps[s.key];
    let when = "";
    if (isDone || isCurrent) {
      when = ts ? formatWhen(ts) : "";
    } else if (i === idx + 1 && props.order.eta) {
      when = `Estimated ${formatEta(props.order.eta)}`;
    }
    return { ...s, isDone, isCurrent, when };
  });
});

const visibleSteps = computed(() => {
  if (expanded.value) return steps.value;
  const idx = currentIdx.value;
  const lo = Math.max(0, idx - 1);
  const hi = Math.min(STAGES.length - 1, idx + 1);
  return steps.value.slice(lo, hi + 1);
});
</script>

<template>
  <div class="timeline-card">
    <h3>Order timeline</h3>
    <ul class="timeline-list">
      <li
        v-for="step in visibleSteps"
        :key="step.key"
        class="timeline-step"
        :class="{ 'is-done': step.isDone, 'is-current': step.isCurrent }"
      >
        <span class="step-dot">{{ step.isDone ? "✓" : "" }}</span>
        <div class="step-body">
          <div class="step-label">{{ step.label }}</div>
          <div v-if="step.when" class="step-when">{{ step.when }}</div>
        </div>
      </li>
    </ul>
    <button class="btn-link" style="margin-top: 8px" @click="expanded = !expanded">
      {{ expanded ? "Show less" : "See full timeline" }}
    </button>
  </div>
</template>
