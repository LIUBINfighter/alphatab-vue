<template>
  <div class="tex-editor-view-wrapper">
    <div class="tex-editor-view">
      <div class="editor-pane">
        <TexEditor v-model="texContent" />
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

const texContent = ref(`\\title "AlphaTex Example"
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
</script>

<style scoped>
.tex-editor-view-wrapper {
  width: 100%;
  height: 100vh; /* 占据整个视口高度 */
  display: flex;
  flex-direction: column;
}

.tex-editor-view {
  display: flex;
  flex-grow: 1; /* 占据 tex-editor-view-wrapper 的剩余空间 */
  overflow: hidden; /* 防止子元素溢出导致滚动条 */
}

.editor-pane {
  width: 40%; /* 编辑器占据40%宽度 */
  height: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  border-right: 1px solid #ccc;
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
