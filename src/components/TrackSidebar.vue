<template>
  <div class="track-sidebar" :class="{ expanded }">
    <div class="sidebar-header" @click="toggleExpand">
      <Music class="sidebar-icon" />
      <span v-if="expanded">音轨</span>
    </div>
    <div v-if="expanded" class="tracks-container">
      <div
        v-for="track in tracks"
        :key="track.index"
        class="track-item"
        :class="{ 'active': isTrackActive(track.index) }"
      >
        <div class="track-header">
          <div class="track-name">{{ track.name }}</div>
        </div>
        <div class="track-controls">
          <div 
            class="control-button" 
            @click="toggleTrackSelection(track)" 
            :class="{ active: isTrackActive(track.index) }"
            title="切换音轨可见性"
          >
            <Eye v-if="isTrackActive(track.index)" class="control-icon" />
            <EyeOff v-else class="control-icon" />
          </div>
          <div 
            class="control-button" 
            @click="toggleMute(track)" 
            :class="{ active: isTrackMuted(track.index) }"
            :title="isTrackMuted(track.index) ? '取消静音' : '静音'"
          >
            <Volume2 v-if="!isTrackMuted(track.index) || (isTrackSolo(track.index) && !wasMutedWhenSoloed(track.index))" class="control-icon" />
            <VolumeX v-else class="control-icon" />
          </div>
          <div 
            class="control-button" 
            @click="toggleSolo(track)" 
            :class="{ active: isTrackSolo(track.index) }"
            :title="isTrackSolo(track.index) ? '取消独奏' : '独奏'"
          >
            <Headphones class="control-icon" />
          </div>
          <input
            type="range"
            class="volume-slider"
            min="0"
            max="1"
            step="0.01"
            :value="getTrackVolume(track.index)"
            @input="(e) => changeVolume(track, e.target.value)"
            title="音量"
          />
        </div>
      </div>
      <!-- 在音轨列表后添加说明 -->
      <div class="track-controls-help">
        <p>按钮说明：</p>
        <ul>
          <li><Eye class="help-icon" /> 控制音轨显示/隐藏</li>
          <li><Volume2 class="help-icon" /> 控制音轨静音/取消静音</li>
          <li><Headphones class="help-icon" /> 设置音轨独奏模式</li>
        </ul>
      <p>使用示例：</p>
      <ul>
          <li>1.不听原音练习，点亮 <Volume2 class="help-icon" />静音</li>
          <li>2.只听自己乐器，点亮 <Headphones class="help-icon" />Solo</li>
          <li>3.只看自己的谱 按灭其他的<Eye class="help-icon" /></li>
      </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted, watch } from 'vue';
import { Music, Volume2, VolumeX, Headphones, Eye, EyeOff } from 'lucide-vue-next';

const props = defineProps({
  selectedTrackIndex: {
    type: Number,
    default: -1
  }
});

const emit = defineEmits(['track-selected']);

const alphaTabApi = inject('alphaTabApi');
const tracks = ref([]);
const expanded = ref(false);
const activeTrackIndices = ref(new Set()); // Tracks that are currently rendered/visible
const mutedTrackIndices = ref(new Set());   // Tracks that the user *intends* to be muted (base mute state)
const soloTrackIndices = ref(new Set());    // Tracks that are currently soloed
const trackVolumes = ref({});

// Helper set to remember tracks that were muted *before* they were soloed.
// This helps restore their mute state correctly when solo is turned off.
const soloedAndOriginallyMuted = ref(new Set());

// Toggle sidebar expand state
const toggleExpand = () => {
  expanded.value = !expanded.value;
};

// Check if track is active (visible)
const isTrackActive = (trackIndex) => {
  return activeTrackIndices.value.has(trackIndex);
};

// Check if track is intended to be muted by the user
const isTrackMuted = (trackIndex) => {
  return mutedTrackIndices.value.has(trackIndex);
};

