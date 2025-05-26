// src/main.ts
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';      // 路由实例在这里创建
import pinia from './stores';       // Pinia 实例 (假设 './stores' 正确导出了 Pinia 实例)
import './styles/style.css';
import './styles/scrollbar.css';

// --- 处理来自 404.html 的 SPA 重定向逻辑 (针对 GitHub Pages) ---
const queryParams = new URLSearchParams(window.location.search);
const pathFromParamP = queryParams.get('p');          // 从 ?p=/score/your-alias 获取路径
const originalQueryFromParamQ = queryParams.get('q'); // 从 ?q=foo=bar 获取原始查询参数
const originalHash = window.location.hash;            // 获取原始哈希值 (例如 #section-id)

if (pathFromParamP) {
  // pathFromParamP 通常是相对于 BASE_URL 的路径，例如 /score/my-alias
  // import.meta.env.BASE_URL 是 Vite 设置的基础路径，例如 /alphatab-vue/
  // 我们需要构建在浏览器地址栏中显示的完整目标路径。

  let newUrl = import.meta.env.BASE_URL; // 例如 /alphatab-vue/

  //确保 BASE_URL 和 pathFromParamP 正确拼接 (避免双斜杠或缺少斜杠)
  if (newUrl.endsWith('/') && pathFromParamP.startsWith('/')) {
    newUrl += pathFromParamP.substring(1); // 例如 /alphatab-vue/ + score/my-alias
  } else if (!newUrl.endsWith('/') && !pathFromParamP.startsWith('/')) {
    newUrl += '/' + pathFromParamP; // 例如 /alphatab-vue + score/my-alias -> /alphatab-vue/score/my-alias
  } else {
    newUrl += pathFromParamP; // 例如 /alphatab-vue/score/my-alias (pathFromParamP 不以 / 开头) 或 /alphatab-vue + /score/my-alias
  }

  if (originalQueryFromParamQ) {
    newUrl += '?' + originalQueryFromParamQ.replace(/~and~/g, '&');
  }
  
  // 哈希值会由浏览器自动附加到 replaceState 生成的 URL 末尾，如果它是 window.location.hash 的一部分
  // 或者，我们可以明确地将其包含在 newUrl 中，以确保它被设置。
  // 但通常，如果 window.location.hash 存在，它在 replaceState 后仍会是 URL 的一部分。
  // 为了保险起见，可以显式添加：
  if (originalHash) {
     newUrl += originalHash;
  }
  
  // 使用修正后的 "干净" URL 替换当前历史记录条目
  window.history.replaceState(null, '', newUrl);
  // 执行此操作后，当 Vue Router 初始化时，它将读取这个干净的 URL。
}
// --- 404 重定向逻辑结束 ---

const app = createApp(App);

app.use(pinia);
app.use(router);

app.mount('#app');