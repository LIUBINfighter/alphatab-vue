<script setup lang="ts">
import { ref } from 'vue';
import SimpleDisplay from './components/SimpleDisplay.vue';
import SimplePlayer from './components/SimplePlayer.vue';

// 使用 fetch 加载本地示例文件
const scoreFile = ref(null);

const loadExampleScore = async () => {
  try {
    const response = await fetch('/scores/吉他与孤独与蓝色星球.gpx');
    if (!response.ok) throw new Error('文件加载失败');
    const arrayBuffer = await response.arrayBuffer();
    scoreFile.value = arrayBuffer;
  } catch (error) {
    console.error('加载示例文件失败:', error);
  }
};

loadExampleScore();
</script>

<template>
  <div>
    <SimpleDisplay :score-data="scoreFile"/>
    <!-- 书写传参等 -->
  </div>
</template>

<style scoped>
</style>
