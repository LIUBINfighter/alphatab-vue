<template>
  <a class="btn at-print" 
     @click="handlePrint"
     title="Print score"
  >
    <Printer class="icon" />
  </a>
</template>

<script setup>
import { inject } from 'vue'
import { Printer } from 'lucide-vue-next'

const alphaTabApi = inject('alphaTabApi')

const handlePrint = () => {
  if (alphaTabApi.value) {
    alphaTabApi.value.print()
  } else {
    // 降级为浏览器打印
    window.print()
  }
}
</script>
