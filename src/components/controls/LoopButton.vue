<template>
  <a class="btn toggle at-loop" :class="{ active: isActive }" @click="toggle">
    <Repeat class="icon" />
  </a>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'
import { Repeat } from 'lucide-vue-next'

const alphaTabApi = inject('alphaTabApi')
const isActive = ref(false)

const toggle = () => {
  isActive.value = !isActive.value
  if (alphaTabApi.value) {
    alphaTabApi.value.isLooping = isActive.value
  }
}

// 当组件挂载后同步初始状态
onMounted(() => {
  if (alphaTabApi.value) {
    isActive.value = alphaTabApi.value.isLooping
  }
})
</script>
