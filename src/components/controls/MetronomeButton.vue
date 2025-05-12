<template>
  <a class="btn toggle at-metronome" 
     :class="{ active: isActive }" 
     @click="toggle"
     title="Toggle metronome"
  >
    <Music2 v-if="!isActive" class="icon" />
    <Music4 v-else class="icon" />
  </a>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'
import { Music2, Music4 } from 'lucide-vue-next'

const alphaTabApi = inject('alphaTabApi')
const isActive = ref(false)

const toggle = () => {
  isActive.value = !isActive.value
  if (alphaTabApi.value) {
    alphaTabApi.value.metronomeVolume = isActive.value ? 1 : 0
  }
}

// 当组件挂载后同步初始状态
onMounted(() => {
  if (alphaTabApi.value) {
    isActive.value = alphaTabApi.value.metronomeVolume > 0
  }
})
</script>
