import { reactive } from "vue";
import { STAGES, stageIndex, createActiveOrder } from "./data.js";

let toastId = 0;

/**
 * All app state lives here — a plain reactive object, not Pinia, since this is a
 * single-screen-family demo with no backend (BRIEF.md "Implementation"). Notification
 * text is deliberately generic: never names herbs or conditions, per the
 * "privacy-aware" design constraint — this is what would leave the device as a
 * push/SMS payload, and lock-screen previews shouldn't leak health information.
 */
export const state = reactive({
  order: createActiveOrder(),
  toasts: [],
  reactionReports: [],
});

export function addToast(message) {
  const id = ++toastId;
  state.toasts.push({ id, message });
  setTimeout(() => {
    const i = state.toasts.findIndex((t) => t.id === id);
    if (i !== -1) state.toasts.splice(i, 1);
  }, 4200);
}

/** Jumps to any stage in J1 — forward or back. Auto-charges on reaching "ready" if autopay is on. */
export function goToStage(key) {
  const idx = stageIndex(key);
  STAGES.forEach((s, i) => {
    state.order.timestamps[s.key] = i <= idx ? state.order.timestamps[s.key] ?? new Date() : null;
  });
  state.order.stage = key;
  state.order.exception = null;

  addToast(
    key === "ready" ? "Your order is ready for pickup at Groundwork Apothecary." : "Your order status just updated."
  );

  if (key === "ready" && state.order.payment.autopay && state.order.payment.status !== "paid") {
    state.order.payment.status = "paid";
    addToast(`Auto-pay: $${state.order.payment.amount.toFixed(2)} charged to your saved card.`);
  }
}

export function setException(key) {
  state.order.exception = key;
  if (key === "payment_required") state.order.payment.status = "failed";
  addToast("Your order status just updated.");
}

export function clearException() {
  state.order.exception = null;
}

export function payNow() {
  return new Promise((resolve) => {
    setTimeout(() => {
      state.order.payment.status = "paid";
      if (state.order.exception === "payment_required") state.order.exception = null;
      addToast("Payment received — thank you.");
      resolve();
    }, 700);
  });
}

export function setAutopay(on) {
  state.order.payment.autopay = on;
}

export function submitReactionReport(report) {
  state.reactionReports.push({ ...report, submittedAt: new Date() });
  addToast("Nora has been notified and will follow up shortly.");
}
