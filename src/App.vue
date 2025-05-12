<script setup lang="ts">
import { provide, shallowRef } from 'vue';
import SimpleDisplay from './components/SimpleDisplay.vue';

// 使用 shallowRef 避免大型对象的深度响应性
const alphaTabApi = shallowRef(null);
provide('alphaTabApi', alphaTabApi);
</script>

<template>
  <SimpleDisplay />
</template>

<style scoped>
</style>
