<template>
  <a class="btn toggle at-count-in" 
     :class="{ active: isActive }" 
     @click="toggle"
     title="Toggle count-in"
  >
    <TimerOff v-if="!isActive" class="icon" />
    <Timer v-else class="icon" />
  </a>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'
import { TimerOff, Timer } from 'lucide-vue-next'

const alphaTabApi = inject('alphaTabApi')
const isActive = ref(false)

const toggle = () => {
  isActive.value = !isActive.value
  if (alphaTabApi.value) {
    alphaTabApi.value.countInVolume = isActive.value ? 1 : 0
  }
}

// 当组件挂载后同步初始状态
onMounted(() => {
  if (alphaTabApi.value) {
    isActive.value = alphaTabApi.value.countInVolume > 0
  }
})
</script>
