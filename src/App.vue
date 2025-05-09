<script setup lang="ts">
import { ref } from 'vue';
import SimpleDisplay from './components/SimpleDisplay.vue';

// 使用 fetch 加载本地示例文件
const scoreFile = ref<ArrayBuffer | null>(null);

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
  <div class="app-container">
    <h1>alphaTab 演示</h1>
    
    <div class="demo-section">
      <h2>方式1: 通过文件路径加载</h2>
      <SimpleDisplay
        file="/scores/吉他与孤独与蓝色星球.gpx"
        :player="true"
        :width="1000"
        @scoreLoaded="(score: any) => console.log('乐谱加载:', score.title)"
      />
    </div>
    
    <div class="demo-section">
      <h2>方式2: 通过ArrayBuffer加载</h2>
      <SimpleDisplay
        :scoreData="scoreFile"
        :player="true"
        :width="800"
        @renderFinished="() => console.log('渲染完成')"
      />
    </div>
  </div>
</template>

<style scoped>
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
}

.demo-section {
  margin: 40px 0;
  padding: 20px;
  background: #f8f8f8;
  border-radius: 8px;
}

h1 {
  text-align: center;
  color: #333;
}

h2 {
  margin-bottom: 15px;
  color: #444;
}
</style>
