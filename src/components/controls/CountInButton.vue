<template>
  <a class="btn toggle at-count-in" :class="{ active: isActive }" @click="toggle">
    <Timer class="icon" />
  </a>
</template>

<script setup>
import { ref } from 'vue'
import { Timer } from 'lucide-vue-next'

const isActive = ref(false)
const toggle = () => isActive.value = !isActive.value
</script>