// Check if track is in solo mode
const isTrackSolo = (trackIndex) => {
  return soloTrackIndices.value.has(trackIndex);
};

// Helper to check if a track was muted when it was soloed (for UI icon logic)
const wasMutedWhenSoloed = (trackIndex) => {
    return soloedAndOriginallyMuted.value.has(trackIndex);
};


// Get track volume
const getTrackVolume = (trackIndex) => {
  return trackVolumes.value[trackIndex] !== undefined ? trackVolumes.value[trackIndex] : 1;
};

// Toggle track selection (visibility)
const toggleTrackSelection = (track) => {
  if (isTrackActive(track.index)) {
    if (activeTrackIndices.value.size === 1) { // Prevent hiding the last visible track
      return;
    }
    activeTrackIndices.value.delete(track.index);
  } else {
    activeTrackIndices.value.add(track.index);
  }
  updateRenderedTracks();
};

// Toggle track mute state
const toggleMute = (track) => {
  const trackIndex = track.index;
  const isCurrentlySetToMute = mutedTrackIndices.value.has(trackIndex);

  if (isCurrentlySetToMute) { // --- Action: Unmuting ---
    mutedTrackIndices.value.delete(trackIndex);
    if (alphaTabApi.value) {
      alphaTabApi.value.changeTrackMute([track], false);
    }
    // If this track was unmuted while it was soloed AND was originally muted,
    // then its "original mute" status is now void.
    if (soloedAndOriginallyMuted.value.has(trackIndex)) {
      soloedAndOriginallyMuted.value.delete(trackIndex);
    }
  } else { // --- Action: Muting ---
    mutedTrackIndices.value.add(trackIndex);
    if (alphaTabApi.value) {
      alphaTabApi.value.changeTrackMute([track], true);
    }
    // If this track is currently soloed, muting it should make it silent.
    // The API's changeTrackMute(true) should achieve this even if changeTrackSolo(true) is also active.
  }
  // Note: The actual playback depends on both mute and solo states.
  // If a track is soloed, changeTrackMute affects whether *that specific soloed track* makes sound.
};

// Toggle track solo state
const toggleSolo = (track) => {
  const trackIndex = track.index;
  const isCurrentlySoloed = soloTrackIndices.value.has(trackIndex);

  if (isCurrentlySoloed) { // --- Action: Turning Solo OFF for this track ---
    soloTrackIndices.value.delete(trackIndex);
    if (alphaTabApi.value) {
      // Inform API that this track is no longer soloed.
      // The API should handle its playback:
      // - Silent if other tracks are still soloed.
      // - Play/Mute based on its `mutedTrackIndices` status if no tracks are soloed.
      alphaTabApi.value.changeTrackSolo([track], false);
    }

    if (soloedAndOriginallyMuted.value.has(trackIndex)) {
      // This track was muted before being soloed. It should return to its muted state.
      // `mutedTrackIndices` should still contain it.
      if (soloTrackIndices.value.size === 0) { // If this was the last solo track being turned off
        // Ensure it's actually muted by the API, respecting its original mute intent.
         if(mutedTrackIndices.value.has(trackIndex) && alphaTabApi.value) {
            alphaTabApi.value.changeTrackMute([track], true);
         }
      }
      soloedAndOriginallyMuted.value.delete(trackIndex); // Clean up from helper set
    }
    // If soloTrackIndices is now empty, all tracks should revert to their normal mute/unmute playback
    // based on `mutedTrackIndices`. This is ideally handled by alphaTab's soloing logic when
    // the last solo is cleared. If not, a more comprehensive update function might be needed.

  } else { // --- Action: Turning Solo ON for this track ---
    soloTrackIndices.value.add(trackIndex);
    if (mutedTrackIndices.value.has(trackIndex)) {
      // This track is intended to be muted, but we are soloing it.
      // Record that it was originally muted.
      soloedAndOriginallyMuted.value.add(trackIndex);
      // Soloing should make it play, overriding its base mute state for playback.
      // The Mute button will remain active to show its underlying muted state.
      if (alphaTabApi.value) {
        // Preferred: API's changeTrackSolo(true) inherently overrides mute for playback.
        alphaTabApi.value.changeTrackSolo([track], true);
        // If API needs explicit unmute for solo playback:
        // alphaTabApi.value.changeTrackMute([track], false); // Temporarily unmute for API
        // alphaTabApi.value.changeTrackSolo([track], true);
      }
    } else {
      // Not muted, just solo it.
      if (alphaTabApi.value) {
        alphaTabApi.value.changeTrackSolo([track], true);
      }
    }

    // Ensure a soloed track is visible
    if (!isTrackActive(trackIndex)) {
      activeTrackIndices.value.add(trackIndex);
      updateRenderedTracks();
    }
  }
  // After any solo change, you might need a function to tell alphaTab
  // to update playback for ALL tracks if its internal solo logic isn't fully comprehensive.
  // e.g., refreshAllTracksPlaybackState();
};


