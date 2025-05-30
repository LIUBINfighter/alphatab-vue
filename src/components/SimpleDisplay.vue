<!-- SimpleDisplay.vue -->
<template>
  <div class="at-wrap">
    <div class="at-overlay" ref="atOverlayRef" style="display: none;">
      <div class="at-overlay-content">
        Music sheet is loading
      </div>
    </div>
    <div class="at-content">
      <TrackSidebar 
        v-if="showTrackSidebar"
        :selected-track-index="selectedTrackIndex"
        @track-selected="handleTrackSidebarSelection"
      />
      <div class="at-viewport" :class="{'has-sidebar': showTrackSidebar}">
        <div class="at-main" ref="atMainRef"></div>
      </div>
    </div>
    <div class="at-controls">
      <ControlBar :features="controlBarFeatures" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, toRaw, inject, watch, provide, nextTick } from 'vue' // 添加 provide 和 nextTick
import ControlBar from './ControlBar.vue'
import TrackSidebar from './TrackSidebar.vue'
import { applyDarkThemeViaApi, resetToDefaultTheme, injectAlphaTabStyle } from '../utils/alphaTabStyleUtils';
import * as alphaTab from '@coderline/alphatab';

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
  },
  showTrackSidebar: { // 新增：控制是否显示音轨侧边栏
    type: Boolean,
    default: true
  },
  alwaysScrollToBottom: { // 新增：控制是否始终滚动到底部
    type: Boolean,
    default: false
  }
})

// 引用 AlphaTab 渲染目标元素 (.at-main) 和覆盖层元素 (.at-overlay)
const atMainRef = ref(null)
const atOverlayRef = ref(null)
const allTracks = ref([]) 
const currentActiveTrackIndices = ref(new Set())
const selectedTrackIndex = ref(-1) // 当前选中的音轨索引，用于与 SingleTrack 联动

// 获取注入的 API 引用
const alphaTabApi = inject('alphaTabApi')

// 添加样式状态和控制
const customStyleEnabled = ref(false); // 默认不启用自定义样式
provide('customStyleEnabled', customStyleEnabled); // 提供给 DarkTheme 组件使用
provide('toggleCustomStyle', toggleCustomStyle); // 提供切换方法

