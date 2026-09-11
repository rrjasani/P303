<script setup>
import { ref } from "vue";
import { formatMoney } from "../format.js";
import { payNow } from "../store.js";

const props = defineProps({
  payment: { type: Object, required: true },
  isRetry: { type: Boolean, default: false },
});
const emit = defineEmits(["close"]);

const processing = ref(false);

async function submit() {
  processing.value = true;
  await payNow();
  processing.value = false;
  emit("close");
}
</script>

<template>
  <div class="sheet-backdrop" @click.self="emit('close')">
    <div class="sheet">
      <h3>{{ isRetry ? "Retry payment" : "Pay now" }}</h3>
      <p class="sheet-sub">
        {{ isRetry ? "Your card was declined — try again or use a different method." : "Charged once, at pickup." }}
      </p>

      <div class="payment-row">
        <span class="payment-amount">{{ formatMoney(payment.amount) }}</span>
        <span class="payment-method">{{ payment.method.brand }} •••• {{ payment.method.last4 }}</span>
      </div>

      <div class="sheet-actions">
        <button class="btn btn-primary btn-block" :disabled="processing" @click="submit">
          {{ processing ? "Processing…" : `Pay ${formatMoney(payment.amount)}` }}
        </button>
        <button class="btn btn-ghost btn-block" :disabled="processing" @click="emit('close')">Not now</button>
      </div>
    </div>
  </div>
</template>
