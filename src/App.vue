<script setup lang="ts">
import { provide, shallowRef } from 'vue';
import SimpleDisplay from './components/SimpleDisplay.vue';

// 使用 shallowRef 避免大型对象的深度响应性
const alphaTabApi = shallowRef(null);
provide('alphaTabApi', alphaTabApi);

// 可以是URL字符串或直接是score对象
// const score = 'https://www.alphatab.net/files/canon.gp';
const score = `${import.meta.env.BASE_URL}scores/吉他与孤独与蓝色星球.gpx`;
      // file: `${import.meta.env.BASE_URL}/scores/吉他与孤独与蓝色星球.gpx`, // 使用 BASE_URL
      // file: `https://www.alphatab.net/files/canon.gp`,

</script>

<template>
  <SimpleDisplay :score="score" />
</template>

<style scoped>
</style>
