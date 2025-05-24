// src/stores/texFiles.ts
import { ref } from 'vue';
import { defineStore } from 'pinia';

export interface TexFile {
  name: string;
  id: string; // 通常是 localStorage 的 key，例如 'alphaTexFile:filename'
  // 你也可以在这里添加 type: 'texFile' 等元数据，如果需要的话
}

export const useTexFilesStore = defineStore('texFiles', () => {
  // State
  const savedTexFiles = ref<TexFile[]>([]);

  // Actions
  function loadSavedTexFiles() {
    const fileKeys = Object.keys(localStorage).filter(key => key.startsWith('alphaTexFile:'));
    savedTexFiles.value = fileKeys.map(key => {
      const name = key.replace('alphaTexFile:', '');
      return { name, id: key };
    });
    console.log('TexFilesStore: Saved Tex files loaded', savedTexFiles.value);
  }

  // 这个 action 将由 TexEditorView 在保存或删除文件后调用，以替代旧的 window event
  function refreshSavedTexFiles() {
    loadSavedTexFiles();
  }

  // 可以在 store 初始化时加载一次，或者由 App.vue 在 onMounted 时调用
  // loadSavedTexFiles(); // 如果希望 store 自身初始化时就加载

  return {
    savedTexFiles,
    loadSavedTexFiles,
    refreshSavedTexFiles,
  };
});