function initializeAlphaTab() {
  if (atMainRef.value && atOverlayRef.value) {
    if (alphaTabApi.value) {
      alphaTabApi.value.destroy();
    }

    const settings = {
      core: { // ✅ 确保 core 部分存在且配置正确
        fontDirectory: '/alphatab/dist/font/' // ✅ 字体文件夹路径
      },
      player: {
        enablePlayer: true,
        soundFont: '/alphatab/dist/soundfont/sonivox.sf2', // 你这个路径已正确
        engine: '/alphatab/dist/alphaTab.worker.mjs',      // ✅ Worker 路径
        enableCursor: true,
        enableHighlights: true,
        scrollMode: alphaTab.ScrollMode.Continuous,
        scrollElement: typeof document !== 'undefined' ? document.querySelector('.at-viewport') : null,
        scrollOffsetY: -30
      }
      // 'file' 属性会根据 props.score 动态设置 (如下面的逻辑所示)
    };

    // console.log("settings",settings)

    if (!props.tex && typeof props.score === 'string') {
      settings.file = props.score; // 将乐谱文件路径添加到 settings
    }
    
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
      // 使用封装的方法执行滚动操作
      if (props.alwaysScrollToBottom && alphaTabApi.value) {
        scrollToBottom();
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

// 封装"滚动到底部"的功能为一个可重用的方法
function scrollToBottom() {
  if (!alphaTabApi.value) return;
  
  nextTick(() => {
    // 确保分数已加载
    if (alphaTabApi.value.score) {
      try {
        const score = alphaTabApi.value.score;
        const masterBars = score.masterBars;
        
        // 如果没有小节，则退出
        if (!masterBars || masterBars.length === 0) {
          console.warn('无法滚动：没有小节');
          return;
        }
        
        // 策略1：直接使用DOM滚动（简单可靠的方法）
        const viewport = document.querySelector('.at-viewport');
        if (viewport) {
          setTimeout(() => {
            viewport.scrollTop = viewport.scrollHeight;
          }, 10);
        }
        
        // 策略2：尝试设置位置并延迟滚动（API方法）
        setTimeout(() => {
          try {
            // 找到最后一个有效的小节
            let lastValidBarIndex = -1;
            for (let i = masterBars.length - 1; i >= 0; i--) {
              if (masterBars[i] && masterBars[i].calculateDuration() > 0) {
                lastValidBarIndex = i;
                break;
              }
            }
            
            if (lastValidBarIndex >= 0) {
              const targetBar = masterBars[lastValidBarIndex];
              const endTick = targetBar.start + targetBar.calculateDuration();
              
              // 设置位置并延迟滚动（给AlphaTab更多时间更新内部状态）
              alphaTabApi.value.tickPosition = endTick;
              
              // 尝试使用API滚动
              setTimeout(() => {
                try {
                  alphaTabApi.value.scrollToCursor();
                } catch (err) {
                  console.warn('API滚动失败，使用DOM滚动:', err);
                }
              }, 150); // 更长的延迟确保位置更新
            }
          } catch (e) {
            console.warn('设置tickPosition失败:', e);
          }
        }, 50);
        
      } catch (e) {
        console.error('滚动到乐谱末尾时出错:', e);
        
        // 最终回退：尝试找到任何可滚动的容器
        const scrollElement = document.querySelector('.at-viewport');
        if (scrollElement) {
          scrollElement.scrollTop = scrollElement.scrollHeight;
        }
      }
    } else {
      // 如果分数未加载，使用简单的 DOM 滚动
      const scrollElement = document.querySelector('.at-viewport');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  });
}

// 监听 alwaysScrollToBottom 属性的变化，当变为 true 时立即滚动到底部
watch(() => props.alwaysScrollToBottom, (newValue) => {
  if (newValue && alphaTabApi.value) {
    // 当选中"始终滚动至底部"时，立即执行一次滚动
    scrollToBottom();
  }
});

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
  const hasStyleControl = document.querySelector('.style-selector') !== null;
  customStyleEnabled.value = !customStyleEnabled.value;
  
  if (atOverlayRef.value) {
    atOverlayRef.value.style.display = 'flex';
    const overlayContent = atOverlayRef.value.querySelector('.at-overlay-content');
    if(overlayContent) overlayContent.innerText = '应用样式中...';
  }
  
  try {
    // 如果没有StyleControl，只在默认和暗色主题之间切换
    if (!hasStyleControl) {
      if (customStyleEnabled.value) {
        applyTheme('dark', alphaTabApi.value);
      } else {
        applyTheme('default', alphaTabApi.value);
      }
    }
    // 如果有StyleControl，保持原有逻辑不变
    
    setTimeout(() => {
      try {
        if (alphaTabApi.value) {
          alphaTabApi.value.render();
        }
      } catch (e) {
        console.error('Error during re-render after style change:', e);
      } finally {
        if (atOverlayRef.value) {
          setTimeout(() => {
            if (atOverlayRef.value) atOverlayRef.value.style.display = 'none';
          }, 100);
        }
      }
    }, 50);
  } catch (e) {
    console.error('应用样式时发生错误:', e);
    if (atOverlayRef.value) {
      atOverlayRef.value.style.display = 'none';
    }
  }
}

function handleTrackSelected(trackFromEvent) {
  if (alphaTabApi.value) {
    const rawTrack = toRaw(trackFromEvent);
    alphaTabApi.value.renderTracks([rawTrack]);
    
    // 更新选中的音轨索引，用于 TrackSidebar 联动
    selectedTrackIndex.value = rawTrack.index;
  }
}

// 新增：处理 TrackSidebar 中的音轨选择
function handleTrackSidebarSelection(trackIndex) {
  selectedTrackIndex.value = trackIndex;
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
  left: 0; /* 默认从左侧开始 */
  right: 0;
  bottom: 0;
  scroll-behavior: smooth;
  scroll-padding-top: 30px;
  box-sizing: border-box;
  transition: left 0.3s ease; /* 添加过渡效果 */

  /* Custom scrollbar styles */
  scrollbar-width: thin;
  scrollbar-color: var(--scrollbar-thumb-bg) var(--scrollbar-bg);
}

.at-viewport::-webkit-scrollbar {
  width: 10px;
  height: 10px;
  background-color: var(--scrollbar-bg);
}

.at-viewport::-webkit-scrollbar-thumb {
  background-color: var(--scrollbar-thumb-bg);
  border-radius: 5px;
  border: 2px solid var(--scrollbar-border-color);
  background-clip: content-box;
}

.at-viewport::-webkit-scrollbar-thumb:hover {
  background-color: var(--scrollbar-thumb-hover-bg);
}

.at-viewport::-webkit-scrollbar-thumb:active {
  background-color: var(--scrollbar-thumb-active-bg);
}

.at-viewport::-webkit-scrollbar-track {
  background: var(--scrollbar-bg);
  border-radius: 5px;
}

.at-viewport::-webkit-scrollbar-corner {
  background: var(--scrollbar-bg);
}

/* 当侧边栏存在时，视口需要偏移 */
.at-viewport.has-sidebar {
  left: 45px; /* 未展开状态的侧边栏宽度 */
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
