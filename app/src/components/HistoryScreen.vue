<script setup>
import { computed } from "vue";
import { state } from "../store.js";
import { HISTORY } from "../data.js";
import { formatDay } from "../format.js";

const emit = defineEmits(["back", "open-formula"]);

const entries = computed(() => {
  const list = HISTORY.map((h) => ({ formula: h.formula, pickedUpAt: h.pickedUpAt }));
  if (state.order.stage === "picked_up") {
    list.unshift({ formula: state.order.formula, pickedUpAt: state.order.timestamps.picked_up });
  }
  return list;
});
</script>

<template>
  <div class="screen">
    <div class="back-row">
      <button class="back-btn" @click="emit('back')">‹ Back</button>
    </div>
    <div class="screen-title">Formula history</div>

    <div v-if="entries.length === 0" class="nothing-needed">No past formulas yet.</div>
    <div
      v-for="(entry, i) in entries"
      :key="i"
      class="history-card"
      @click="emit('open-formula', entry.formula, { pickedUpAt: entry.pickedUpAt })"
    >
      <div>
        <div class="h-name">{{ entry.formula.name }}</div>
        <div class="h-date">Picked up {{ formatDay(entry.pickedUpAt) }}</div>
      </div>
      <span class="chevron">›</span>
    </div>
  </div>
</template>
