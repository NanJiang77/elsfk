<template>
  <div id="app" :class="{ 'is-mobile': isDeviceMobile }">
    <!-- 移动端布局 -->
    <MobileApp v-if="isDeviceMobile" />

    <!-- 桌面端布局 - 只在真正的桌面设备上渲染 -->
    <template v-if="!isDeviceMobile && isDesktopDevice">
      <!-- CRT 扫描线效果 -->
      <div class="crt-overlay"></div>

      <!-- 顶部导航栏 -->
      <header class="app-header">
        <div class="header-content">
          <h1 class="logo">俄罗斯方块</h1>
          <nav class="nav-menu" aria-label="主导航">
            <router-link to="/" class="nav-link" aria-label="前往游戏页面">游戏</router-link>
            <router-link to="/leaderboard" class="nav-link" aria-label="查看排行榜">排行榜</router-link>
          </nav>
        </div>
      </header>

      <!-- 主内容区域 -->
      <main class="app-main">
        <router-view />
      </main>

      <!-- 底部页脚 -->
      <footer class="app-footer">
        <p>&copy; 2026 俄罗斯方块 | 使用 Vue 3 + Canvas 构建</p>
      </footer>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { isMobile as checkIsMobile, onResize } from '@/utils/device';
import MobileApp from '@/components/mobile/MobileApp.vue';

// 设备检测 - 默认假设为移动设备，更安全
const isDeviceMobile = ref(true);
const isDesktopDevice = ref(false);

// 在客户端重新检测
onMounted(() => {
  // 立即检测设备类型
  const detectedMobile = checkIsMobile();

  // 如果检测到是桌面设备，只在不触摸的情况下才切换
  // 有触摸功能的设备（如 iPad）应该显示移动端
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (!detectedMobile && !hasTouch && window.innerWidth > 768) {
    isDeviceMobile.value = false;
    isDesktopDevice.value = true;
  } else {
    isDeviceMobile.value = true;
    isDesktopDevice.value = false;
  }
});

// 监听窗口大小变化
let cleanupResize: (() => void) | undefined;

onMounted(() => {
  cleanupResize = onResize(() => {
    // 窗口大小变化时，只在真正需要时才切换
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const detectedMobile = checkIsMobile();

    if (!detectedMobile && !hasTouch && window.innerWidth > 768) {
      isDeviceMobile.value = false;
      isDesktopDevice.value = true;
    } else {
      isDeviceMobile.value = true;
      isDesktopDevice.value = false;
    }
  });
});

onUnmounted(() => {
  if (cleanupResize) {
    cleanupResize();
  }
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  /* 科技感配色方案 */
  --tech-bg: #0a0e1a;
  --tech-panel: rgba(16, 24, 40, 0.9);
  --tech-border: rgba(56, 139, 200, 0.3);
  --tech-accent: #38bdf8;
  --tech-accent-2: #22d3d3;
  --tech-accent-3: #818cf8;
  --tech-text: #e2e8f0;
  --tech-text-muted: #94a3b8;
  --tech-grid: rgba(56, 139, 200, 0.04);
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--tech-bg);
  color: var(--tech-text);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  position: relative;
  overflow-x: hidden;
}

/* 六边形网格背景 */
#app::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    linear-gradient(30deg, var(--tech-grid) 12%, transparent 12.5%, transparent 87%, var(--tech-grid) 87.5%, var(--tech-grid)),
    linear-gradient(150deg, var(--tech-grid) 12%, transparent 12.5%, transparent 87%, var(--tech-grid) 87.5%, var(--tech-grid)),
    linear-gradient(30deg, var(--tech-grid) 12%, transparent 12.5%, transparent 87%, var(--tech-grid) 87.5%, var(--tech-grid)),
    linear-gradient(150deg, var(--tech-grid) 12%, transparent 12.5%, transparent 87%, var(--tech-grid) 87.5%, var(--tech-grid)),
    linear-gradient(60deg, rgba(56, 139, 200, 0.03) 25%, transparent 25.5%, transparent 75%, rgba(56, 139, 200, 0.03) 75%, rgba(56, 139, 200, 0.03)),
    linear-gradient(60deg, rgba(56, 139, 200, 0.03) 25%, transparent 25.5%, transparent 75%, rgba(56, 139, 200, 0.03) 75%, rgba(56, 139, 200, 0.03));
  background-size: 80px 140px;
  background-position: 0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px;
  pointer-events: none;
  z-index: 0;
}

/* 扫描线效果 */
.crt-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    180deg,
    transparent 50%,
    rgba(56, 139, 200, 0.02) 50%
  );
  background-size: 100% 4px;
  pointer-events: none;
  z-index: 9999;
  animation: scanMove 8s linear infinite;
}

@keyframes scanMove {
  0% { background-position: 0 0; }
  100% { background-position: 0 4px; }
}

/* 减少动画效果 - 支持动画敏感用户 */
@media (prefers-reduced-motion: reduce) {
  .crt-overlay {
    animation: none !important;
  }

  .logo::before,
  .logo::after {
    animation: none !important;
    content: '';
    opacity: 1;
  }

  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

.app-header {
  height: 64px;
  background: var(--tech-panel);
  backdrop-filter: blur(16px);
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid var(--tech-border);
  position: relative;
  z-index: 10;
}

.app-header::before,
.app-header::after {
  content: '';
  position: absolute;
  bottom: -1px;
  width: 60px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--tech-accent), transparent);
}

.app-header::before { left: 0; }
.app-header::after { right: 0; }

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  max-width: 1400px;
  width: 100%;
  padding: 0 24px;
}

.logo {
  font-family: 'JetBrains Mono', monospace;
  font-size: 16px;
  font-weight: 600;
  color: var(--tech-accent);
  margin: 0;
  letter-spacing: 0.05em;
  position: relative;
}

.logo::before {
  content: '> ';
  color: var(--tech-accent-2);
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  50% { opacity: 0; }
}

.logo::after {
  content: '_';
  animation: blink 1s step-end infinite;
}

.nav-menu {
  display: flex;
  gap: 4px;
}

.nav-link {
  color: var(--tech-text-muted);
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;
  padding: 8px 16px;
  border-radius: 4px;
  font-family: 'JetBrains Mono', monospace;
  position: relative;
  cursor: pointer;
}

.nav-link:hover {
  color: var(--tech-accent);
  background: rgba(56, 139, 200, 0.08);
}

.nav-link:focus-visible {
  outline: 2px solid var(--tech-accent);
  outline-offset: 2px;
}

.nav-link.router-link-active {
  color: var(--tech-accent);
  background: rgba(56, 139, 200, 0.1);
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 2px;
  background: var(--tech-accent);
  border-radius: 1px;
}

.app-main {
  flex: 1;
  padding: 32px 24px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  position: relative;
  z-index: 2;
}

.app-footer {
  height: 52px;
  background: var(--tech-panel);
  backdrop-filter: blur(16px);
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid var(--tech-border);
  position: relative;
  z-index: 10;
}

.app-footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--tech-accent), transparent);
}

.app-footer p {
  font-family: 'JetBrains Mono', monospace;
  color: var(--tech-text-muted);
  font-size: 11px;
  font-weight: 500;
  margin: 0;
  letter-spacing: 0.05em;
}
</style>
