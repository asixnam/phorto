<template>
  <div>
    <AdminHeader />
    <slot />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  if (process.client) {
    document.body.classList.add('dark-mode')
  }
})
</script>
