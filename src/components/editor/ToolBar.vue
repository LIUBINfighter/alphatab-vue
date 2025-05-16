<template>
  <div class="toolbar">
    <button @click="handleNew" title="New (Ctrl+N)">New</button>
    <button @click="handleSave" title="Save (Ctrl+S)">Save</button>
    <button @click="handleLoad" title="Load">Load</button>
    <!-- Add more buttons here later: Save As, Templates, Undo, Redo -->
  </div>
</template>

<script setup>
import { defineEmits } from 'vue';

const emit = defineEmits(['new-tex', 'save-tex', 'load-tex']);

const STORAGE_KEY = 'alphaTexEditorContent';

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
</style>
