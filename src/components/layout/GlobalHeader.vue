<!-- /src/components/layout/GlobalHeader.vue -->
<template>
  <header class="global-header">
    <div class="header-content">
      <span class="app-title">AlphaTab Vue</span>
      <div class="header-buttons">
        <button
          @click="openLink('https://github.com/LIUBINfighter/alphatab-vue')"
          class="menu-button"
          title="GitHub Repository"
        >
          <Github class="icon" />
          <span class="button-text"><!-- Github Repo --></span>
        </button>

        <button
          @click="openLink('https://www.alphatab.net/')"
          class="menu-button"
          title="AlphaTab Official Website"
        >
          <ExternalLink class="icon" />
          <span class="button-text">AlphaTab.js</span>
        </button>

        <button
          @click="openLink('/alphatab-vue/docs/')"
          class="menu-button"
          title="Documentation"
        >
          <BookOpen class="icon" />
          <span class="button-text">Dev Record</span>
        </button>

        <button
          @click="showQuickDocs = true"
          class="menu-button quick-docs-fab"
          title="快速文档"
        >
          <FileText class="icon" />
          <span class="button-text">Quick Docs</span>
        </button>

        <button
          @click="uiStore.toggleScoreListVisibility"
          class="menu-button"
          title="Open Menu"
        >
        <FileMusic class="icon" />
          <span class="button-text">Menu</span>
        </button>
      </div>
    </div>

    <QuickDocs
      v-if="showQuickDocs"
      @close="showQuickDocs = false"
    />
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Github, ExternalLink, BookOpen, FileText, FileMusic } from 'lucide-vue-next';
import QuickDocs from './QuickDocs.vue';
import { useUIStore } from '../../stores/ui';

const uiStore = useUIStore();

function openLink(url: string) {
  window.open(url, '_blank');
}

const showQuickDocs = ref(false);
</script>

<style scoped>
.global-header {
  width: 100%;
  min-height: 50px;
  background-color: #333;
  color: white;
  display: flex;
  align-items: center;
  padding: 10px 10px;
  box-sizing: border-box;
  border-bottom: 1px solid #444;
  flex-shrink: 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.header-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
  /* margin-left: 15px; 确保与标题保持距离 */
}

.icon {
  width: 18px;
  height: 18px;
}

.button-text {
  margin-left: 6px; /* 图标和文本之间的间距 */
}

.app-title {
  font-size: 1.2em;
  font-weight: bold;
  white-space: nowrap; /* 防止标题换行 */
  flex-shrink: 0; /* 防止标题被压缩 */
}

.menu-button {
  background-color: #436d9d;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
}

.menu-button:hover {
  background-color: #365a8a;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .menu-button {
    padding: 6px 10px; /* 进一步减小按钮内边距 */
    font-size: 13px;
  }
  
  .button-text {
    margin-left: 4px; /* 减小图标和文本的间距 */
  }
  
  .header-buttons {
    gap: 5px; /* 减小按钮间距 */
  }
  
  .app-title {
    font-size: 1.1em; /* 略微减小标题大小 */
  }
}

@media (max-width: 600px) {
  .menu-button .button-text {
    display: none;
  }
  
  .menu-button {
    padding: 6px;
  }
  
  .header-buttons {
    margin-left: 10px;
  }
}

/* 超小屏幕 - 隐藏标题 */
@media (max-width: 330px) {
  .app-title {
    display: none;
  }
  
  .header-buttons {
    margin-left: 0;
    width: 100%;
    justify-content: center;
  }
}
</style>
