<script setup lang="ts">
import { provide, shallowRef, ref, computed } from 'vue';
import SimpleDisplay from './components/SimpleDisplay.vue';
import ScoreList from './components/ScoreList.vue';
import TexEditorView from './components/TexEditorView.vue';
import GlobalHeader from './components/layout/GlobalHeader.vue'; // Import GlobalHeader

// 使用 shallowRef 避免大型对象的深度响应性
const alphaTabApi = shallowRef(null);
provide('alphaTabApi', alphaTabApi);

const initialScorePath = `${import.meta.env.BASE_URL}scores/吉他与孤独与蓝色星球.gpx`;

const currentView = ref<'score' | 'texEditor'>('score'); // 'score' 或 'texEditor'
const currentScore = ref(initialScorePath); // 当前乐谱路径，仅用于 'score' 视图
const isScoreListVisible = ref(false);

const availableScores = ref([
  { name: '吉他与孤独与蓝色星球', path: `${import.meta.env.BASE_URL}scores/吉他与孤独与蓝色星球.gpx` },
  { name: '东方妖妖梦 - 幽雅に咲かせ、墨染の桜 ～ Border of Life (Drop D)', path: `${import.meta.env.BASE_URL}scores/东方妖妖梦 - 幽雅に咲かせ、墨染の桜　～ Border of Life(Drop D).gp5` },
  { name: 'Canon Rock', path: 'https://www.alphatab.net/files/canon.gp' },
]);

interface NavigationPayload {
  view?: 'score' | 'texEditor';
  path?: string;
  action?: string; // For actions like 'loadTexSampleAction'
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
        { name: '加载 Tex 示例 (占位)', type: 'action', id: 'loadTexSampleAction' }
      ],
      headerButtonConfig: {
        label: '返回播放器',
        actionPayload: { view: 'score' } // Will use currentScore implicitly
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
    // Placeholder for future implementation, e.g., open a Tex sample selector
  }
  isScoreListVisible.value = false;
}

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
          <SimpleDisplay :score="currentScore" :key="currentScore" />
        </template>
        <template v-else-if="currentView === 'texEditor'">
          <TexEditorView />
        </template>
      </transition>
    </main>
  </div>
</template>

<style scoped>
/* :global(html, body) {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
} */

#app-container {
  width: 100%;
  height: 97vh;
  /* height: 100%; */
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
}

.main-content {
  flex-grow: 1;
  overflow: hidden; /* Changed from overflow-y: auto to prevent scrolling */
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
