<template>
  <div class="mobile-app">
    <!-- 移动端应用容器 -->
    <component :is="currentPage" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { getDeviceType, onResize } from '@/utils/device';
import MobileLogin from '@/components/mobile/MobileLogin.vue';
import MobileGuide from '@/components/mobile/MobileGuide.vue';
import MobileGame from '@/components/mobile/MobileGame.vue';
import MobileLeaderboard from '@/components/mobile/MobileLeaderboard.vue';

const route = useRoute();
const currentPage = ref<any>(MobileLogin); // 默认显示登录页

// 根据当前路由显示不同页面
const loadPage = () => {
  const path = route.path;

  if (path === '/' || path === '/game') {
    // 检查是否有用户名
    const username = localStorage.getItem('username');
    if (!username) {
      currentPage.value = MobileLogin;
    } else {
      const hasSeenGuide = sessionStorage.getItem('hasSeenGuide');
      if (!hasSeenGuide) {
        currentPage.value = MobileGuide;
      } else {
        currentPage.value = MobileGame;
      }
    }
  } else if (path === '/leaderboard') {
    currentPage.value = MobileLeaderboard;
  } else if (path === '/m/guide') {
    currentPage.value = MobileGuide;
  } else if (path === '/m/game') {
    currentPage.value = MobileGame;
  } else if (path === '/m/leaderboard') {
    currentPage.value = MobileLeaderboard;
  } else {
    // 默认显示登录页
    currentPage.value = MobileLogin;
  }
};

onMounted(() => {
  loadPage();

  // 监听路由变化
  window.addEventListener('popstate', loadPage);
});

// 监听路由变化
watch(() => route.path, () => {
  loadPage();
});
</script>

<style>
.mobile-app {
  width: 100%;
  min-height: 100vh;
  background: #0F0F1A;
  overflow-x: hidden;
}
</style>
