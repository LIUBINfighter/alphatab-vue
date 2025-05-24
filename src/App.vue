<!-- App.vue -->
<script setup lang="ts">
import { provide, shallowRef, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { availableScores } from './config/availableScores';
import ScoreList from './components/layout/ScoreList.vue';
import GlobalHeader from './components/layout/GlobalHeader.vue';
import { playerControlFeatures } from "./config/playerControlFeatures";

// Import stores
import { useUIStore } from './stores/ui';
import { useTexFilesStore } from './stores/texFiles';
import { useThemeStore } from './stores/theme';

const router = useRouter();
const route = useRoute();
const uiStore = useUIStore();
const texFilesStore = useTexFilesStore();
const themeStore = useThemeStore();

const alphaTabApi = shallowRef(null);
provide('alphaTabApi', alphaTabApi);

onMounted(() => {
  texFilesStore.loadSavedTexFiles();
});

interface NavigationPayload {
  view?: 'score' | 'texEditor';
  path?: string;
  action?: string;
  texFileId?: string;
}

const scoreListProps = computed(() => {
  const currentRouteName = route.name;

  if (currentRouteName === 'ScorePlayer') {
    return {
      title: '选择乐谱',
      items: availableScores.value.map(s => ({ 
        name: s.name, 
        type: 'score' as const, 
        id: s.alias 
      })),
      headerButtonConfig: {
        label: 'Tex 编辑器',
        actionPayload: { view: 'texEditor' as const }
      }
    };
  } else if (currentRouteName === 'TexEditor') {
    return {
      title: '编辑器菜单',
      items: texFilesStore.savedTexFiles.map(file => ({
        name: file.name,
        type: 'texFile' as const,
        id: file.id
      })),
      headerButtonConfig: {
        label: '返回播放器',
        actionPayload: { view: 'score' as const }
      }
    };
  }
  return { title: '菜单', items: [], headerButtonConfig: null };
});

function handleNavigation(payload: NavigationPayload) {
  uiStore.closeScoreList();

  if (payload.path) {
    router.push({ name: 'ScorePlayer', params: { scoreAlias: payload.path } });
  } else if (payload.texFileId) {
    router.push({ name: 'TexEditor' });
    window.dispatchEvent(new CustomEvent('tex-editor-action', {
      detail: { action: 'load', fileId: payload.texFileId }
    }));
  } else if (payload.view === 'texEditor') {
    router.push({ name: 'TexEditor' });
  } else if (payload.view === 'score') {
    const defaultAlias = availableScores.value[0]?.alias || 'default-fallback-alias';
    router.push({ name: 'ScorePlayer', params: { scoreAlias: defaultAlias } });
  }
}

function handleScoreSelected(selectedScoreAlias: string) {
  uiStore.closeScoreList();
  router.push({ name: 'ScorePlayer', params: { scoreAlias: selectedScoreAlias } });
}

</script>

<template>
  <div id="app-container">
    <GlobalHeader />
    <ScoreList
      v-if="uiStore.isScoreListVisible"
      :title="scoreListProps.title"
      :listItems="scoreListProps.items"
      :headerButtonConfig="scoreListProps.headerButtonConfig"
      @close="uiStore.closeScoreList"
      @navigate="handleNavigation"
      @score-selected="handleScoreSelected"
    />
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" :key="route.fullPath" />
        </transition>
      </router-view>
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
