<template>
  <a class="btn at-print" @click="handlePrint">
    <Printer class="icon" />
  </a>
</template>

<script setup>
import { Printer } from 'lucide-vue-next'

const handlePrint = () => {
  // 打印逻辑
  window.print()
}
</script>
