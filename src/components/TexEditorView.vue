<template>
  <div class="tex-editor-view-wrapper">
    <div class="tex-editor-view">
      <div class="editor-pane">
        <ToolBar 
          @new-tex="handleNewTex"
          @save-tex="handleSaveTex"
          @load-tex="handleLoadTex"
        />
        <TexEditor v-model="texContent" class="tex-editor-component" />
      </div>
      <div class="display-pane">
        <SimpleDisplay 
          :tex="texContent" 
          :key="texVersion" 
          :controlBarFeatures="['play-pause', 'stop', 'download']" 
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import TexEditor from './TexEditor.vue';
import SimpleDisplay from './SimpleDisplay.vue';
import ToolBar from './editor/ToolBar.vue'; // Import the ToolBar

const STORAGE_KEY = 'alphaTexEditorContent';

const texContent = ref(localStorage.getItem(STORAGE_KEY) || `\\title "AlphaTex Example"
\\artist "Vue Component"
\\tempo 120
\\tuning e4 b3 g3 d3 a2 e2
\\instrument acousticguitarsteel

.
0.4 0.4 0.4 0.4
1.4 1.4 1.4 1.4
`); // 修正 AlphaTex 格式，使用正确的 tuning 语法

// 添加版本控制，用于强制SimpleDisplay重新渲染
const texVersion = ref(0);

// 监听texContent变化，更新版本号以触发重新渲染
watch(texContent, () => {
  // 增加版本号，强制SimpleDisplay重新渲染
  texVersion.value++;
}, { immediate: false });

function handleNewTex() {
  texContent.value = '';
  // Optionally, clear localStorage or ask user
  // localStorage.removeItem(STORAGE_KEY); 
}

function handleSaveTex() {
  localStorage.setItem(STORAGE_KEY, texContent.value);
  alert('Content saved to localStorage!'); // Simple feedback
}

function handleLoadTex() {
  const loadedContent = localStorage.getItem(STORAGE_KEY);
  if (loadedContent !== null) {
    texContent.value = loadedContent;
  } else {
    alert('No saved content found in localStorage.'); // Simple feedback
  }
}
</script>

<style scoped>
.tex-editor-view-wrapper {
  width: 100%;
  height: 100vh; /* 占据整个视口高度 */
  display: flex;
  flex-direction: column;
  /* Ensure wrapper itself doesn't cause unexpected overflow if children are 100vh */
  overflow: hidden; 
}

.tex-editor-view {
  display: flex;
  flex-grow: 1; 
  overflow: hidden; 
}

.editor-pane {
  width: 40%; 
  height: 100%; /* Ensure editor-pane takes full height of its parent */
  padding: 0; /* Remove padding, toolbar and editor will manage their own */
  display: flex;
  flex-direction: column; /* Stack ToolBar and TexEditor vertically */
  box-sizing: border-box;
  border-right: 1px solid #ccc;
}

.tex-editor-component {
  flex-grow: 1; /* TexEditor takes remaining space in editor-pane */
  /* TexEditor's internal textarea already has height: 100% relative to this component */
  overflow: hidden; /* Prevent its own scrollbars if textarea is sized correctly */
}

.display-pane {
  width: 60%; /* 显示区域占据60%宽度 */
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* 确保 SimpleDisplay 在 display-pane 中正确拉伸 */
.display-pane :deep(.at-wrap) {
  width: 100% !important;
  height: 100% !important; /* 使 SimpleDisplay 填充 display-pane 高度 */
  min-width: initial !important; /* 覆盖 SimpleDisplay 的 min-width */
  border: none !important; /* 移除 SimpleDisplay 的边框（可选） */
}

.display-pane :deep(.at-content) {
  height: calc(100% - 40px); /* 假设 ControlBar 高度为 40px */
}

.display-pane :deep(.at-viewport) {
   left: 0px !important; /* Tex 模式下，左边距为0 */
}
</style>
