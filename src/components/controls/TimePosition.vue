<template>
  <div class="at-song-position">{{ currentPosition }} / {{ totalDuration }}</div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'

const currentPosition = ref('00:00')
const totalDuration = ref('00:00')
const previousTime = ref(0)
const alphaTabApi = inject('alphaTabApi')

function formatDuration(milliseconds) {
  if (!milliseconds) return '00:00'
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

import { watchEffect } from 'vue'

watchEffect(() => {
  if (!alphaTabApi.value) {
    console.warn('alphaTabApi not available yet')
    return
  }

  // 监听播放位置变化
  const positionChangedHandler = (e) => {
    if (e && typeof e.currentTime === 'number' && typeof e.endTime === 'number') {
      const currentSeconds = Math.floor(e.currentTime / 1000)
      if (currentSeconds !== previousTime.value) {
        previousTime.value = currentSeconds
        currentPosition.value = formatDuration(e.currentTime)
        totalDuration.value = formatDuration(e.endTime)
      }
    }
  }

  // 监听乐谱加载完成事件
  const scoreLoadedHandler = (score) => {
    if (score) {
      const duration = alphaTabApi.value.score?.duration
      totalDuration.value = formatDuration(duration)
    }
  }

  alphaTabApi.value.playerPositionChanged.on(positionChangedHandler)
  alphaTabApi.value.scoreLoaded.on(scoreLoadedHandler)

  // 清理函数
  return () => {
    alphaTabApi.value?.playerPositionChanged.off(positionChangedHandler)
    alphaTabApi.value?.scoreLoaded.off(scoreLoadedHandler)
  }
})
</script>

<style scoped>
.at-song-position {
  min-width: 110px;
  text-align: center;
  padding: 0 10px;
}
</style>
