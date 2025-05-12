<script setup lang="ts">
import { provide, shallowRef } from 'vue';
import SimpleDisplay from './components/SimpleDisplay.vue';

// 创建一个全局空引用，将在 SimpleDisplay 组件中设置实际值
const alphaTabApi = shallowRef(null);
provide('alphaTabApi', alphaTabApi);
</script>

<template>
  <SimpleDisplay />
</template>

<style scoped>
</style>
