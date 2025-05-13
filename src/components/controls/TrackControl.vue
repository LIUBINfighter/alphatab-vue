<template>
  <div class="at-control">
    <Music class="control-icon" />
    <select
      class="control-select"
      v-model="selectedTrackIndex"
      @change="selectTrack"
    >
      <option value="-1">所有音轨</option> <!-- Option for all tracks -->
      <option v-for="track in tracks" :key="track.index" :value="track.index">
        {{ track.name }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref, inject, onMounted, onUnmounted } from 'vue'
import { Music } from 'lucide-vue-next' // Using Music icon from lucide-vue-next

const alphaTabApi = inject('alphaTabApi')
const tracks = ref([])
const selectedTrackIndex = ref(-1) // -1 for all tracks

// Function to update displayed tracks based on selection
const selectTrack = () => {
  if (!alphaTabApi.value || !alphaTabApi.value.score) return

  const score = alphaTabApi.value.score
  score.tracks.forEach(track => {
    // Mute/unmute tracks based on selection
    // If selectedTrackIndex is -1, unmute all. Otherwise, mute all except the selected one.
    const isMuted = selectedTrackIndex.value !== -1 && track.index !== selectedTrackIndex.value
    alphaTabApi.value.setTrackMuteState(track.index, isMuted)
  })
  // Re-render might be needed depending on alphaTab's API for track visibility
  // alphaTabApi.value.render() // Or maybe just setTrackMuteState is enough
}

onMounted(() => {
  if (alphaTabApi.value) {
    // Listen for score loaded to get tracks
    const onScoreLoaded = (score) => {
      if (score) {
        tracks.value = score.tracks
        // Set initial selection based on current mute states if needed,
        // or default to -1 (All Tracks)
        // For simplicity, let's default to -1 initially.
        selectedTrackIndex.value = -1;
      } else {
        tracks.value = []
        selectedTrackIndex.value = -1;
      }
    }

    // Listen for track mute state changes to update the dropdown selection
    // This is important if mute states can be changed by other means
    const onTrackMuteStateChanged = (args) => {
         // If multiple tracks are unmuted, the dropdown should probably show "All Tracks"
         // If only one track is unmuted, show that track
         // If all are muted, show "All Tracks"
         const unmutedTracks = alphaTabApi.value.score?.tracks.filter(track => !alphaTabApi.value.isTrackMuted(track.index)) || [];

         if (unmutedTracks.length === alphaTabApi.value.score?.tracks.length || unmutedTracks.length === 0) {
             selectedTrackIndex.value = -1; // All tracks unmuted or all muted
         } else if (unmutedTracks.length === 1) {
             selectedTrackIndex.value = unmutedTracks[0].index; // Only one track unmuted
         } else {
             // If multiple tracks are unmuted but not all, the dropdown state is ambiguous.
             // We might keep the current selection or default to -1.
             // Let's default to -1 for simplicity in this case.
             selectedTrackIndex.value = -1;
         }
    }


    alphaTabApi.value.scoreLoaded.on(onScoreLoaded)
    alphaTabApi.value.trackMuteStateChanged.on(onTrackMuteStateChanged)


    // Check initial score state if already loaded
    if (alphaTabApi.value.score) {
       onScoreLoaded(alphaTabApi.value.score);
       // Also check initial mute states
       onTrackMuteStateChanged(null); // Pass null as args are not used
    }


    // Cleanup event listeners
    onUnmounted(() => {
      alphaTabApi.value?.scoreLoaded.off(onScoreLoaded)
      alphaTabApi.value?.trackMuteStateChanged.off(onTrackMuteStateChanged)
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