// Change track volume
const changeVolume = (track, value) => {
  const volume = parseFloat(value);
  trackVolumes.value = { ...trackVolumes.value, [track.index]: volume };
  if (alphaTabApi.value) {
    alphaTabApi.value.changeTrackVolume([track], volume);
  }
};

// Update rendered tracks based on activeTrackIndices
const updateRenderedTracks = () => {
  if (!alphaTabApi.value || !alphaTabApi.value.score) return;

  const tracksToRender = alphaTabApi.value.score.tracks.filter(track =>
    activeTrackIndices.value.has(track.index)
  );

  if (tracksToRender.length > 0) {
    alphaTabApi.value.renderTracks(tracksToRender);
    if (tracksToRender.length === 1) {
      emit('track-selected', tracksToRender[0].index);
    } else {
      emit('track-selected', -1);
    }
  } else if (alphaTabApi.value.score.tracks.length > 0) {
    // Fallback: if somehow all tracks are deselected, render the first one
    // This case should ideally be prevented by toggleTrackSelection logic
    const firstTrack = alphaTabApi.value.score.tracks[0];
    activeTrackIndices.value.add(firstTrack.index);
    alphaTabApi.value.renderTracks([firstTrack]);
    emit('track-selected', firstTrack.index);
  }
};

// Initialize tracks and their states
const initializeTrackData = (score) => {
  if (!score) {
    tracks.value = [];
    activeTrackIndices.value.clear();
    mutedTrackIndices.value.clear();
    soloTrackIndices.value.clear();
    soloedAndOriginallyMuted.value.clear();
    trackVolumes.value = {};
    return;
  }

  tracks.value = score.tracks;
  const newActiveIndices = new Set();
  const newMutedIndices = new Set(); // Respect API's initial mute state if available
  const newSoloIndices = new Set();   // Respect API's initial solo state if available
  const newVolumes = { ...trackVolumes.value }; // Preserve existing volumes if any, or set defaults

  score.tracks.forEach(track => {
    // Default to all tracks visible
    newActiveIndices.add(track.index);

    // Initialize mute state from API if possible, otherwise default to not muted
    if (alphaTabApi.value && typeof alphaTabApi.value.isTrackMuted === 'function') { // Hypothetical API method
        if (alphaTabApi.value.isTrackMuted(track)) { // Check actual initial mute state from API
            newMutedIndices.add(track.index);
        }
    }
    // Similarly for solo state
     if (alphaTabApi.value && typeof alphaTabApi.value.isTrackSolo === 'function') { // Hypothetical API method
        if (alphaTabApi.value.isTrackSolo(track)) {
            newSoloIndices.add(track.index);
            if (newMutedIndices.has(track.index)) { // If initially solo AND muted by API
                soloedAndOriginallyMuted.value.add(track.index);
            }
        }
    }

    // Initialize volume if not already set
    if (newVolumes[track.index] === undefined) {
      newVolumes[track.index] = track.playbackInfo ? track.playbackInfo.volume : 1; // Use API's initial volume
    }
  });

  activeTrackIndices.value = newActiveIndices;
  mutedTrackIndices.value = newMutedIndices;
  soloTrackIndices.value = newSoloIndices;
  trackVolumes.value = newVolumes;

  // Initial rendering based on these states
  updateRenderedTracks();
  // You might also need to explicitly set initial mute/solo states with the API here
  // if just reading them isn't enough to sync component state with API reality.
};

