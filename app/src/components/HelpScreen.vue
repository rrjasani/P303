<script setup>
import { ref } from "vue";
import { state, submitReactionReport } from "../store.js";

const emit = defineEmits(["back"]);
const pickup = state.order.pickup;

const showReport = ref(false);
const submitted = ref(false);
const symptom = ref("");
const severity = ref("mild");

function submit() {
  if (!symptom.value.trim()) return;
  submitReactionReport({ symptom: symptom.value.trim(), severity: severity.value });
  submitted.value = true;
}

function closeReport() {
  showReport.value = false;
  submitted.value = false;
  symptom.value = "";
  severity.value = "mild";
}
</script>

<template>
  <div class="screen">
    <div class="back-row">
      <button class="back-btn" @click="emit('back')">‹ Back</button>
    </div>
    <div class="screen-title">Get help</div>

    <div class="help-card">
      <a class="help-link" :href="`tel:${pickup.phone.replace(/[^0-9+]/g, '')}`">
        Call Groundwork Apothecary
        <span class="sub">{{ pickup.phone }} · {{ pickup.hours }}</span>
      </a>
      <a class="help-link" :href="pickup.mapUrl" target="_blank" rel="noopener">
        Get directions
        <span class="sub">{{ pickup.address }}</span>
      </a>
    </div>

    <button class="btn btn-primary btn-block" @click="showReport = true">Report a reaction</button>
  </div>

  <div v-if="showReport" class="sheet-backdrop" @click.self="closeReport">
    <div class="sheet">
      <template v-if="!submitted">
        <h3>Report a reaction</h3>
        <p class="sheet-sub">Tell us what's going on — Nora will follow up right away.</p>

        <label class="field-label" for="symptom">What are you noticing?</label>
        <textarea id="symptom" v-model="symptom" class="field-textarea" placeholder="e.g. mild stomach upset"></textarea>

        <label class="field-label">How severe does it feel?</label>
        <div class="option-row">
          <button
            v-for="level in ['mild', 'moderate', 'severe']"
            :key="level"
            class="option-btn"
            :class="{ selected: severity === level }"
            style="text-transform: capitalize"
            @click="severity = level"
          >
            {{ level }}
          </button>
        </div>

        <p v-if="severity === 'severe'" class="sheet-sub" style="color: var(--rust); font-weight: 700">
          If this feels urgent, call us directly or seek medical care — don't wait on this form.
        </p>

        <div class="sheet-actions">
          <button class="btn btn-primary btn-block" :disabled="!symptom.trim()" @click="submit">Submit report</button>
          <button class="btn btn-ghost btn-block" @click="closeReport">Cancel</button>
        </div>
      </template>
      <template v-else>
        <h3>Thanks — we've got it</h3>
        <p class="sheet-sub">Nora has been notified and will follow up with you shortly.</p>
        <div class="sheet-actions">
          <button class="btn btn-primary btn-block" @click="closeReport">Done</button>
        </div>
      </template>
    </div>
  </div>
</template>
