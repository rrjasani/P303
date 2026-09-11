<script setup>
import { formatMoney } from "../format.js";
import { setAutopay } from "../store.js";

const props = defineProps({
  payment: { type: Object, required: true },
});
</script>

<template>
  <div class="payment-card">
    <h3>Payment</h3>
    <div class="payment-row">
      <span class="payment-amount">{{ formatMoney(payment.amount) }}</span>
      <span class="payment-method">{{ payment.method.brand }} •••• {{ payment.method.last4 }}</span>
    </div>

    <div v-if="payment.status === 'paid'" class="paid-chip">✓ Paid — you're all set for pickup</div>
    <p v-else-if="payment.status === 'failed'" class="prose" style="font-size: 13.5px; color: var(--ink-muted)">
      Use the button below to try again.
    </p>
    <p v-else class="prose" style="font-size: 13.5px; color: var(--ink-muted)">
      Pay now, or turn on auto-pay so pickup is a pure handoff.
    </p>

    <div class="autopay-row">
      <div>
        <div class="label">Auto-pay</div>
        <div class="sub">Charges automatically when your order is ready</div>
      </div>
      <button
        class="toggle"
        :class="{ on: payment.autopay }"
        role="switch"
        :aria-checked="payment.autopay"
        aria-label="Toggle auto-pay"
        @click="setAutopay(!payment.autopay)"
      >
        <span class="knob" />
      </button>
    </div>
  </div>
</template>
