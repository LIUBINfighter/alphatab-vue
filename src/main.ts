// src/main.ts
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import pinia from './stores';
import './styles/style.css';

// --- 为 TypeScript 扩展 Window 接口 ---
declare global {
  interface Window {
    electronRuntime?: {
      isElectron: boolean;
      // 在 preload.js 中暴露的其他 API 也可以在这里声明类型
    }
  }
}

const isElectron = !!window.electronRuntime?.isElectron;
if (isElectron) {
  console.log('[main.ts] Running in Electron environment (detected via preload).');
} else {
  console.log('[main.ts] Running in Web environment.');
}

// --- 处理来自 404.html 的 SPA 重定向逻辑 (仅针对非 Electron 的 Web 环境) ---
let pathForRouterReplace: string | null = null;

if (!isElectron) {
  console.log('[main.ts] Checking for SPA redirect logic (Web environment).');
  const queryParams = new URLSearchParams(window.location.search);
  const pathFromParamP = queryParams.get('p');      // 例如 "/score/classic-guitar-loneliness-and-blue-planet"
  const originalQueryFromParamQ = queryParams.get('q'); // 例如 "param1=value1~and~param2=value2" 或 null
  const originalHash = window.location.hash;          // 例如 "#section1"

  if (pathFromParamP) {
    console.log('[main.ts] SPA redirect parameters (?p=) found. Processing...');
    // 1. 构建基础路径部分 (不含查询参数和哈希)
    let cleanPathname = import.meta.env.BASE_URL; // BASE_URL 会由 Vite 根据配置设定
    if (cleanPathname.endsWith('/') && pathFromParamP.startsWith('/')) {
      cleanPathname += pathFromParamP.substring(1);
    } else if (!cleanPathname.endsWith('/') && !pathFromParamP.startsWith('/')) {
      cleanPathname += '/' + pathFromParamP;
    } else {
      cleanPathname += pathFromParamP;
    }

    // 2. 构建原始查询字符串部分 (不含 '?p=')
    let cleanSearch = '';
    if (originalQueryFromParamQ) {
      cleanSearch = '?' + originalQueryFromParamQ.replace(/~and~/g, '&');
    }

    // 3. 组合成最终的、干净的 URL 用于 replaceState
    const finalNewUrl = cleanPathname + cleanSearch + originalHash;

    console.log('[main.ts] Redirect logic started (Non-Electron).');
    console.log('[main.ts] Current window.location.href (with ?p=):', window.location.href);
    console.log('[main.ts] import.meta.env.BASE_URL:', import.meta.env.BASE_URL);
    console.log('[main.ts] pathFromParamP (p):', pathFromParamP);
    console.log('[main.ts] originalQueryFromParamQ (q):', originalQueryFromParamQ);
    console.log('[main.ts] originalHash:', originalHash);
    console.log('[main.ts] Constructed cleanPathname:', cleanPathname);
    console.log('[main.ts] Constructed cleanSearch:', cleanSearch);
    console.log('[main.ts] Attempting to replaceState with finalNewUrl:', finalNewUrl);

    try {
      window.history.replaceState(null, '', finalNewUrl);
      console.log('[main.ts] URL after replaceState attempt (window.location.href):', window.location.href);
    } catch (e) {
      console.error('[main.ts] Error during window.history.replaceState:', e);
    }

    // 构建给 router.replace 用的相对路径 (相对于 BASE_URL)
    pathForRouterReplace = pathFromParamP + cleanSearch + originalHash;
    console.log('[main.ts] pathForRouterReplace set to:', pathForRouterReplace);
  } else {
    console.log('[main.ts] No SPA redirect parameters (?p=) found.');
  }
} else {
  console.log('[main.ts] Skipping SPA redirect logic (Electron environment).');
}
// --- 404 重定向逻辑结束 ---

const app = createApp(App);

app.use(pinia);
app.use(router);

// 如果我们通过 404 逻辑清理了 URL，现在需要确保 router 的状态也同步到这个干净的 URL
// 这个判断也只应该在非 Electron 环境且 pathForRouterReplace 被设置时执行
if (!isElectron && pathForRouterReplace) {
  console.log('[main.ts] Attempting to call router.replace with path:', pathForRouterReplace);
  router.replace(pathForRouterReplace).catch(err => {
    const errMessage = String(err.message || err.name || '');
    if (errMessage.includes('NavigationDuplicated') || errMessage.includes('redundant navigation')) {
      console.log('[main.ts] router.replace: Navigation was redundant or duplicated, which is acceptable here.');
    } else {
      console.error("[main.ts] router.replace failed:", err);
    }
  });
}

router.isReady().then(() => {
  console.log('[main.ts] Router is ready. Mounting app.');
  app.mount('#app');
}).catch(err => {
  console.error("[main.ts] Router failed to become ready:", err);
  app.mount('#app'); // 即使路由准备失败，也尝试挂载
});