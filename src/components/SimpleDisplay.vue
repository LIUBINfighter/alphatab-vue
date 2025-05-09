<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import type { AlphaTabApi } from '@coderline/alphatab';

const props = defineProps<{
  scoreData?: ArrayBuffer
}>();

const alphaTabRef = ref<HTMLDivElement>();
let api: AlphaTabApi;

onMounted(() => {
  if (!alphaTabRef.value) return;

  // 初始化 AlphaTab
  api = new window.alphaTab.AlphaTabApi(alphaTabRef.value, {
    core: {
      fontDirectory: '/fonts'
    },
    display: {
      staveProfile: 'default'
    }
  });

  // 监听属性变化
  watch(() => props.scoreData, (newData) => {
    if (newData) {
      api.load(newData);
    }
  }, { immediate: true });
});

onUnmounted(() => {
  if (api) {
    api.destroy();
  }
});
</script>

<template>
  <div>
    <div ref="alphaTabRef"></div>
  </div>
</template>
