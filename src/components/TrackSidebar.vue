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
        <div class="track-header" @click="toggleTrackSelection(track)">
          <div class="track-name">{{ track.name }}</div>
          <div class="track-checkbox">
            <input 
              type="checkbox" 
              :checked="isTrackActive(track.index)"
              @click.stop="toggleTrackSelection(track)"
            />
          </div>
        </div>
        <div class="track-controls">
          <div class="control-button" @click="toggleMute(track)" :class="{ active: isTrackMuted(track.index) }">
            <Volume2 v-if="!isTrackMuted(track.index)" class="control-icon" />
            <VolumeX v-else class="control-icon" />
          </div>
          <div class="control-button" @click="toggleSolo(track)" :class="{ active: isTrackSolo(track.index) }">
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
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted, watch } from 'vue';
import { Music, Volume2, VolumeX, Headphones } from 'lucide-vue-next';

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
const activeTrackIndices = ref(new Set());
const mutedTrackIndices = ref(new Set());
const soloTrackIndices = ref(new Set());
const trackVolumes = ref({});

// Toggle sidebar expand state
const toggleExpand = () => {
  expanded.value = !expanded.value;
};

// Check if track is active
const isTrackActive = (trackIndex) => {
  return activeTrackIndices.value.has(trackIndex);
};

// Check if track is muted
const isTrackMuted = (trackIndex) => {
  return mutedTrackIndices.value.has(trackIndex);
};

// Check if track is in solo mode
const isTrackSolo = (trackIndex) => {
  return soloTrackIndices.value.has(trackIndex);
};

// Get track volume
const getTrackVolume = (trackIndex) => {
  return trackVolumes.value[trackIndex] !== undefined ? trackVolumes.value[trackIndex] : 1;
};

// Toggle track selection
const toggleTrackSelection = (track) => {
  if (isTrackActive(track.index)) {
    // 如果点击的是当前唯一显示的音轨，不执行任何操作
    if (activeTrackIndices.value.size === 1) {
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
  const isMuted = isTrackMuted(track.index);
  
  if (isMuted) {
    mutedTrackIndices.value.delete(track.index);
  } else {
    mutedTrackIndices.value.add(track.index);
  }

  if (alphaTabApi.value) {
    alphaTabApi.value.changeTrackMute([track], !isMuted);
  }
};

// Toggle track solo state
const toggleSolo = (track) => {
  const isSolo = isTrackSolo(track.index);
  
  if (isSolo) {
    soloTrackIndices.value.delete(track.index);
  } else {
    soloTrackIndices.value.add(track.index);
    
    // 当启用独奏模式时，自动将该音轨添加到活动音轨中
    if (!isTrackActive(track.index)) {
      activeTrackIndices.value.add(track.index);
      updateRenderedTracks();
    }
  }

  if (alphaTabApi.value) {
    alphaTabApi.value.changeTrackSolo([track], !isSolo);
  }
};

// Change track volume
const changeVolume = (track, value) => {
  const volume = parseFloat(value);
  trackVolumes.value = { ...trackVolumes.value, [track.index]: volume };
  
  if (alphaTabApi.value) {
    alphaTabApi.value.changeTrackVolume([track], volume);
  }
};

// Update rendered tracks
const updateRenderedTracks = () => {
  if (!alphaTabApi.value || !alphaTabApi.value.score) return;
  
  const tracksToRender = alphaTabApi.value.score.tracks.filter(track => 
    activeTrackIndices.value.has(track.index)
  );
  
  if (tracksToRender.length > 0) {
    alphaTabApi.value.renderTracks(tracksToRender);
    
    // 如果只选中了一个音轨，通知父组件更新 SingleTrack
    if (tracksToRender.length === 1) {
      emit('track-selected', tracksToRender[0].index);
    } else {
      emit('track-selected', -1); // -1 表示多个或全部音轨
    }
  }
};

// Initialize tracks and states
const initializeTrackData = (score) => {
  if (!score) {
    tracks.value = [];
    activeTrackIndices.value.clear();
    return;
  }
  
  tracks.value = score.tracks;
  
  // 初始化时默认所有音轨都是活动的
  const newActiveIndices = new Set();
  score.tracks.forEach(track => {
    newActiveIndices.add(track.index);
    
    // 初始化音量为 1
    if (trackVolumes.value[track.index] === undefined) {
      trackVolumes.value[track.index] = 1;
    }
  });
  
  activeTrackIndices.value = newActiveIndices;
};

// Watch for changes in the selected track from SingleTrack component
watch(() => props.selectedTrackIndex, (newIndex) => {
  if (newIndex === -1) {
    // 如果是 -1，表示选择了全部音轨
    if (alphaTabApi.value?.score) {
      const allIndices = new Set();
      alphaTabApi.value.score.tracks.forEach(t => allIndices.add(t.index));
      activeTrackIndices.value = allIndices;
    }
  } else {
    // 如果选择了单个音轨，则只激活该音轨
    activeTrackIndices.value = new Set([newIndex]);
  }
}, { immediate: true });

// Setup event listeners
onMounted(() => {
  // Watch for API availability and setup listeners
  watch(() => alphaTabApi.value, (api) => {
    if (!api) return;
    
    // Add listeners for score and track state changes
    api.scoreLoaded.on((score) => {
      initializeTrackData(score);
    });
    
    api.renderStarted.on(() => {
      // 更新活动音轨状态
      activeTrackIndices.value = new Set(api.tracks.map(t => t.index));
    });
    
    // Initialize if score is already loaded
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
  margin-right: 10px;
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
  cursor: pointer;
  margin-bottom: 8px;
}

.track-name {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
}

.track-checkbox {
  flex: 0 0 auto;
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
</style>
