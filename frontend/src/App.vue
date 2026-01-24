<template>
  <div id="app">
    <!-- 顶部导航栏 -->
    <header class="app-header">
      <div class="header-content">
        <h1 class="logo">俄罗斯方块</h1>
        <nav class="nav-menu">
          <router-link to="/" class="nav-link">游戏</router-link>
          <router-link to="/leaderboard" class="nav-link">排行榜</router-link>
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
  </div>
</template>

<script setup lang="ts">
// 主应用组件
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #f1f5f9;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.app-header {
  height: 64px;
  background: rgba(30, 41, 59, 0.8);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(99, 102, 241, 0.2);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

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
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(135deg, #818cf8 0%, #c084fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}

.nav-menu {
  display: flex;
  gap: 8px;
}

.nav-link {
  color: #cbd5e1;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  padding: 8px 16px;
  border-radius: 6px;
}

.nav-link:hover {
  color: #f1f5f9;
  background: rgba(99, 102, 241, 0.1);
}

.nav-link.router-link-active {
  color: #f1f5f9;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(168, 85, 247, 0.3) 100%);
}

.app-main {
  flex: 1;
  padding: 24px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
}

.app-footer {
  height: 56px;
  background: rgba(30, 41, 59, 0.8);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid rgba(99, 102, 241, 0.2);
}

.app-footer p {
  color: #94a3b8;
  font-size: 13px;
  margin: 0;
}
</style>
