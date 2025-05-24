<!-- src\components\editor\ToolBar.vue -->
<template>
  <div class="toolbar">
    <button @click="handleNew" title="New (Ctrl+N)">New</button>
    <button @click="handleSave" title="Save (Ctrl+S)">Save</button>
    <button @click="handleLoad" title="Load">Load</button>
    <button @click="handleRename" title="Rename">Rename</button>
    <button @click="handleTemplate" title="Templates">Templates</button>
    <!-- 当前文件名显示 -->
    <div class="current-file">
      {{ currentFileName || 'Untitled' }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  currentFileName: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['new-tex', 'save-tex', 'load-tex', 'rename-tex', 'load-template']);

function handleNew() {
  emit('new-tex');
}

function handleSave() {
  // In a real app, you'd get the content from the editor via props or a shared store
  // For now, TexEditorView will handle getting the content and saving
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
</style>
