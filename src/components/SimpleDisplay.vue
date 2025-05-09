<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';

// 声明全局 alphaTab 类型
declare global {
  interface Window {
    alphaTab: any;
  }
}

const props = defineProps<{
  scoreData?: ArrayBuffer | null
  file?: string
  tracks?: number[]
  tex?: boolean
  player?: boolean
  width?: number
  engine?: 'svg' | 'skia'
  settings?: Record<string, any>
}>();

const emit = defineEmits<{
  (e: 'scoreLoaded'): void
  (e: 'renderStarted'): void
  (e: 'renderFinished'): void
  (e: 'partialRenderFinished'): void
  (e: 'playerStateChanged', state: any): void
  (e: 'error', error: Error): void
}>();

const alphaTabRef = ref<HTMLDivElement>();
const loading = ref(false);
const fontLoading = ref(true);
const fontError = ref(false);
let api: any;

onMounted(() => {
  if (!alphaTabRef.value || !window.alphaTab) return;

  loading.value = true;
  
  const baseSettings = {
    core: {
      fontDirectory: '/fonts/',
      logLevel: window.alphaTab.LogLevel.Warning,
      engine: props.engine || 'svg',
      fontLoader: async (fontName: string) => {
        try {
          // 首先尝试加载本地 .otf 字体
          const otfResponse = await fetch(`/fonts/${fontName}.otf`);
          if (otfResponse.ok) {
            fontLoading.value = false;
            return await otfResponse.arrayBuffer();
          }

          // 如果 .otf 失败，尝试加载本地 .woff 字体
          const woffResponse = await fetch(`/fonts/${fontName}.woff`);
          if (woffResponse.ok) {
            fontLoading.value = false;
            return await woffResponse.arrayBuffer();
          }

          // 如果本地字体都失败，回退到 CDN
          console.warn(`本地字体 ${fontName} 加载失败，尝试使用CDN`);
          const cdnResponse = await fetch(`https://cdn.jsdelivr.net/npm/@coderline/alphatab@latest/dist/font/${fontName}.otf`);
          if (!cdnResponse.ok) throw new Error('CDN字体加载失败');
          
          fontLoading.value = false;
          return await cdnResponse.arrayBuffer();
        } catch (err) {
          console.error('字体加载失败:', err);
          fontError.value = true;
          fontLoading.value = false;
          throw err;
        }
      }
    },
    display: {
      staveProfile: 'default',
      width: props.width
    },
    player: {
      enablePlayer: props.player || false
    },
    ...(props.settings || {})
  };

  // 合并用户自定义设置
  api = new window.alphaTab.AlphaTabApi(alphaTabRef.value, baseSettings);

  // 添加事件监听
  api.scoreLoaded.on(() => {
    emit('scoreLoaded');
  });
  
  api.renderStarted.on(() => {
    loading.value = true;
    emit('renderStarted');
  });
  
  api.renderFinished.on(() => {
    loading.value = false;
    emit('renderFinished');
  });
  
  api.partialRenderFinished.on(() => {
    emit('partialRenderFinished');
  });
  
  api.playerStateChanged.on((state: any) => {
    emit('playerStateChanged', state);
  });
  
  api.error.on((error: Error) => {
    emit('error', error);
  });

  // 监听属性变化
  watch(() => props.scoreData, (newData) => {
    if (newData) {
      api.load(newData);
    }
  });

  watch(() => props.file, (newFile) => {
    if (newFile) {
      if (props.tex) {
        api.loadTex(newFile);
      } else {
        fetch(newFile)
          .then(res => res.arrayBuffer())
          .then(data => api.load(data))
          .catch(err => emit('error', err));
      }
    }
  }, { immediate: true });

  watch(() => props.tracks, (newTracks) => {
    if (newTracks && api) {
      api.renderTracks(newTracks);
    }
  });

  watch(() => props.width, (newWidth) => {
    if (newWidth && api) {
      api.settings.display.width = newWidth;
      api.updateSettings();
    }
  });

  watch(() => props.engine, (newEngine) => {
    if (newEngine && api) {
      api.settings.core.engine = newEngine;
      api.updateSettings();
    }
  });

  watch(() => props.player, (newPlayer) => {
    if (api) {
      api.settings.player.enablePlayer = newPlayer || false;
      api.updateSettings();
    }
  });
});

onUnmounted(() => {
  if (api) {
    api.destroy();
  }
});
</script>

<template>
  <div class="alphatab-container">
    <div v-if="loading" class="loading">加载中...</div>
    <div v-if="fontLoading" class="font-loading">正在加载字体...</div>
    <div v-if="fontError" class="font-error">字体加载失败，显示效果可能受影响</div>
    <div ref="alphaTabRef" class="alphatab-viewport"></div>
  </div>
</template>

<style scoped>
.alphatab-container {
  position: relative;
  min-height: 200px;
  width: 100%;
  margin: 0 auto;
  padding: 1rem;
  overflow: hidden;
  transition: all 0.3s ease;
}

.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 0.75rem 1.25rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-size: 0.875rem;
  z-index: 10;
  opacity: 0;
  animation: fadeIn 0.3s ease forwards;
}

.font-loading,
.font-error {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  z-index: 10;
  opacity: 0;
  animation: fadeIn 0.3s ease forwards;
}

.font-loading {
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.font-error {
  background: rgba(255, 200, 200, 0.9);
  color: #d32f2f;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.alphatab-viewport {
  width: 100%;
  height: auto;
  transition: all 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
  .alphatab-container {
    padding: 0.5rem;
  }
  
  .alphatab-viewport {
    min-width: unset;
    width: calc(100vw - 1rem);
  }
}

@media (max-width: 480px) {
  .font-loading,
  .font-error {
    font-size: 0.625rem;
    padding: 0.25rem 0.5rem;
  }
}
</style>
