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
        scrollElement: document.querySelector('.at-viewport'), // 确保在 DOM 更新后选择
        scrollOffsetY: -30
      }
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
              if (!overlayContent.innerText.startsWith('AlphaTex Error:')) {
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
          atOverlayRef.value.querySelector('.at-overlay-content').innerText = 'Error initializing AlphaTex (sync).';
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
          const overlayContent = atOverlayRef.value.querySelector('.at-overlay-content');
          // 如果 api.error.on 尚未显示特定的 AlphaTex 错误
          if (!overlayContent.innerText.startsWith('AlphaTex Error:')) {
            overlayContent.innerText = 'Error: Score data could not be loaded.';
          }
          atOverlayRef.value.style.display = 'flex'; // 确保覆盖层可见
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

    // 注入自定义样式（如果启用）
    injectAlphaTabStyle();
    
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
              if (!overlayContent.innerText.startsWith('AlphaTex Error:')) {
                  overlayContent.innerText = 'Failed to process AlphaTex: Error during update.';
              }
              atOverlayRef.value.style.display = 'flex';
            }
          });
      }
    } catch (e) { // api.tex() 调用期间的同步错误
      console.error('Synchronous error during tex update processing:', e);
      if (atOverlayRef.value) {
          atOverlayRef.value.querySelector('.at-overlay-content').innerText = 'Error initiating AlphaTex update (sync).';
          atOverlayRef.value.style.display = 'flex';
      }
    }
  }
}, { immediate: false });

// 切换自定义样式
function toggleCustomStyle() {
  customStyleEnabled.value = !customStyleEnabled.value;
  
  // 移除现有样式（如果存在）
  const existingStyle = document.getElementById('alphatab-custom-style');
  if (existingStyle) {
    document.head.removeChild(existingStyle);
  }
  
  // 如果启用了自定义样式，重新注入
  if (customStyleEnabled.value) {
    injectAlphaTabStyle();
  }
  
  // 关键修复：在样式改变后触发 AlphaTab 重新渲染
  if (alphaTabApi.value) {
    // 显示加载覆盖层
    if (atOverlayRef.value) {
      atOverlayRef.value.style.display = 'flex';
      atOverlayRef.value.querySelector('.at-overlay-content').innerText = '应用样式中...';
    }
    
    // 使用 setTimeout 确保样式处理优先，然后再执行重新渲染
    setTimeout(() => {
      try {
        // 触发重新渲染 - 关键步骤
        alphaTabApi.value.render();
      } catch (e) {
        console.error('Error during re-render after style change:', e);
      }
    }, 50);
  }
}

