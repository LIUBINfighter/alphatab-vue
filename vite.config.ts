// vite.config.ts
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { alphaTab } from '@coderline/alphatab/vite';

export default defineConfig(({ mode }) => { // 注意这里接收 mode 参数
  // 加载当前工作目录下的 .env 文件 (如果存在)，并合并 process.env
  // 第三个参数 '' 表示加载所有环境变量，不仅仅是 VITE_ 开头的
  const env = loadEnv(mode, process.cwd(), '');

  const repoName = env.REPO_NAME;       // 例如 'alphatab-vue'，用于 GitHub Pages
  const targetEnv = env.VITE_TARGET_ENV; // 'electron' 或 'web' (或其他，默认为 web)

  let base = '/'; // 本地开发时的默认值

  if (mode === 'production') {
    if (targetEnv === 'electron') {
      base = './'; // Electron 打包时必须使用相对路径
      console.log('[vite.config.ts] Building for Electron, base set to "./"');
    } else if (repoName) {
      // 如果是为 GitHub Pages 构建 (targetEnv 可能为 'web' 或未定义)
      base = `/${repoName}/`;
      console.log(`[vite.config.ts] Building for GitHub Pages (repo: ${repoName}), base set to "${base}"`);
    } else {
      // 其他生产环境的 web 构建 (例如部署到自定义域名的根目录)
      base = '/';
      console.log('[vite.config.ts] Building for general web production, base set to "/"');
    }
  } else {
    console.log(`[vite.config.ts] Running in development mode, base set to "${base}" (Vite default)`);
  }

  return {
    plugins: [
      vue(),
      alphaTab({})
    ],
    base: base,
    build: {
      outDir: 'dist', // Vue 应用的构建输出目录
    },
    optimizeDeps: {
      exclude: [
        '@coderline/alphatab' // Exclude the entire package
      ]
    },
    // 如果在 Electron 中通过 file:// 协议加载时遇到 worker 问题，可能需要额外配置:
    // worker: {
    //   format: 'es', // 或者 'iife'，取决于你的 worker 代码
    // },
    // server: { // Vite dev server 配置
    //   port: 5173, // 默认端口，确保和 Electron HMR 脚本中的一致
    //   strictPort: true, // 如果端口被占用，则失败而不是尝试下一个
    // }
  };
});