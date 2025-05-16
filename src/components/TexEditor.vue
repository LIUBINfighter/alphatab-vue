<template>
  <textarea
    :value="modelValue"
    @input="emitUpdate($event.target.value)"
    placeholder="Enter AlphaTex here..."
    class="alphatex-textarea"
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
.alphatex-textarea { /* Changed selector for clarity */
  width: 100%;
  height: 100%; /* Takes full height of its parent container */
  font-family: monospace;
  font-size: 14px;
  border: none; /* Border is now on editor-pane or toolbar */
  padding: 10px;
  box-sizing: border-box;
  resize: none;
  /* Remove border if editor-pane or toolbar provides it */
  /* border-top: 1px solid #ccc; /* Example: if toolbar is separate */
}
</style>
