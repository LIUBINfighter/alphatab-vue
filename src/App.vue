<script setup lang="ts">
import { provide, shallowRef, ref, computed, onMounted } from 'vue';
import { applyTheme, type ThemeName } from './utils/alphaTabStyleUtils';
import { availableScores } from './assets/availableScores';
import SimpleDisplay from './components/SimpleDisplay.vue';
import ScoreList from './components/manual/ScoreList.vue';
import TexEditorView from './components/TexEditorView.vue';
import GlobalHeader from './components/layout/GlobalHeader.vue'; // Import GlobalHeader

// 使用 shallowRef 避免大型对象的深度响应性
const alphaTabApi = shallowRef(null);
provide('alphaTabApi', alphaTabApi);

const initialScorePath = `${import.meta.env.BASE_URL}scores/吉他与孤独与蓝色星球.gpx`;


import { playerControlFeatures } from "./components/playerControlFeatures" 
// 为播放器视图的 SimpleDisplay 定义要显示的所有控件


const currentView = ref<'score' | 'texEditor'>('score'); // 'score' 或 'texEditor'
const currentScore = ref(initialScorePath); // 当前乐谱路径，仅用于 'score' 视图
const isScoreListVisible = ref(false);

// 存储在localStorage中的AlphaTex文件列表
const savedTexFiles = ref<Array<{ name: string, id: string }>>([]);

// 在组件挂载时加载已保存的文件列表
onMounted(() => {
  loadSavedTexFiles();
});

// 从localStorage加载已保存的文件列表
function loadSavedTexFiles() {
  const fileKeys = Object.keys(localStorage).filter(key => key.startsWith('alphaTexFile:'));
  savedTexFiles.value = fileKeys.map(key => {
    const name = key.replace('alphaTexFile:', '');
    return { name, type: 'texFile', id: key };
  });
}

interface NavigationPayload {
  view?: 'score' | 'texEditor';
  path?: string;
  action?: string; // For actions like 'loadTexSampleAction'
  texFileId?: string; // 用于加载特定的Tex文件
}

const scoreListProps = computed(() => {
  if (currentView.value === 'score') {
    return {
      title: '选择乐谱',
      items: availableScores.value.map(s => ({ name: s.name, type: 'score', id: s.path })),
      headerButtonConfig: {
        label: 'Tex 编辑器',
        actionPayload: { view: 'texEditor' }
      }
    };
  } else { // currentView.value === 'texEditor'
    return {
      title: '编辑器菜单',
      items: [
        // { name: '新建文件', type: 'action', id: 'newTexFileAction' },
        // { name: '加载模板', type: 'action', id: 'loadTexTemplatesAction' },
        ...savedTexFiles.value.map(file => ({
          name: file.name,
          type: 'texFile',
          id: file.id
        }))
      ],
      headerButtonConfig: {
        label: '返回播放器',
        actionPayload: { view: 'score' }
      }
    };
  }
});

function handleNavigation(payload: NavigationPayload) {
  if (payload.view) {
    currentView.value = payload.view;
    if (payload.view === 'score' && payload.path) {
      currentScore.value = payload.path;
    }
  } else if (payload.action === 'loadTexSampleAction') {
    console.log('Action: Load Tex Sample triggered');
  } else if (payload.action === 'newTexFileAction') {
    currentView.value = 'texEditor';
    // 通知TexEditorView创建新文件
    window.dispatchEvent(new CustomEvent('tex-editor-action', { 
      detail: { action: 'new' }
    }));
  } else if (payload.action === 'loadTexTemplatesAction') {
    // 通知TexEditorView显示模板选择界面
    window.dispatchEvent(new CustomEvent('tex-editor-action', { 
      detail: { action: 'showTemplates' }
    }));
  } else if (payload.texFileId) {
    currentView.value = 'texEditor';
    // 通知TexEditorView加载特定文件
    window.dispatchEvent(new CustomEvent('tex-editor-action', {
      detail: { action: 'load', fileId: payload.texFileId }
    }));
  }
  isScoreListVisible.value = false;
}

// 更新已保存的Tex文件列表
window.addEventListener('tex-files-updated', () => {
  loadSavedTexFiles();
});

function handleScoreSelected(selectedScorePath: string) {
  currentScore.value = selectedScorePath;
  currentView.value = 'score'; // 确保切换到乐谱视图
  isScoreListVisible.value = false;
}

function toggleScoreListVisibility() {
  isScoreListVisible.value = !isScoreListVisible.value;
}

function closeScoreList() {
  isScoreListVisible.value = false;
}

// 在脚本部分设置样式状态
// 设置提供给组件的样式状态
const currentTheme = ref<ThemeName>('default');

// 提供样式状态
provide('currentTheme', currentTheme);

// 提供切换主题的方法，使用明确的类型
provide('changeTheme', (themeName: ThemeName) => {
  currentTheme.value = themeName;
  // 因为这里没有 api 实例，传入 undefined 作为第二个参数
  applyTheme(themeName, undefined);
});

// 移除 handleRequestScoreList 函数
</script>

<template>
  <div id="app-container">
    <GlobalHeader @toggle-menu="toggleScoreListVisibility" />
    <ScoreList
      v-if="isScoreListVisible"
      :title="scoreListProps.title"
      :listItems="scoreListProps.items"
      :headerButtonConfig="scoreListProps.headerButtonConfig"
      @score-selected="handleScoreSelected"
      @close="closeScoreList"
      @navigate="handleNavigation"
    />
    <main class="main-content">
      <transition name="fade" mode="out-in">
        <template v-if="currentView === 'score'">
          <SimpleDisplay 
            :score="currentScore" 
            :key="currentScore" 
            :control-bar-features="playerControlFeatures" 
          />
        </template>
        <template v-else-if="currentView === 'texEditor'">
          <TexEditorView />
          <!-- 
            说明: TexEditorView.vue 内部也使用 SimpleDisplay 组件。
            要使其 ControlBar 显示默认控件外加 'zoom'，
            需要在 TexEditorView.vue 文件中进行如下类似的修改：

            在 TexEditorView.vue 的 <script setup> 中:
            const editorControlFeatures = ref([
              'stop', 'play-pause', 'speed-control', 'print', 'download', // 默认控件
              'zoom' // 额外添加 zoom
            ]);

            然后在 TexEditorView.vue 的模板中，当使用 SimpleDisplay 时:
            <SimpleDisplay :tex="alphaTexContent" :control-bar-features="editorControlFeatures" />
            (具体 props 取决于 TexEditorView.vue 的实现)
          -->
        </template>
      </transition>
    </main>
  </div>
</template>

<style scoped>
/* --- App.vue 组件的局部样式 --- */
#app-container {
  /* margin: 0px; */ /* #app-container 通常不需要设置 margin，因为它应该是 body 的直接子元素 */
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* #app-container 自身的 overflow 控制 */
  /* box-sizing: border-box; 已通过 :global(*) 继承 */
}

.main-content {
  flex-grow: 1;
  overflow: hidden;
  position: relative;
}

/* 过渡动画样式 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
