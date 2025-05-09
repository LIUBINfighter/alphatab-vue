<template>
  <div class="simple-display">
    <div ref="alphaTabContainer" class="alphatab-container"></div>
    <div v-if="error" class="error-message">{{ error }}</div>
    <div v-if="loading" class="loading-message">加载中...</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import * as alphaTab from '@coderline/alphatab';

// 定义Props
const props = defineProps({
  // 吉他谱文件：可以是URL字符串、文件对象、ArrayBuffer等
  file: {
    type: [String, Object, File, Blob, ArrayBuffer],
    default: null
  },
  // alphaTab的渲染设置
  settings: {
    type: Object,
    default: () => ({})
  },
  // 自动调整大小
  autoResize: {
    type: Boolean,
    default: true
  },
  // 初始缩放级别
  initialZoom: {
    type: Number,
    default: 1.0
  }
});

// 定义要触发的事件
const emit = defineEmits([
  'loaded',         // 谱子加载完成
  'rendered',       // 谱子渲染完成
  'error',          // 发生错误
  'scoreLoaded',    // 谱子加载完成（详细信息）
  'renderStarted',  // 开始渲染
  'renderFinished'  // 渲染完成
]);

// 组件状态
const alphaTabContainer = ref<HTMLElement | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
let api: alphaTab.AlphaTabApi | null = null;

// 初始化AlphaTab
const initializeAlphaTab = () => {
  if (!alphaTabContainer.value) return;
  
  // 合并默认设置与用户设置
  const settings = new alphaTab.Settings();
  
  // 配置自定义字体路径
  settings.core.fontDirectory = '/fonts/';
  
  // 合并用户设置
  Object.assign(settings, props.settings);
  
  console.log('初始化AlphaTab，字体路径:', settings.core.fontDirectory);
  
  try {
    // 创建API实例
    api = new alphaTab.AlphaTabApi(alphaTabContainer.value, settings);
    
    // 设置事件监听器
    api.scoreLoaded.on((score) => {
      loading.value = false;
      emit('scoreLoaded', score);
      emit('loaded', score);
    });
    
    api.renderStarted.on(() => {
      emit('renderStarted');
    });
    
    api.renderFinished.on(() => {
      emit('renderFinished');
      emit('rendered');
    });

    // 设置初始缩放
    if (props.initialZoom !== 1.0) {
      api.settings.display.scale = props.initialZoom;
    }
    
    // 加载文件（如果有）
    if (props.file) {
      loadFile();
    }
  } catch (error) {
    console.error('初始化AlphaTab失败:', error);
    emit('error', '初始化渲染引擎失败，请检查控制台');
  }
};

// 加载文件
const loadFile = async () => {
  if (!api) return;
  error.value = null;
  loading.value = true;
  
  try {
    if (typeof props.file === 'string') {
      // 从URL加载
      await api.load(props.file);
    } else if (props.file instanceof File || props.file instanceof Blob) {
      // 从File或Blob加载
      const arrayBuffer = await props.file.arrayBuffer();
      await api.load(arrayBuffer, props.file.name || '');
    } else if (props.file instanceof ArrayBuffer) {
      // 从ArrayBuffer加载
      await api.load(props.file);
    } else if (props.file) {
      // 其他情况
      error.value = '不支持的文件格式';
      loading.value = false;
      emit('error', error.value);
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : '加载文件失败';
    loading.value = false;
    emit('error', error.value);
  }
};

// 窗口大小调整处理
const handleResize = () => {
  if (api) {
    api.renderer.updateSettings();
    api.renderer.render();
  }
};

// 组件挂载时初始化
onMounted(() => {
  initializeAlphaTab();
  
  // 添加窗口大小变化监听
  if (props.autoResize) {
    window.addEventListener('resize', handleResize);
  }
});

// 在组件卸载前清理资源
onBeforeUnmount(() => {
  if (api) {
    api.destroy();
    api = null;
  }
  
  if (props.autoResize) {
    window.removeEventListener('resize', handleResize);
  }
});

// 监听文件变化重新加载
watch(() => props.file, () => {
  if (props.file) {
    loadFile();
  }
});

// 监听设置变化重新初始化
watch(() => props.settings, () => {
  if (api) {
    api.destroy();
    api = null;
  }
  initializeAlphaTab();
}, { deep: true });

// 暴露方法给父组件
defineExpose({
  // 重新渲染
  reRender: () => {
    if (api) {
      api.renderer.render();
    }
  },
  // 更新渲染设置
  updateSettings: (newSettings: any) => {
    if (api) {
      api.updateSettings(newSettings);
      api.renderer.render();
    }
  },
  // 缩放控制
  zoomIn: () => {
    if (api) {
      api.settings.display.scale *= 1.2;
      api.renderer.render();
    }
  },
  zoomOut: () => {
    if (api) {
      api.settings.display.scale /= 1.2;
      api.renderer.render();
    }
  },
  // 获取API实例进行高级操作
  getAlphaTabApi: () => api
});
</script>

<style scoped>
.simple-display {
  position: relative;
  width: 100%;
}

.alphatab-container {
  width: 100%;
  overflow: auto;
  min-height: 300px;
}

.error-message {
  color: red;
  padding: 10px;
  text-align: center;
}

.loading-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.7);
  padding: 10px 20px;
  border-radius: 4px;
}
</style>
