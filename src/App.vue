<script setup lang="ts">
import { ref, onMounted } from 'vue';
import SimpleDisplay from './components/SimpleDisplay.vue';
import SimplePlayer from './components/SimplePlayer.vue';

const scoreFile = ref('/scores/吉他与孤独与蓝色星球.gpx');
const loadError = ref(false);

// 检查文件是否存在的函数
const checkFileExists = (url: string) => {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open('HEAD', url, true);
    xhr.onload = () => {
      resolve(xhr.status !== 404);
    };
    xhr.onerror = () => {
      resolve(false);
    };
    xhr.send();
  });
};

// 加载出错处理函数
const handleError = (error: any) => {
  console.error('加载谱子失败:', error);
  loadError.value = true;
  // 尝试使用备用文件 (AlphaTab示例文件)
  scoreFile.value = 'https://www.alphatab.net/files/canon.gp';
};

onMounted(async () => {
  // 检查本地文件是否存在
  const exists = await checkFileExists(scoreFile.value);
  if (!exists) {
    console.warn('本地谱子文件不存在，使用备用文件');
    scoreFile.value = 'https://www.alphatab.net/files/canon.gp';
  }
});
</script>

<template>
  <div>
    <div class="status-message" v-if="loadError">
      本地谱子加载失败，已切换到备用谱子
    </div>
    
    <SimpleDisplay 
      :file="scoreFile" 
      @error="handleError"
      :settings="{
        display: { scale: 0.8 }, 
        notation: { elements: { guitarTuning: true } }
      }" 
    />
    
    <!-- <SimplePlayer /> -->
  </div>
</template>

<style scoped>
.status-message {
  padding: 10px;
  background-color: #fff3cd;
  color: #856404;
  margin-bottom: 10px;
  border-radius: 4px;
  text-align: center;
}
</style>
