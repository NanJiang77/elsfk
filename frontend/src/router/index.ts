import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Game',
    component: () => import('@/views/GamePage.vue'),
  },
  {
    path: '/leaderboard',
    name: 'LeaderBoard',
    component: () => import('@/views/LeaderBoardPage.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
