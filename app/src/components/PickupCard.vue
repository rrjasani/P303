<script setup>
const props = defineProps({
  pickup: { type: Object, required: true },
});
</script>

<template>
  <div class="pickup-card">
    <h3>Pickup details</h3>
    <p class="pickup-row">{{ pickup.address }}</p>
    <p class="pickup-row muted">{{ pickup.hours }}</p>
    <ul class="bring-list">
      <li v-for="item in pickup.whatToBring" :key="item">{{ item }}</li>
    </ul>
    <div class="pickup-actions">
      <a class="btn btn-secondary btn-block" :href="pickup.mapUrl" target="_blank" rel="noopener">Directions</a>
      <a class="btn btn-ghost btn-block" :href="`tel:${pickup.phone.replace(/[^0-9+]/g, '')}`">Call</a>
    </div>
  </div>
</template>
