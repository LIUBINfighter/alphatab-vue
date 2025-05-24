// src/stores/ui.ts
import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useUIStore = defineStore('ui', () => {
  // State
  const isScoreListVisible = ref(false);

  // Actions
  function toggleScoreListVisibility() {
    isScoreListVisible.value = !isScoreListVisible.value;
    console.log('UIStore: isScoreListVisible toggled to:', isScoreListVisible.value);
  }

  function closeScoreList() {
    if (isScoreListVisible.value) {
      isScoreListVisible.value = false;
      console.log('UIStore: ScoreList closed');
    }
  }

  return {
    isScoreListVisible,
    toggleScoreListVisibility,
    closeScoreList,
  };
});