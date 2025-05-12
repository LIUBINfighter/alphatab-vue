<template>
  <a class="btn toggle at-loop" :class="{ active: isActive }" @click="toggle">
    <Repeat class="icon" />
  </a>
</template>

<script setup>
import { ref } from 'vue'
import { Repeat } from 'lucide-vue-next'

const isActive = ref(false)
const toggle = () => isActive.value = !isActive.value
</script>
