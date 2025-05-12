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
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

onMounted(() => {
  if (alphaTabApi.value) {
    alphaTabApi.value.playerPositionChanged.on((e) => {
      const currentSeconds = Math.floor(e.currentTime / 1000)
      if (currentSeconds !== previousTime.value) {
        previousTime.value = currentSeconds
        currentPosition.value = formatDuration(e.currentTime)
        totalDuration.value = formatDuration(e.endTime)
      }
    })
  }
})
</script>

<style scoped>
</style>
