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
      <ControlBar :features="controlBarFeatures" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, toRaw, inject, watch } from 'vue' // 导入 watch
import ControlBar from './ControlBar.vue'

const props = defineProps({
  score: {
    type: [String, Object],
    // required: true // 不再是必需的
  },
  tex: { // 新增：用于 AlphaTex 内容的 prop
    type: String,
  },
  controlBarFeatures: { // 新增：用于控制 ControlBar 的 prop
    type: Array,
    default: null // null 表示显示所有默认控件
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
function initializeAlphaTab() { // 移除 scoreFileOrObject 参数，直接从 props 读取
  if (atMainRef.value && atOverlayRef.value) {
    // 如果已有 API 实例，先销毁
    if (alphaTabApi.value) {
      alphaTabApi.value.destroy();
    }

    const settings = {
      // file: 将根据 props.score 的类型进行条件设置
      player: {
        enablePlayer: true,
        soundFont: 'https://cdn.jsdelivr.net/npm/@coderline/alphatab@latest/dist/soundfont/sonivox.sf2',
        enableCursor: true,
        enableHighlights: true,
        scrollMode: alphaTab.ScrollMode.Continuous,
        scrollElement: document.querySelector('.at-viewport'), // 确保在 DOM 更新后选择
        scrollOffsetY: -30
      }
    };

    if (!props.tex && typeof props.score === 'string') {
      settings.file = props.score;
    }
    
    alphaTabApi.value = new alphaTab.AlphaTabApi(atMainRef.value, settings);
    const api = alphaTabApi.value;

    if (props.tex) {
      // 如果提供了 tex 内容，则加载它
      api.tex(props.tex).catch(e => {
        console.error('Error loading tex on init:', e);
        if (atOverlayRef.value) {
          atOverlayRef.value.querySelector('.at-overlay-content').innerText = 'Error loading AlphaTex.';
        }
      });
    } else if (typeof props.score === 'object') {
      // 如果 score 是一个对象，则加载它
      api.load(props.score);
    }
    // 如果 score 是一个字符串，它已在 settings.file 中设置，并将自动加载

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
        // 更新歌曲标题和艺术家信息（如果元素存在）
        // 这些元素可能在 TexEditorView 的简化版 ControlBar 中不存在
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
  // 确保 .at-viewport 元素已挂载
  // initializeAlphaTab 现在不接受参数，它会从 props 读取
  initializeAlphaTab();
})

// 监听 score prop 的变化
watch(() => props.score, (newScore, oldScore) => {
  if (alphaTabApi.value && newScore && newScore !== oldScore && !props.tex) { // 仅当 score 变化且未使用 tex 时
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
        // initializeAlphaTab 会处理新的 props.score
        initializeAlphaTab();
    }, 50); // 短暂延迟
  }
}, { immediate: false });

// 新增：监听 tex prop 的变化
watch(() => props.tex, (newTex, oldTex) => {
  if (alphaTabApi.value && typeof newTex === 'string' && newTex !== oldTex) {
    if (atOverlayRef.value) {
        atOverlayRef.value.style.display = 'flex';
        atOverlayRef.value.querySelector('.at-overlay-content').innerText = 'Updating AlphaTex...';
    }
    alphaTabApi.value.tex(newTex)
      .then(() => {
        // AlphaTab 应该会自动触发 renderFinished 和 scoreLoaded
        // 如果没有，可能需要手动调用 api.render() 或类似方法
      })
      .catch(e => {
        console.error('Error updating tex:', e);
        if (atOverlayRef.value) {
            atOverlayRef.value.querySelector('.at-overlay-content').innerText = 'Error updating AlphaTex.';
        }
      });
  }
}, { immediate: false });

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
