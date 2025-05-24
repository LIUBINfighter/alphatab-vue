// src/router/index.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

// 我们将为 SimpleDisplay 创建一个简单的包装视图
// TexEditorView 已经存在于 src/views/TexEditorView.vue
import ScorePlayerView from '../views/ScorePlayerView.vue'; // 新建此文件
import TexEditorView from '../views/TexEditorView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/score', // 默认重定向到乐谱播放界面
  },
  {
    path: '/score',
    name: 'ScorePlayer', // 给路由命名
    component: ScorePlayerView,
  },
  {
    path: '/editor',
    name: 'TexEditor',   // 给路由命名
    component: TexEditorView,
  },
  // 你可以稍后添加带参数的路由，比如 /score/:scoreId
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // 使用 HTML5 History 模式
  routes,
});

export default router;