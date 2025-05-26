// src/main.ts
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import pinia from './stores';
import './styles/style.css';
import './styles/scrollbar.css';

// --- 处理来自 404.html 的 SPA 重定向逻辑 (针对 GitHub Pages) ---
const queryParams = new URLSearchParams(window.location.search);
const pathFromParamP = queryParams.get('p');          // 例如 "/score/classic-guitar-loneliness-and-blue-planet"
const originalQueryFromParamQ = queryParams.get('q'); // 例如 "param1=value1~and~param2=value2" 或 null
const originalHash = window.location.hash;            // 例如 "#section1"

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
  
}
// --- 404 重定向逻辑结束 ---

const app = createApp(App);

app.use(pinia);
app.use(router);

app.mount('#app');