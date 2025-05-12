<template>
  <a class="btn toggle at-metronome" :class="{ active: isActive }" @click="toggle">
    <Music class="icon" />
  </a>
</template>

<script setup>
import { ref } from 'vue'
import { Music } from 'lucide-vue-next'

const isActive = ref(false)
const toggle = () => isActive.value = !isActive.value
</script>
