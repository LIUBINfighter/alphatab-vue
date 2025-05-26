// src/main.ts
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import pinia from './stores';
import './styles/style.css';

// --- 处理来自 404.html 的 SPA 重定向逻辑 (针对 GitHub Pages) ---
const queryParams = new URLSearchParams(window.location.search);
const pathFromParamP = queryParams.get('p');          // 例如 "/score/classic-guitar-loneliness-and-blue-planet"
const originalQueryFromParamQ = queryParams.get('q'); // 例如 "param1=value1~and~param2=value2" 或 null
const originalHash = window.location.hash;            // 例如 "#section1"

// 我们需要一个变量来存储清理后的、供 router 使用的相对路径
let pathForRouterReplace: string | null = null;

if (pathFromParamP) {
  // 1. 构建基础路径部分 (不含查询参数和哈希)
  // import.meta.env.BASE_URL 应该是类似 "/alphatab-vue/"
  // pathFromParamP 应该是类似 "/score/classic-guitar-loneliness-and-blue-planet"
  let cleanPathname = import.meta.env.BASE_URL;
  if (cleanPathname.endsWith('/') && pathFromParamP.startsWith('/')) {
    cleanPathname += pathFromParamP.substring(1);
  } else if (!cleanPathname.endsWith('/') && !pathFromParamP.startsWith('/')) {
    cleanPathname += '/' + pathFromParamP;
  } else {
    cleanPathname += pathFromParamP;
  }
  // 此刻 cleanPathname 应该是例如 "/alphatab-vue/score/classic-guitar-loneliness-and-blue-planet"

  // 2. 构建原始查询字符串部分 (不含 '?p=')
  let cleanSearch = '';
  if (originalQueryFromParamQ) {
    cleanSearch = '?' + originalQueryFromParamQ.replace(/~and~/g, '&');
  }

  // 3. 组合成最终的、干净的 URL 用于 replaceState
  //    这个 URL 应该是相对于 origin 的绝对路径，包含路径、可选的真实查询参数和可选的哈希
  const finalNewUrl = cleanPathname + cleanSearch + originalHash;

  // 添加详细日志
  console.log('[main.ts] Redirect logic started.');
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
    // 立即检查 replaceState 之后 URL 是否真的变了
    console.log('[main.ts] URL after replaceState attempt (window.location.href):', window.location.href);
  } catch (e) {
    console.error('[main.ts] Error during window.history.replaceState:', e);
  }
  
  // 同时，构建给 router.replace 用的相对路径 (相对于 BASE_URL)
  // pathFromParamP 已经是这个相对路径了，例如 "/score/classic-guitar-loneliness-and-blue-planet"
  pathForRouterReplace = pathFromParamP + cleanSearch + originalHash;
}
// --- 404 重定向逻辑结束 ---

const app = createApp(App);

app.use(pinia);
app.use(router);

// 如果我们通过 404 逻辑清理了 URL，现在需要确保 router 的状态也同步到这个干净的 URL
if (pathForRouterReplace) {
  console.log('[main.ts] Attempting to call router.replace with path:', pathForRouterReplace);
  router.replace(pathForRouterReplace).catch(err => {
    // 如果 router 已经因为 window.history.replaceState 的效果处于正确的位置，
    // 再次 replace 到相同位置可能会报导航重复的错误，这通常可以忽略。
    const errMessage = String(err.message || err.name || '');
    if (errMessage.includes('NavigationDuplicated') || errMessage.includes('redundant navigation')) {
      console.log('[main.ts] router.replace: Navigation was redundant or duplicated, which is acceptable here.');
    } else {
      console.error("[main.ts] router.replace failed:", err);
    }
  });
}

// 等待路由准备好后再挂载应用，这对于确保所有导航逻辑（包括 router.replace）完成可能更稳妥
router.isReady().then(() => {
  console.log('[main.ts] Router is ready. Mounting app.');
  app.mount('#app');
}).catch(err => {
  console.error("[main.ts] Router failed to become ready:", err);
  // 即使路由准备失败，也尝试挂载，但可能功能不全
  app.mount('#app');
});