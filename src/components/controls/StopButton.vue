<template>
  <a class="btn at-stop" :class="{ disabled: isDisabled }" @click="handleStop">
    <StopCircle class="icon" />
  </a>
</template>

<script setup>
import { ref, inject, onMounted, onUnmounted } from 'vue'
import { StopCircle } from 'lucide-vue-next'

const alphaTabApi = inject('alphaTabApi')
const isDisabled = ref(true) // 初始状态禁用，直到谱子加载完成

// 处理停止播放逻辑
const handleStop = (e) => {
  e.stopPropagation()
  if (!isDisabled.value && alphaTabApi.value) {
    alphaTabApi.value.stop()
  }
}

// 监听相关事件
let scoreLoadedHandler = null
let playerReadyHandler = null

onMounted(() => {
  if (alphaTabApi.value) {
    // 当谱子加载完成后启用按钮
    scoreLoadedHandler = (score) => {
      isDisabled.value = !score
    }
    alphaTabApi.value.scoreLoaded.on(scoreLoadedHandler)
    
    // 当播放器准备好时启用按钮
    playerReadyHandler = (ready) => {
      isDisabled.value = !ready
    }
    alphaTabApi.value.playerReady.on(playerReadyHandler)
  }
})

onUnmounted(() => {
  // 清理事件监听器
  if (alphaTabApi.value) {
    if (scoreLoadedHandler) {
      alphaTabApi.value.scoreLoaded.off(scoreLoadedHandler)
    }
    if (playerReadyHandler) {
      alphaTabApi.value.playerReady.off(playerReadyHandler)
    }
  }
})
</script>

<style scoped>
.disabled {
  opacity: 0.5;
  cursor: not-allowed !important;
}
</style>
