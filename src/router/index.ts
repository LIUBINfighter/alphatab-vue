// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import ScorePlayerView from '../views/ScorePlayerView.vue';
import TexEditorView from '../views/TexEditorView.vue';
// 确保你导入了 availableScores，以便获取默认别名
import { availableScores } from '../config/availableScores'; 

// 使用第一个乐谱的别名作为默认值 (如果列表为空，则提供一个后备值)
const defaultScoreAlias = availableScores.value[0]?.alias || 'default-fallback-alias';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      // 旧: redirect: `/score/${defaultScoreFilename}`, 
      redirect: `/score/${defaultScoreAlias}`, // 新: 重定向到默认乐谱的别名
    },
    {
      // 旧: path: '/score/:scoreFilename',
      path: '/score/:scoreAlias', // 新: 使用 :scoreAlias 作为参数名称
      name: 'ScorePlayer',
      component: ScorePlayerView,
      props: true, // 这会将 :scoreAlias 作为 prop 传递给 ScorePlayerView
    },
    {
      path: '/editor',
      name: 'TexEditor',
      component: TexEditorView,
      // 稍后可能的更改: path: '/editor/:fileId?', props: true
    },
  ],
});

export default router;