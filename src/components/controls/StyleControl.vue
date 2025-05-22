<template>
  <div class="style-control">
    <select 
      class="style-selector" 
      v-model="selectedTheme" 
      @change="onThemeChange"
      :disabled="disabled">
      <option value="default">默认</option>
      <option value="dark">暗色默认</option>
      <option value="ocean">深海蓝</option>
      <option value="vibrant">炫彩夜晚</option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'StyleControl',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    alphaTabApi: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      selectedTheme: 'default'
    };
  },
  methods: {
    onThemeChange() {
      this.$emit('theme-changed', this.selectedTheme);
    }
  },
};
</script>

<style scoped>
.style-control {
  display: inline-block;
  margin: 0 10px;
}

.style-selector {
  padding: 5px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: #fff;
  font-size: 14px;
  min-width: 120px;
}

.style-selector:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}
</style>
