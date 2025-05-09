import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  // 确保字体文件能被正确处理
  assetsInclude: ['**/*.woff', '**/*.otf'],
  // 配置服务器处理静态资源
  server: {
    fs: {
      // 允许访问依赖
