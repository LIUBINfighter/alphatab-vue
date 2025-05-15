<template>
  <div class="at-control">
    <Music class="control-icon" />
    <select
      class="control-select"
      v-model="selectedTrackIndex"
      @change="selectTrack"
    >
      <option value="-1">所有音轨</option>
      <option v-for="track in tracks" :key="track.index" :value="track.index">
        {{ track.name }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref, inject, onMounted, onUnmounted } from 'vue'
import { Music } from 'lucide-vue-next'

const alphaTabApi = inject('alphaTabApi')
const tracks = ref([])
const selectedTrackIndex = ref(-1)

const selectTrack = () => {
  if (!alphaTabApi.value || !alphaTabApi.value.score) return

  // Render selected tracks
  if (selectedTrackIndex.value === -1) {
    // Render all tracks
    alphaTabApi.value.renderTracks(alphaTabApi.value.score.tracks)
  } else {
    // Render only selected track
    const track = alphaTabApi.value.score.tracks.find(t => t.index === selectedTrackIndex.value)
    if (track) {
      alphaTabApi.value.renderTracks([track])
    }
  }
}

onMounted(() => {
  if (alphaTabApi.value) {
    const onScoreLoaded = (score) => {
      if (score) {
        tracks.value = score.tracks
        selectedTrackIndex.value = -1
      } else {
        tracks.value = []
        selectedTrackIndex.value = -1
      }
    }

    const onTrackStateChanged = () => {
      if (!alphaTabApi.value?.score) return
      
      const renderedTracks = alphaTabApi.value.tracks
      if (renderedTracks.length === alphaTabApi.value.score.tracks.length) {
        selectedTrackIndex.value = -1
      } else if (renderedTracks.length === 1) {
        selectedTrackIndex.value = renderedTracks[0].index
      }
    }

    alphaTabApi.value.scoreLoaded.on(onScoreLoaded)
    alphaTabApi.value.renderStarted.on(onTrackStateChanged)

    // Initialize if score already loaded
    if (alphaTabApi.value.score) {
      onScoreLoaded(alphaTabApi.value.score)
    }

    onUnmounted(() => {
      alphaTabApi.value?.scoreLoaded.off(onScoreLoaded)
      alphaTabApi.value?.renderStarted.off(onTrackStateChanged)
    })
  }
})
</script>

<style scoped>
.at-control {
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
}

.control-icon {
  width: 20px;
  height: 20px;
  color: #fff;
}

.control-select {
  appearance: none;
  background-color: transparent;
  color: #fff;
  border: none;
  padding: 4px 24px 4px 8px;
  font-size: 14px;
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 2px center;
  background-size: 16px;
}

.control-select option {
  background-color: #2c3e50;
  color: #fff;
}
</style>