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
  // 移动端路由
  {
    path: '/m/guide',
    name: 'MobileGuide',
    component: () => import('@/components/mobile/MobileGuide.vue'),
  },
  {
    path: '/m/game',
    name: 'MobileGame',
    component: () => import('@/components/mobile/MobileGame.vue'),
  },
  {
    path: '/m/leaderboard',
    name: 'MobileLeaderboard',
    component: () => import('@/components/mobile/MobileLeaderboard.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
