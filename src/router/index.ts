// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import ScorePlayerView from '../views/ScorePlayerView.vue';
import TexEditorView from '../views/TexEditorView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/score',
    },
    {
      path: '/score',
      name: 'ScorePlayer',
      component: ScorePlayerView,
    },
    {
      path: '/editor',
      name: 'TexEditor',
      component: TexEditorView,
    },
  ],
});

export default router;