<script setup>
import { ref, computed } from "vue";
import { state } from "../store.js";
import { STAGES, stageIndex, EXCEPTIONS } from "../data.js";
import ActionBanner from "./ActionBanner.vue";
import Timeline from "./Timeline.vue";
import PickupCard from "./PickupCard.vue";
import PaymentCard from "./PaymentCard.vue";
import PaymentSheet from "./PaymentSheet.vue";
import NeedsInputSheet from "./NeedsInputSheet.vue";

const emit = defineEmits(["open-formula"]);

const order = computed(() => state.order);
const stageMeta = computed(() => STAGES[stageIndex(order.value.stage)]);
const readyIdx = STAGES.findIndex((s) => s.key === "ready");

const paymentDue = computed(
  () => order.value.stage === "ready" && order.value.payment.status === "pending" && !order.value.payment.autopay
);

// M3 — a single banner slot: an exception state wins, otherwise an unpaid,
// ready order surfaces its own "pay before pickup" prompt. Never both at once.
const banner = computed(() => {
  if (order.value.exception) {
    const ex = EXCEPTIONS[order.value.exception];
    return { tone: ex.tone, title: ex.title, message: ex.message };
  }
  if (paymentDue.value) {
    return {
      tone: "attention",
      title: "Payment due at pickup",
      message: "Pay now, or turn on auto-pay below so pickup is a quick handoff.",
    };
  }
  return null;
});

const primaryAction = computed(() => {
  if (order.value.exception === "needs_input") return { label: "Answer now", kind: "primary", action: "needs_input" };
  if (order.value.exception === "payment_required")
    return { label: "Retry payment", kind: "primary", action: "payment_retry" };
  if (paymentDue.value) return { label: "Pay now", kind: "primary", action: "payment_pay" };
  if (order.value.stage === "picked_up") return { label: "View formula & dosing", kind: "secondary", action: "view_formula" };
  return null;
});

const showPickup = computed(() => order.value.stage === "ready");
const showPayment = computed(() => stageIndex(order.value.stage) >= readyIdx);

const sheet = ref(null); // null | 'needs_input' | 'pay' | 'retry'

function handlePrimary() {
  const action = primaryAction.value?.action;
  if (action === "needs_input") sheet.value = "needs_input";
  else if (action === "payment_pay") sheet.value = "pay";
  else if (action === "payment_retry") sheet.value = "retry";
  else if (action === "view_formula") {
    emit("open-formula", order.value.formula, { pickedUpAt: order.value.timestamps.picked_up });
  }
}
</script>

<template>
  <div class="screen">
    <ActionBanner v-if="banner" :tone="banner.tone" :title="banner.title" :message="banner.message" />
    <div v-else class="nothing-needed"><span class="check">✓</span> Nothing needed from you right now.</div>

    <div class="status-card" :class="{ 'is-ready': order.stage === 'ready' }">
      <div class="stage-label">{{ stageMeta.label }}</div>
      <div class="stage-glance">{{ stageMeta.glance }}</div>
      <div v-if="order.stage !== 'ready' && order.stage !== 'picked_up'" class="stage-eta">
        Estimated ready today
      </div>
    </div>

    <Timeline :order="order" />

    <PickupCard v-if="showPickup" :pickup="order.pickup" />
    <PaymentCard v-if="showPayment" :payment="order.payment" />

    <div v-if="order.stage === 'picked_up'" class="pickup-card">
      <h3>Your formula</h3>
      <p class="prose">Dosing, prep, and safety notes are saved for whenever you need them.</p>
    </div>
  </div>

  <!-- Sibling of .screen, not nested in it — a bottom-bar this far down the card
       stack would otherwise render past its own container's edge and overlap
       whatever card lands there once content grows taller than the viewport. -->
  <div v-if="primaryAction" class="bottom-bar">
    <button
      class="btn btn-block"
      :class="primaryAction.kind === 'primary' ? 'btn-primary' : 'btn-secondary'"
      @click="handlePrimary"
    >
      {{ primaryAction.label }}
    </button>
  </div>

  <PaymentSheet v-if="sheet === 'pay'" :payment="order.payment" :is-retry="false" @close="sheet = null" />
  <PaymentSheet v-if="sheet === 'retry'" :payment="order.payment" :is-retry="true" @close="sheet = null" />
  <NeedsInputSheet v-if="sheet === 'needs_input'" @close="sheet = null" />
</template>
