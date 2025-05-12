<template>
  <div class="at-wrap">
    <div class="at-overlay" ref="atOverlayRef" style="display: none;">
      <div class="at-overlay-content">
        Music sheet is loading
      </div>
    </div>
    <div class="at-content">
      <div class="at-sidebar">
        <TrackSelector
          :tracks="allTracks"
          :active-track-indices="currentActiveTrackIndices"
          @track-selected="handleTrackSelected"
        />
      </div>
      <div class="at-viewport">
        <div class="at-main" ref="atMainRef"></div>
      </div>
    </div>
    <div class="at-controls">
      <ControlBar />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, toRaw } from 'vue' // 导入 toRaw
import TrackSelector from './TrackSelector.vue' // Import the new component
import ControlBar from './ControlBar.vue' // Import ControlBar component

// 引用 AlphaTab 渲染目标元素 (.at-main) 和覆盖层元素 (.at-overlay)
const atMainRef = ref(null)
const atOverlayRef = ref(null)
const alphaTabApiInstance = ref(null) // Store the api instance
const allTracks = ref([]) // To store all tracks from the score
const currentActiveTrackIndices = ref(new Set()) // To store indices of active/rendered tracks

onMounted(() => {
  if (atMainRef.value && atOverlayRef.value) {
    const settings = {
      file: 'https://www.alphatab.net/files/canon.gp', // 替换为你自己的谱子路径
      // player: { // Player settings can be added here if needed
      //   enablePlayer: true,
      //   soundFont: 'https://cdn.jsdelivr.net/npm/@coderline/alphatab@latest/dist/soundfont/sonivox.sf2'
      // }
    };
    // Assign to the ref's value property
    alphaTabApiInstance.value = new alphaTab.AlphaTabApi(atMainRef.value, settings)
    const api = alphaTabApiInstance.value; // Use local const for convenience in this block

    // 加载状态覆盖层逻辑
    api.renderStarted.on(() => {
      if (atOverlayRef.value) {
        atOverlayRef.value.style.display = 'flex';
      }
      // 更新活动音轨
      // 重要：此处的 api.tracks 指的是 AlphaTab 当前配置为渲染的音轨。
      // 当使用选择调用 renderTracks 时，api.tracks 将反映该选择。
      const activeIndices = new Set();
      api.tracks.forEach(t => activeIndices.add(t.index));
      currentActiveTrackIndices.value = activeIndices;
    });
    api.renderFinished.on(() => {
      if (atOverlayRef.value) {
        atOverlayRef.value.style.display = 'none';
      }
    });
    // 如果谱子加载失败，也隐藏覆盖层并显示错误
    // Populate tracks for the selector when score is loaded
    api.scoreLoaded.on(score => {
      if (!score) {
        if (atOverlayRef.value) {
          atOverlayRef.value.querySelector('.at-overlay-content').innerText = 'Error loading score.';
          // 可以选择不隐藏，让用户看到错误信息
          // setTimeout(() => { if(atOverlayRef.value) atOverlayRef.value.style.display = 'none'; }, 3000);
        }
        allTracks.value = []; // Clear tracks on error
      } else {
        allTracks.value = score.tracks; // Populate tracks
        // Optionally, render all tracks initially or a default set
        // api.renderTracks(score.tracks); // This would make all tracks active initially
      }
    });
  } else {
    console.error('AlphaTab main container or overlay element not found');
  }
})

function handleTrackSelected(trackFromEvent) {
  if (alphaTabApiInstance.value) {
    // trackFromEvent 可能是一个 Vue Proxy 对象。
    // 如果 Proxy 导致克隆问题，AlphaTab 的 renderTracks 可能需要原始对象。
    const rawTrack = toRaw(trackFromEvent);
    alphaTabApiInstance.value.renderTracks([rawTrack]);
  }
}

</script>

<style scoped>
.at-wrap {
  width: 80vw;
  height: 80vh;
  margin: 0 auto;
  border: 1px solid rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.at-content {
  position: relative;
  overflow: hidden;
  flex: 1 1 auto;
}

.at-sidebar {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  max-width: 70px; /* Collapsed width */
  width: auto; /* Or a fixed width like 70px */
  display: flex;
  z-index: 1001;
  overflow: hidden; /* Important for the expand/collapse transition */
  border-right: 1px solid rgba(0, 0, 0, 0.12);
  background: #f7f7f7;
  transition: max-width 0.2s ease-in-out; /* Smooth transition for expand/collapse */
}

.at-sidebar:hover {
  max-width: 300px; /* Expanded width, adjust as needed */
  overflow-y: auto; /* Allow scrolling when expanded and content overflows */
}

.at-viewport {
  overflow-y: auto;
  position: absolute;
  top: 0;
  left: 70px;
  right: 0;
  bottom: 0;
  padding-right: 20px;
}

.at-footer {
  flex: 0 0 auto;
  background: #436d9d;
  color: #fff;
}

.at-overlay {
  /* Fill Parent */
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1002;

  /* Blurry dark shade */
  backdrop-filter: blur(3px);
  background: rgba(0, 0, 0, 0.5);

  /* Center content */
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.at-overlay-content {
  /* White box with drop-shadow */
  margin-top: 20px;
  background: #fff;
  box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.3);
  padding: 10px;
  border-radius: 4px; /* Optional: for rounded corners */
}
</style>
