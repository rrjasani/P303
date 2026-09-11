<script setup>
defineProps({
  tone: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  cta: { type: String, default: null },
});
const emit = defineEmits(["cta"]);
</script>

<template>
  <div class="action-banner" :data-tone="tone">
    <div class="banner-title">{{ title }}</div>
    <p class="banner-message">{{ message }}</p>
    <button v-if="cta" class="btn btn-primary" style="align-self: flex-start" @click="emit('cta')">
      {{ cta }}
    </button>
  </div>
</template>
