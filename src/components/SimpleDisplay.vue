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
import { onMounted, ref, toRaw, inject } from 'vue'
import TrackSelector from './controls/TrackSelector.vue'
import ControlBar from './ControlBar.vue'

// 引用 AlphaTab 渲染目标元素 (.at-main) 和覆盖层元素 (.at-overlay)
const atMainRef = ref(null)
const atOverlayRef = ref(null)
const allTracks = ref([]) 
const currentActiveTrackIndices = ref(new Set())

// 获取注入的 API 引用
const alphaTabApi = inject('alphaTabApi')

onMounted(() => {
  if (atMainRef.value && atOverlayRef.value) {
    const settings = {
      file: '/scores/吉他与孤独与蓝色星球.gpx',
      player: {
        enablePlayer: true,
        soundFont: 'https://cdn.jsdelivr.net/npm/@coderline/alphatab@latest/dist/soundfont/sonivox.sf2',
        enableCursor: true,
        enableHighlights: true,
        scrollMode: alphaTab.ScrollMode.Continuous,
        scrollElement: document.querySelector('.at-viewport'),
        scrollOffsetY: -30
      }
    };
    
    // 创建 AlphaTab API 实例并设置全局引用
    alphaTabApi.value = new alphaTab.AlphaTabApi(atMainRef.value, settings)
    const api = alphaTabApi.value; // 使用本地变量简化代码

    // 加载状态覆盖层逻辑
    api.renderStarted.on(() => {
      if (atOverlayRef.value) {
        atOverlayRef.value.style.display = 'flex';
      }
      // 更新活动音轨
      const activeIndices = new Set();
      api.tracks.forEach(t => activeIndices.add(t.index));
      currentActiveTrackIndices.value = activeIndices;
    });
    
    api.renderFinished.on(() => {
      if (atOverlayRef.value) {
        atOverlayRef.value.style.display = 'none';
      }
    });

    // 确保 api.ready 后再渲染
    api.scoreLoaded.on(score => {
      if (!score) {
        if (atOverlayRef.value) {
          atOverlayRef.value.querySelector('.at-overlay-content').innerText = 'Error loading score.';
        }
        allTracks.value = []; 
      } else {
        allTracks.value = score.tracks;
        
        // 更新歌曲信息
        const songTitleEl = document.querySelector('.at-song-title');
        const songArtistEl = document.querySelector('.at-song-artist');
        if (songTitleEl) songTitleEl.innerText = score.title;
        if (songArtistEl) songArtistEl.innerText = score.artist;
      }
    });
  } else {
    console.error('AlphaTab main container or overlay element not found');
  }
})

function handleTrackSelected(trackFromEvent) {
  if (alphaTabApi.value) {
    const rawTrack = toRaw(trackFromEvent);
    alphaTabApi.value.renderTracks([rawTrack]);
  }
}
</script>

<style scoped>
.at-wrap {
  width: 100%;
  height: 97vh;
  margin: 0 auto;
  border: 1px solid rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  min-width: 800px; /* 添加最小宽度 */
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
  scroll-behavior: smooth;
  scroll-padding-top: 30px;
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

/* 播放高亮样式 */
:deep(.at-cursor-bar) {
  background-color: rgba(255, 242, 0, 0.25);
  transition: background-color 0.2s ease;
}

:deep(.at-cursor-beat) {
  background-color: rgba(64, 64, 255, 0.75);
  width: 3px;
  height: 100%;
  position: absolute;
  z-index: 10;
}

:deep(.at-highlight *) {
  fill: #0078ff;
  stroke: #0078ff;
  transition: fill 0.1s ease, stroke 0.1s ease;
}
</style>
