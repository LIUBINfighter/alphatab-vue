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
import { onMounted, ref, toRaw, inject, watch, provide } from 'vue' // 添加 provide
import ControlBar from './ControlBar.vue'
import { applyDarkThemeViaApi, resetToDefaultTheme, injectAlphaTabStyle } from '../utils/alphaTabStyleUtils';

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
    // 如果为 null，ControlBar 将显示其默认的五个控件。
    // 如果传入一个数组，则该数组决定 ControlBar 显示哪些控件。
    default: null 
  }
})

// 引用 AlphaTab 渲染目标元素 (.at-main) 和覆盖层元素 (.at-overlay)
const atMainRef = ref(null)
const atOverlayRef = ref(null)
const allTracks = ref([]) 
const currentActiveTrackIndices = ref(new Set())

// 获取注入的 API 引用
const alphaTabApi = inject('alphaTabApi')

// 添加样式状态和控制
const customStyleEnabled = ref(false); // 默认不启用自定义样式
provide('customStyleEnabled', customStyleEnabled); // 提供给 StyleControl 组件使用
provide('toggleCustomStyle', toggleCustomStyle); // 提供切换方法

// 封装 AlphaTab 初始化和加载逻辑
function initializeAlphaTab() {
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
        scrollElement: typeof document !== 'undefined' ? document.querySelector('.at-viewport') : null, // 确保在 DOM 更新后选择
        scrollOffsetY: -30
      }
      // 移除初始化时的深色主题设置，使用默认样式
    };

    if (!props.tex && typeof props.score === 'string') {
      settings.file = props.score;
    }
    
    alphaTabApi.value = new alphaTab.AlphaTabApi(atMainRef.value, settings);
    const api = alphaTabApi.value;

    // 关键：添加 AlphaTex 错误处理程序
    api.error.on((error) => {
      console.error('AlphaTex Processing Error:', error);
      if (atOverlayRef.value) {
        atOverlayRef.value.style.display = 'flex';
        let errorMessageText = 'AlphaTex Error: An unexpected issue occurred.';
        if (error && error.message) {
          errorMessageText = `AlphaTex Error: ${error.message}`;
        } else if (typeof error === 'string') { // 不太常见，但可能
          errorMessageText = `AlphaTex Error: ${error}`;
        }
        atOverlayRef.value.querySelector('.at-overlay-content').innerText = errorMessageText;
      }
    });

    if (props.tex) {
      // 如果提供了 tex 内容，则加载它
      try {
        const texPromise = api.tex(props.tex);
        // 检查 tex() 是否返回 Promise，有些版本可能不返回
        if (texPromise && typeof texPromise.catch === 'function') {
          texPromise.catch(e => {
            console.error('Error in tex loading promise (init):', e);
            // api.error.on 应该提供具体细节。
            // 这是备用方案，以防 api.error.on 未触发或发生非 AlphaTex 错误。
            if (atOverlayRef.value) {
              const overlayContent = atOverlayRef.value.querySelector('.at-overlay-content');
              // 避免覆盖来自 api.error.on 的更具体的错误
              if (overlayContent && !overlayContent.innerText.startsWith('AlphaTex Error:')) {
                  overlayContent.innerText = 'Failed to process AlphaTex: Error during loading.';
              }
              atOverlayRef.value.style.display = 'flex';
            }
          });
        }
      } catch (e) { // api.tex() 调用期间的同步错误
        console.error('Synchronous error during initial tex processing:', e);
        if (atOverlayRef.value) {
          // 如果是 AlphaTex 解析错误，这可能会被 api.error.on 覆盖
          // 但作为备用方案是好的。
          const overlayContent = atOverlayRef.value.querySelector('.at-overlay-content');
          if(overlayContent) overlayContent.innerText = 'Error initializing AlphaTex (sync).';
          atOverlayRef.value.style.display = 'flex';
        }
      }
    } else if (typeof props.score === 'object') {
      // 如果 score 是一个对象，则加载它
      api.load(props.score);
    }
    // 如果 score 是一个字符串，它已在 settings.file 中设置，并将自动加载

    api.renderStarted.on(() => {
      if (atOverlayRef.value) {
        atOverlayRef.value.style.display = 'flex';
        const overlayContent = atOverlayRef.value.querySelector('.at-overlay-content');
        if(overlayContent) overlayContent.innerText = 'Music sheet is loading';
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
          const overlayContent = atOverlayRef.value.querySelector('.at-overlay-content');
          // 如果 api.error.on 尚未显示特定的 AlphaTex 错误
          if (overlayContent && !overlayContent.innerText.startsWith('AlphaTex Error:')) {
            overlayContent.innerText = 'Error: Score data could not be loaded.';
          }
          atOverlayRef.value.style.display = 'flex'; // 确保覆盖层可见
        }
        allTracks.value = []; 
      } else {
        allTracks.value = score.tracks;
        // 更新歌曲标题和艺术家信息（如果元素存在）
        // 这些元素可能在 TexEditorView 的简化版 ControlBar 中不存在
        if(typeof document !== 'undefined') {
            const songTitleEl = document.querySelector('.at-song-title');
            const songArtistEl = document.querySelector('.at-song-artist');
            if (songTitleEl) songTitleEl.innerText = score.title;
            if (songArtistEl) songArtistEl.innerText = score.artist;
        }
      }
    });

    // 不在初始化时注入自定义样式，而是根据状态决定
    if (customStyleEnabled.value) {
      applyDarkThemeViaApi(alphaTabApi.value);
      injectAlphaTabStyle(customStyleEnabled.value);
    }
    
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
        const overlayContent = atOverlayRef.value.querySelector('.at-overlay-content');
        if(overlayContent) overlayContent.innerText = 'Switching score...';
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
        const overlayContent = atOverlayRef.value.querySelector('.at-overlay-content');
        if(overlayContent) overlayContent.innerText = 'Updating AlphaTex...';
    }
    
    try {
      const texPromise = alphaTabApi.value.tex(newTex);
      // 检查 tex() 是否返回 Promise
      if (texPromise && typeof texPromise.then === 'function') {
        texPromise
          .then(() => {
            // AlphaTab 应该会自动触发 renderFinished 和 scoreLoaded
          })
          .catch(e => {
            console.error('Error in tex update promise:', e);
            // api.error.on 应该提供具体细节。
            // 这是备用方案。
            if (atOverlayRef.value) {
              const overlayContent = atOverlayRef.value.querySelector('.at-overlay-content');
              if (overlayContent && !overlayContent.innerText.startsWith('AlphaTex Error:')) {
                  overlayContent.innerText = 'Failed to process AlphaTex: Error during update.';
              }
              atOverlayRef.value.style.display = 'flex';
            }
          });
      }
    } catch (e) { // api.tex() 调用期间的同步错误
      console.error('Synchronous error during tex update processing:', e);
      if (atOverlayRef.value) {
          const overlayContent = atOverlayRef.value.querySelector('.at-overlay-content');
          if(overlayContent) overlayContent.innerText = 'Error initiating AlphaTex update (sync).';
          atOverlayRef.value.style.display = 'flex';
      }
    }
  }
}, { immediate: false });

