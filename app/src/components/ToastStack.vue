<script setup>
defineProps({
  toasts: { type: Array, required: true },
});
</script>

<template>
  <div class="toast-stack">
    <transition-group name="toast">
      <div v-for="t in toasts" :key="t.id" class="toast">{{ t.message }}</div>
    </transition-group>
  </div>
</template>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.toast-enter-from { opacity: 0; transform: translateY(-8px); }
.toast-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
