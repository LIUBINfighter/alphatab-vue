<template>
  <textarea
    :value="modelValue"
    @input="emitUpdate($event.target.value)"
    placeholder="Enter AlphaTex here..."
  ></textarea>
</template>

<script setup>
defineProps({
  modelValue: String
});
const emit = defineEmits(['update:modelValue']);

function emitUpdate(value) {
  emit('update:modelValue', value);
}
</script>

<style scoped>
textarea {
  width: 100%;
  height: 100%;
  font-family: monospace;
  font-size: 14px;
  border: 1px solid #ccc;
  padding: 10px;
  box-sizing: border-box;
  resize: none;
}
</style>
