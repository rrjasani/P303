<script setup>
import { ref } from "vue";
import { state } from "./store.js";
import TopBar from "./components/TopBar.vue";
import StatusScreen from "./components/StatusScreen.vue";
import HistoryScreen from "./components/HistoryScreen.vue";
import FormulaScreen from "./components/FormulaScreen.vue";
import HelpScreen from "./components/HelpScreen.vue";
import ToastStack from "./components/ToastStack.vue";
import DemoPanel from "./components/DemoPanel.vue";

// Manual view switch instead of vue-router — three destinations off one root
// screen don't need a routing library (see P301/P302 for the same call).
const view = ref("status");
const formulaContext = ref(null); // { formula, meta, backTo }

function openFormula(formula, meta, backTo) {
  formulaContext.value = { formula, meta, backTo };
  view.value = "formula";
}

function goTo(next) {
  view.value = next;
}
</script>

<template>
  <div class="shell">
    <TopBar @history="goTo('history')" @help="goTo('help')" @home="goTo('status')" />

    <StatusScreen v-if="view === 'status'" @open-formula="(f, m) => openFormula(f, m, 'status')" />
    <HistoryScreen
      v-else-if="view === 'history'"
      @back="goTo('status')"
      @open-formula="(f, m) => openFormula(f, m, 'history')"
    />
    <FormulaScreen
      v-else-if="view === 'formula'"
      :formula="formulaContext.formula"
      :meta="formulaContext.meta"
      @back="goTo(formulaContext.backTo)"
    />
    <HelpScreen v-else-if="view === 'help'" @back="goTo('status')" />

    <ToastStack :toasts="state.toasts" />
    <DemoPanel />
  </div>
</template>