// Watch for changes in the selected track from parent (e.g., SingleTrack component)
watch(() => props.selectedTrackIndex, (newIndex) => {
  if (!alphaTabApi.value || !alphaTabApi.value.score) return;

  if (newIndex === -1) { // Show all tracks
    const allIndices = new Set();
    alphaTabApi.value.score.tracks.forEach(t => allIndices.add(t.index));
    activeTrackIndices.value = allIndices;
  } else { // Show only the selected track
    activeTrackIndices.value = new Set([newIndex]);
  }
  updateRenderedTracks();
}, { immediate: true });


// Setup event listeners when component is mounted
onMounted(() => {
  watch(() => alphaTabApi.value, (api) => {
    if (!api) return;

    api.scoreLoaded.on((score) => {
      initializeTrackData(score);
    });

    // This listener might be too aggressive if API calls within this component also trigger it.
    // api.renderStarted.on(() => {
    //   // Re-sync active tracks if external changes occur, though typically this component controls it.
    //   if (api.tracks && api.score) { // Ensure api.tracks is the list of *rendered* tracks
    //      const currentlyRenderedIndices = new Set(api.tracks.map(t => t.index));
    //      activeTrackIndices.value = currentlyRenderedIndices;
    //   }
    // });

    // If score is already loaded when API becomes available
    if (api.score) {
      initializeTrackData(api.score);
    }
  }, { immediate: true });
});

</script>

<style scoped>
.track-sidebar {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 45px;
  background-color: #f5f5f5;
  border-right: 1px solid rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: width 0.3s ease;
  z-index: 1000; /* 提高z-index，确保在高光元素之上 */
}

.track-sidebar.expanded {
  width: 250px;
  overflow-y: auto;
  z-index: 1500; /* 展开时使用更高的z-index确保覆盖其他UI元素 */
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.15); /* 添加阴影提升视觉层次感 */
}

.sidebar-header {
  padding: 12px;
  display: flex;
  align-items: center;
  cursor: pointer;
  background-color: #436d9d;
  color: white;
}

.sidebar-icon {
  width: 20px;
  height: 20px;
  /* margin-right: 10px; */
}

.tracks-container {
  flex: 1;
  overflow-y: auto;
}

.track-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  padding: 8px;
  background-color: #fff;
}

.track-item.active {
  background-color: #f0f7ff;
}

.track-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.track-name {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
}

.track-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.control-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 4px;
  cursor: pointer;
  background-color: #f0f0f0;
}

.control-button:hover {
  background-color: #e0e0e0;
}

.control-button.active {
  background-color: #436d9d;
  color: white;
}

.control-icon {
  width: 16px;
  height: 16px;
}

.volume-slider {
  flex: 1;
  height: 4px;
  -webkit-appearance: none;
  background: #d3d3d3;
  outline: none;
  border-radius: 2px;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #436d9d;
  cursor: pointer;
}

.volume-slider::-moz-range-thumb {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #436d9d;
  cursor: pointer;
}

.track-controls-help {
  margin-top: 8px;
  padding: 8px;
  font-size: 12px;
  color: #666;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.track-controls-help p {
  margin: 0 0 4px 0;
}

.track-controls-help ul {
  margin: 0;
  padding-left: 20px;
}

.track-controls-help li {
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 2px 0;
}

.help-icon {
  width: 14px;
  height: 14px;
}
</style>