// 切换自定义样式
function toggleCustomStyle() {
  customStyleEnabled.value = !customStyleEnabled.value;
  
  // 移除现有样式（如果存在）
  if (typeof document !== 'undefined') {
    const existingStyle = document.getElementById('alphatab-custom-style');
    if (existingStyle) {
      document.head.removeChild(existingStyle);
    }
  }
  
  if (alphaTabApi.value) {
    // 显示加载覆盖层
    if (atOverlayRef.value) {
      atOverlayRef.value.style.display = 'flex';
      const overlayContent = atOverlayRef.value.querySelector('.at-overlay-content');
      if(overlayContent) overlayContent.innerText = '应用样式中...';
    }
    
    if (customStyleEnabled.value) {
      // 只有启用自定义样式时才应用深色主题
      applyDarkThemeViaApi(alphaTabApi.value);
      injectAlphaTabStyle(customStyleEnabled.value);
    } else {
      // 否则恢复默认样式
      resetToDefaultTheme(alphaTabApi.value);
    }
    
    // 使用 setTimeout 确保样式处理优先，然后再执行重新渲染
    setTimeout(() => {
      try {
        // 触发重新渲染 - 关键步骤
        alphaTabApi.value.render();
      } catch (e) {
        console.error('Error during re-render after style change:', e);
      } finally {
        // 渲染完成后隐藏loading
        if (atOverlayRef.value) {
          setTimeout(() => {
            if (atOverlayRef.value) atOverlayRef.value.style.display = 'none';
          }, 100); // 短暂延迟确保渲染完成
        }
      }
    }, 50);
  }
}

// 以下函数已被移至 src/utils/alphaTabStyleUtils.ts
// function applyDarkThemeViaApi() { ... }
// function resetToDefaultTheme() { ... }
// function injectAlphaTabStyle() { ... }

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
  height: 100%; /* Changed from 97vh to 100% to fill parent */
  margin: 0 auto;
  border: 1px solid rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  /* min-width: 800px; */ /* 移除最小宽度，避免在小屏幕上产生水平滚动条 */
  box-sizing: border-box; /* 确保边框计入宽高 */
}

.at-content {
  position: relative;
  overflow: hidden;
  flex: 1 1 auto;
  box-sizing: border-box; /* 确保所有子元素正确计算大小 */
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
  box-sizing: border-box;
}

.at-sidebar:hover {
  max-width: 300px; /* Expanded width, adjust as needed */
  overflow-y: auto; /* Allow scrolling when expanded and content overflows */
}

.at-viewport {
  overflow-y: auto;
  position: absolute;
  top: 0;
  /* left: 70px; */ /* 移除固定左边距，适应没有sidebar的情况 */
  left: 0; /* 改为从页面左侧开始 */
  right: 0;
  bottom: 0;
  scroll-behavior: smooth;
  scroll-padding-top: 30px;
  box-sizing: border-box;
}

/* 当侧边栏存在时，视口需要偏移 */
.at-sidebar + .at-viewport {
  left: 70px; /* 只在侧边栏存在时应用这个偏移 */
}

.at-footer {
  flex: 0 0 auto;
  background: #436d9d;
  color: #fff;
  box-sizing: border-box;
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
  box-sizing: border-box;
}

.at-overlay-content {
  /* White box with drop-shadow */
  margin-top: 20px;
  background: #fff;
  box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.3);
  padding: 10px;
  border-radius: 4px; /* Optional: for rounded corners */
  box-sizing: border-box;
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

/* 添加全局盒模型设置确保更一致的尺寸计算 */
:deep(*) {
  box-sizing: border-box;
}
</style>
