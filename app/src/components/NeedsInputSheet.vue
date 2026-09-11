<script setup>
import { ref } from "vue";
import { clearException, addToast } from "../store.js";

const emit = defineEmits(["close"]);
const choice = ref(null);

function confirm() {
  clearException();
  addToast(`Got it — we'll prepare it as a ${choice.value}.`);
  emit("close");
}
</script>

<template>
  <div class="sheet-backdrop" @click.self="emit('close')">
    <div class="sheet">
      <h3>Tea or tincture?</h3>
      <p class="sheet-sub">Rohan left this up to you — pick whichever fits how you'll take it.</p>

      <div class="option-row">
        <button class="option-btn" :class="{ selected: choice === 'tea' }" @click="choice = 'tea'">Tea</button>
        <button class="option-btn" :class="{ selected: choice === 'tincture' }" @click="choice = 'tincture'">
          Tincture
        </button>
      </div>

      <div class="sheet-actions">
        <button class="btn btn-primary btn-block" :disabled="!choice" @click="confirm">Confirm</button>
        <button class="btn btn-ghost btn-block" @click="emit('close')">Not now</button>
      </div>
    </div>
  </div>
</template>