// 修改自定义样式注入函数，创建更有特色的主题
function injectAlphaTabStyle() {
  // 如果自定义样式未启用，直接返回
  if (!customStyleEnabled.value) return;

  const styleId = 'alphatab-custom-style';
  if (document.getElementById(styleId)) return; // 避免重复注入

  const style = document.createElement('style');
  style.id = styleId;
  style.innerHTML = `
    /* 自定义深色主题 */
    
    /* 全局背景色 */
    .at-main {
      background-color: #121212 !important; /* 深黑色背景 */
    }
    
    /* 音符颜色 - 更亮 */
    .at-main .at-notehead,
    .at-main svg .at-notehead,
    .at-main g[data-name="notehead"] * {
      fill: #80d8ff !important; /* 更亮的蓝色音符 */
      stroke: #40c4ff !important;
      stroke-width: 0.3px !important;
    }
    
    /* 加强音符边缘，增加可读性 */
    .at-main .at-note * {
      stroke-width: 0.4px !important;
    }

    /* 小节线颜色和风格 */
    .at-main .at-bar,
    .at-main svg .at-bar,
    .at-main g[data-name="bar"] * {
      stroke: #bdbdbd !important; /* 更亮的灰色小节线 */
      stroke-width: 2px !important;
      stroke-dasharray: 0 !important;
    }
    
    /* 小节尾部双线样式 */
    .at-main .at-bar[data-bar-type="double"],
    .at-main svg .at-bar[data-bar-type="double"],
    .at-main g[data-bar-type="double"] * {
      stroke: #ffffff !important; /* 白色 */
      stroke-width: 2.5px !important;
    }

    /* 播放光标颜色 */
    .at-main .at-cursor,
    .at-main svg .at-cursor,
    .at-main g[data-name="cursor"] * {
      stroke: #69f0ae !important; /* 更亮的绿色光标 */
      stroke-width: 3px !important;
      filter: drop-shadow(0 0 3px rgba(105, 240, 174, 0.8)) !important;
    }

    /* 播放高亮区域样式 */
    .at-main .at-highlight,
    .at-main svg .at-highlight,
    .at-main g[data-name="highlight"] * {
      fill: rgba(105, 240, 174, 0.2) !important; /* 稍微更亮的透明绿色背景 */
      stroke: #69f0ae !important; /* 亮绿色边框 */
      stroke-width: 1px !important;
    }
    
    /* 五线谱线条颜色 */
    .at-main .at-staff-line,
    .at-main svg .at-staff-line,
    .at-main g[data-name="staff"] line {
      stroke: #bdbdbd !important; /* 更亮的灰色线条 */
      stroke-width: 1px !important;
    }
    
    /* 符干颜色 - 更亮 */
    .at-main .at-stem,
    .at-main svg .at-stem,
    .at-main g[data-name="stem"] * {
      stroke: #80d8ff !important; /* 更亮的蓝色符干 */
      stroke-width: 1.5px !important;
    }
    
    /* 连音线和延音线 */
    .at-main .at-tie, 
    .at-main .at-slur,
    .at-main svg .at-tie,
    .at-main svg .at-slur {
      stroke: #e0e0e0 !important; /* 更亮的灰色连音线 */
      stroke-width: 1.5px !important;
      fill: none !important;
    }
    
    /* 歌词和文本 - 改为白色 */
    .at-main .at-lyrics *,
    .at-main .at-annotation * {
      fill: #ffffff !important; /* 纯白色文本 */
      font-weight: bold !important;
    }
    
    /* 标题和备注等 - 改为白色 */
    .at-main .at-text * {
      fill: #ffffff !important; /* 纯白色文本 */
      font-weight: bold !important;
    }
    
    /* 节拍器记号 - 改为白色 */
    .at-main .at-beat-text * {
      fill: #ffffff !important; /* 纯白色 */
      font-weight: bold !important;
    }
    
    /* 修改光标高亮样式 */
    .at-cursor-bar {
      background-color: rgba(105, 240, 174, 0.15) !important; /* 透明绿色 */
      border-left: 2px solid #69f0ae !important; /* 亮绿色边框 */
      box-shadow: 0 0 10px rgba(105, 240, 174, 0.4) !important; /* 更明显的绿色光晕 */
    }
    
    /* 吉他谱线 */
    .at-main .at-string-line,
    .at-main svg .at-string-line,
    .at-main g[data-name="tab"] line {
      stroke: #bdbdbd !important; /* 更亮的灰色吉他谱线 */
      stroke-width: 1px !important;
    }
    
    /* 吉他谱品格数字 - 改为更亮的色彩 */
    .at-main .at-tab-note text,
    .at-main g[data-name="tab-note"] text {
      fill: #ffffff !important; /* 纯白色品格数字 */
      font-weight: bold !important;
    }
      /* 🎵 品格数字（吉他谱） */
.at-main .at-tab-note text,
.at-main g[data-name="tab-note"] text {
  fill: #f0f0f0 !important; /* 亮灰色字体 */
  font-weight: bold !important;
  font-size: 13px !important;
  text-shadow: 0 0 2px #000; /* 提升可读性 */
}

/* 🎼 标题、作者、注释文本 */
.at-main .at-text *,
.at-main .at-annotation *,
.at-main g[data-name="text"] text,
.at-main g[data-name="annotation"] text {
  fill: #e0e0e0 !important;
  font-weight: bold !important;
  font-size: 14px !important;
}

/* 🎤 歌词 */
.at-main .at-lyrics *,
.at-main g[data-name="lyrics"] text {
  fill: #ffcc80 !important; /* 暖橙色歌词 */
  font-weight: bold !important;
  font-size: 13px !important;
}

/* 🎶 节拍器文本、动态标记（如 mf、ff） */
.at-main .at-beat-text *,
.at-main g[data-name="dynamic"] text {
  fill: #f48fb1 !important; /* 粉红色动态符号 */
  font-weight: bold !important;
  font-size: 12px !important;
}

  `;
  document.head.appendChild(style);
}

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
