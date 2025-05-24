<!-- src\components\editor\ToolBar.vue -->
<template>
  <div class="toolbar">
    <button @click="handleNew" title="New (Ctrl+N)">New</button>
    <button @click="handleSave" title="Save (Ctrl+S)">Save</button>
    <button @click="handleLoad" title="Load">Load</button>
    <button @click="handleRename" title="Rename">Rename</button>
    <button @click="handleTemplate" title="Templates">Templates</button>
    
    <!-- 添加字体大小控制组件 -->
    <div class="font-size-control">
      <button @click="decreaseFontSize" title="Decrease Font Size">-</button>
      <input 
        type="number" 
        v-model="fontSize" 
        @change="updateFontSize" 
        min="8" 
        max="36" 
        class="font-size-input"
      />
      <button @click="increaseFontSize" title="Increase Font Size">+</button>
    </div>
    
    <!-- 当前文件名显示 -->
    <div class="current-file">
      {{ currentFileName || 'Untitled' }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  currentFileName: {
    type: String,
    default: ''
  },
  initialFontSize: {
    type: Number,
    default: 14
  }
});

const emit = defineEmits(['new-tex', 'save-tex', 'load-tex', 'rename-tex', 'load-template', 'update-font-size']);

const fontSize = ref(props.initialFontSize);

function handleNew() {
  emit('new-tex');
}

function handleSave() {
  emit('save-tex');
}

function handleLoad() {
  emit('load-tex');
}

function handleRename() {
  emit('rename-tex');
}

function handleTemplate() {
  emit('load-template');
}

function increaseFontSize() {
  if (fontSize.value < 36) {
    fontSize.value++;
    updateFontSize();
  }
}

function decreaseFontSize() {
  if (fontSize.value > 8) {
    fontSize.value--;
    updateFontSize();
  }
}

function updateFontSize() {
  // 确保字体大小在合理范围内
  fontSize.value = Math.max(8, Math.min(36, fontSize.value));
  emit('update-font-size', fontSize.value);
}

// Basic keyboard shortcuts (can be enhanced)
window.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 's') {
    e.preventDefault();
    handleSave();
  }
  if (e.ctrlKey && e.key === 'n') {
    e.preventDefault();
    handleNew();
  }
});

// Consider removing event listener on unmount if component can be destroyed
</script>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  padding: 8px;
  background-color: #f0f0f0;
  border-bottom: 1px solid #ccc;
  gap: 8px; /* Spacing between buttons */
  height: 40px; /* Fixed height for the toolbar */
  box-sizing: border-box;
}

.toolbar button {
  padding: 6px 12px;
  background-color: #436d9d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.toolbar button:hover {
  background-color: #365a8a;
}

.toolbar button:active {
  background-color: #2c4a6e;
}

.current-file {
  margin-left: auto;
  font-size: 14px;
  color: #333;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 300px;
}

/* 字体大小控制组件样式 */
.font-size-control {
  display: flex;
  align-items: center;
  margin-left: 10px;
}

.font-size-control button {
  padding: 2px 8px;
  font-size: 16px;
  font-weight: bold;
}

.font-size-input {
  width: 40px;
  text-align: center;
  margin: 0 4px;
  padding: 4px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
