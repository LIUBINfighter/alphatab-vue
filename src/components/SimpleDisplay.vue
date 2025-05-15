<template>
  <div class="at-wrap">
    <div class="at-overlay" ref="atOverlayRef" style="display: none;">
      <div class="at-overlay-content">
        Music sheet is loading
      </div>
    </div>
    <div class="at-content">
      <!-- <div class="at-sidebar">
        <TrackSelector
          :tracks="allTracks"
          :active-track-indices="currentActiveTrackIndices"
          @track-selected="handleTrackSelected"
        />
      </div> -->
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
import { onMounted, ref, toRaw, inject, watch } from 'vue' // 导入 watch
import ControlBar from './ControlBar.vue'

const props = defineProps({
  score: {
    type: [String, Object],
    required: true
  }
})

// 引用 AlphaTab 渲染目标元素 (.at-main) 和覆盖层元素 (.at-overlay)
const atMainRef = ref(null)
const atOverlayRef = ref(null)
const allTracks = ref([]) 
const currentActiveTrackIndices = ref(new Set())

// 获取注入的 API 引用
const alphaTabApi = inject('alphaTabApi')

// 封装 AlphaTab 初始化和加载逻辑
function initializeAlphaTab(scoreFileOrObject) {
  if (atMainRef.value && atOverlayRef.value) {
    // 如果已有 API 实例，先销毁
    if (alphaTabApi.value) {
      alphaTabApi.value.destroy();
    }

    const settings = {
      file: typeof scoreFileOrObject === 'string' ? scoreFileOrObject : undefined,
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
    
    alphaTabApi.value = new alphaTab.AlphaTabApi(atMainRef.value, settings);
    const api = alphaTabApi.value;

    if (typeof scoreFileOrObject === 'object') {
      api.load(scoreFileOrObject);
    }

    api.renderStarted.on(() => {
      if (atOverlayRef.value) {
        atOverlayRef.value.style.display = 'flex';
        atOverlayRef.value.querySelector('.at-overlay-content').innerText = 'Music sheet is loading';
      }
      const activeIndices = new Set();
      api.tracks.forEach(t => activeIndices.add(t.index));
      currentActiveTrackIndices.value = activeIndices;
    });
    
    api.renderFinished.on(() => {
      if (atOverlayRef.value) {
        atOverlayRef.value.style.display = 'none';
      }
    });

    api.scoreLoaded.on(score => {
      if (!score) {
        if (atOverlayRef.value) {
          atOverlayRef.value.querySelector('.at-overlay-content').innerText = 'Error loading score.';
        }
        allTracks.value = []; 
      } else {
        allTracks.value = score.tracks;
        
        const songTitleEl = document.querySelector('.at-song-title');
        const songArtistEl = document.querySelector('.at-song-artist');
        if (songTitleEl) songTitleEl.innerText = score.title;
        if (songArtistEl) songArtistEl.innerText = score.artist;
      }
    });
  } else {
    console.error('AlphaTab main container or overlay element not found');
  }
}

onMounted(() => {
  initializeAlphaTab(props.score);
})

// 监听 score prop 的变化
watch(() => props.score, (newScore) => {
  if (alphaTabApi.value && newScore) {
    // 显示加载覆盖层
    if (atOverlayRef.value) {
        atOverlayRef.value.style.display = 'flex';
        atOverlayRef.value.querySelector('.at-overlay-content').innerText = 'Switching score...';
    }
    // 重新初始化或加载新的乐谱
    // 简单起见，我们重新初始化。如果需要更平滑的过渡，可以考虑仅调用 api.load(newScore)
    // 但需要确保之前的状态被正确清理。
    // 对于 URL 字符串，直接重新初始化是比较稳妥的方式。
    // 对于对象，api.load() 应该足够。
    
    // 延迟一点以确保UI更新（加载提示）
    setTimeout(() => {
        if (typeof newScore === 'string') {
            initializeAlphaTab(newScore);
        } else if (typeof newScore === 'object') {
            // 如果 API 已经存在，并且我们确定 load 方法能正确处理，
            // 可以避免完全销毁和重建。
            // 但为了保证一致性和避免潜在的状态问题，重新初始化通常更安全。
            initializeAlphaTab(newScore); 
            // 或者，如果 alphaTabApi.value.load 可以处理好切换：
            // alphaTabApi.value.load(newScore);
        }
    }, 50); // 短暂延迟
  }
}, { immediate: false }); // immediate: false 避免在初始挂载时重复加载

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
  z-index: 1002; /* 确保在乐谱列表模态框之下 */

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
