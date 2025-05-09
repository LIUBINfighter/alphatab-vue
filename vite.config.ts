import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  // 配置静态资源处理
  assetsInclude: ['**/*.gp', '**/*.gp3', '**/*.gp4', '**/*.gp5', '**/*.gpx'],
  // 开发服务器配置
  server: {
    fs: {
      // 允许服务来自项目根目录外的文件
      strict: false
    }
  },
  build: {
    // 确保构建时不会排除这些文件
    assetsInlineLimit: 0
  }
})
