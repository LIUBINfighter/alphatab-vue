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
const isDisabled = ref(false) // 初始默认启用

// 处理播放/暂停逻辑
const handlePlayPause = (e) => {
  e.preventDefault()
  if (!isDisabled.value && alphaTabApi.value) {
    alphaTabApi.value.playPause()
  }
}

onMounted(() => {
  if (alphaTabApi.value) {
    // 监听播放器状态变化
    const onPlayerStateChanged = (args) => {
      playerState.value = args.state
    }
    alphaTabApi.value.playerStateChanged.on(onPlayerStateChanged)
    
    // 监听谱子加载状态，确定按钮是否应该被禁用
    const onScoreLoaded = (score) => {
      isDisabled.value = !score
    }
    
    // 检查当前是否已加载谱子
    if (!alphaTabApi.value.score) {
      isDisabled.value = true
      alphaTabApi.value.scoreLoaded.on(onScoreLoaded)
    }
    
    // 清理事件
    onUnmounted(() => {
      alphaTabApi.value.playerStateChanged.off(onPlayerStateChanged)
      alphaTabApi.value.scoreLoaded.off(onScoreLoaded)
    })
  }
})
</script>

<style scoped>
.disabled {
  opacity: 0.5;
  cursor: not-allowed !important;
}
</style>
