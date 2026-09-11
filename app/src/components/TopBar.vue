<script setup>
const emit = defineEmits(["home", "history", "help"]);
</script>

<template>
  <div class="topbar">
    <button class="brand" @click="emit('home')">
      <span class="leaf">✦</span> Groundwork Apothecary
    </button>
    <div class="icon-group">
      <button class="icon-btn" @click="emit('history')">History</button>
      <button class="icon-btn" @click="emit('help')">Help</button>
    </div>
  </div>
</template>
