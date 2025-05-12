import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// 获取仓库名称作为base URL
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] || ''

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? `/${repo}/` : '/',
  plugins: [vue()],
})
