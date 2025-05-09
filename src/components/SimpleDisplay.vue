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
}>();

const alphaTabRef = ref<HTMLDivElement>();
const loading = ref(false);
const fontLoading = ref(true);
const fontError = ref(false);
let api: any;

onMounted(() => {
  if (!alphaTabRef.value || !window.alphaTab) return;

  loading.value = true;
  
  // 初始化 AlphaTab，添加字体加载错误处理
  api = new window.alphaTab.AlphaTabApi(alphaTabRef.value, {
    core: {
      fontDirectory: '/fonts',
      logLevel: window.alphaTab.LogLevel.Warning,
      // 添加字体加载错误处理和CDN备选
      fontLoader: (fontName: string) => {
        return new Promise((resolve, reject) => {
          // 首先尝试加载本地字体
          fetch(`/fonts/${fontName}.otf`)
            .then(response => {
              if (!response.ok) throw new Error('本地字体加载失败');
              return response.arrayBuffer();
            })
            .then(resolve)
            .catch(() => {
              console.warn(`本地字体 ${fontName} 加载失败，尝试使用CDN`);
              // 回退到CDN
              fetch(`https://cdn.jsdelivr.net/npm/@coderline/alphatab@latest/dist/font/${fontName}.otf`)
                .then(response => {
                  if (!response.ok) throw new Error('CDN字体加载失败');
                  return response.arrayBuffer();
                })
                .then(resolve)
                .catch(err => {
                  console.error('字体加载失败:', err);
                  fontError.value = true;
                  reject(err);
                });
            })
            .finally(() => {
              fontLoading.value = false;
            });
        });
      }
    },
    display: {
      staveProfile: 'default'
    }
  });

  // 添加事件监听
  api.renderStarted.on(() => {
    loading.value = true;
  });
  api.renderFinished.on(() => {
    loading.value = false;
  });

  // 监听属性变化
  watch(() => props.scoreData, (newData) => {
    if (newData) {
      api.load(newData);
    }
  }, { immediate: true });
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
  padding: 20px;
}

.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 10px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 4px;
}

.font-loading,
.font-error {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 8px;
  border-radius: 4px;
  font-size: 12px;
}

.font-loading {
  background: rgba(255, 255, 255, 0.8);
}

.font-error {
  background: rgba(255, 200, 200, 0.8);
  color: #d32f2f;
}

.alphatab-viewport {
  width: 100%;
  min-width: 600px;
  height: auto;
}
</style>
