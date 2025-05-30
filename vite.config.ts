// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { alphaTab } from '@coderline/alphatab/vite';

export default defineConfig(({ mode }) => { // 注意这里接收 mode 参数
  // REPO_NAME 会由 GitHub Actions 在构建时传入
  // 仓库名是 'alphatab-vue'
  const repoName = process.env.REPO_NAME;

  return {
    plugins: [
      vue(),
      alphaTab({})
    ],
    // - 本地开发 (mode !== 'production') 时，base 通常是 '/'，这样访问 http://localhost:5173/ 即可
    // - 生产构建 (mode === 'production') 时，base 应该是 '/<你的仓库名>/'
    base: mode === 'production' && repoName ? `/${repoName}/` : '/',
      optimizeDeps: {
    exclude: [
      '@coderline/alphatab' // Exclude the entire package
    ]
  },
  };
});