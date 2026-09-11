<script setup>
import { formatDay } from "../format.js";

defineProps({
  formula: { type: Object, required: true },
  meta: { type: Object, default: () => ({}) },
});
const emit = defineEmits(["back"]);
</script>

<template>
  <div class="screen">
    <div class="back-row">
      <button class="back-btn" @click="emit('back')">‹ Back</button>
    </div>
    <div class="screen-title">{{ formula.name }}</div>
    <p v-if="meta.pickedUpAt" class="prose" style="color: var(--ink-muted); font-size: 13px">
      Picked up {{ formatDay(meta.pickedUpAt) }}
    </p>

    <div class="formula-section">
      <h3>Ingredients</h3>
      <div v-for="c in formula.components" :key="c.latin" class="component-row">
        <div>
          <span class="binomial">{{ c.latin }}</span>
          <span class="common">{{ c.common }} · {{ c.part }}, {{ c.form }}</span>
        </div>
        <span class="proportion">{{ c.proportion }}</span>
      </div>
    </div>

    <div class="formula-section">
      <h3>How to take it</h3>
      <p class="prose">{{ formula.dosing }}</p>
    </div>

    <div class="formula-section">
      <h3>Preparation</h3>
      <p class="prose">{{ formula.prepMethod }}</p>
    </div>

    <div class="formula-section">
      <h3>Safety notes</h3>
      <div
        v-for="note in formula.safetyNotes"
        :key="note.text"
        :class="note.warning ? 'safety-note' : 'info-note'"
      >
        {{ note.text }}
      </div>
    </div>
  </div>
</template>
