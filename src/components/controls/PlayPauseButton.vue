<template>
  <a class="btn at-play-pause" :class="{ disabled: isDisabled }" @click="handlePlayPause">
    <Play v-if="playerState === 0" class="icon" />
    <Pause v-else class="icon" />
  </a>
</template>

<script setup>
import { ref, inject, onMounted, onUnmounted } from 'vue'
import { Play, Pause } from 'lucide-vue-next'

const alphaTabApi = inject('alphaTabApi')
const playerState = ref(0) // 0=stopped, 1=playing, 2=paused
const isDisabled = ref(true) // 初始状态禁用，直到谱子加载完成

// 处理播放/暂停逻辑
const handlePlayPause = (e) => {
  e.stopPropagation()
  if (!isDisabled.value && alphaTabApi.value) {
    alphaTabApi.value.playPause()
  }
}

// 监听播放器状态变化
let playerStateChangedHandler = null
let scoreLoadedHandler = null
let playerReadyHandler = null

onMounted(() => {
  if (alphaTabApi.value) {
    // 监听播放状态变化
    playerStateChangedHandler = (args) => {
      playerState.value = args.state
    }
    alphaTabApi.value.playerStateChanged.on(playerStateChangedHandler)
    
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
    if (playerStateChangedHandler) {
      alphaTabApi.value.playerStateChanged.off(playerStateChangedHandler)
    }
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
