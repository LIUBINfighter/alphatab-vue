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
      // 允许访问依赖项目录下的字体文件
      allow: ['..', 'node_modules']
    }
  },
  build: {
    // 构建相关配置
    rollupOptions: {
      // 确保字体文件被正确打包
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.woff') || assetInfo.name?.endsWith('.otf')) {
            return 'assets/fonts/[name][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        }
      }
    }
  }
})
