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
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 40px;
  max-width: 1200px;
  width: 100%;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: white;
  margin: 0;
}

.nav-menu {
  display: flex;
  gap: 20px;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-size: 16px;
  transition: opacity 0.2s;
}

.nav-link:hover {
  opacity: 0.8;
}

.app-main {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
}

.app-footer {
  height: 50px;
  background: #1a1a2e;
  display: flex;
  align-items: center;
  justify-content: center;
}

.app-footer p {
  color: #888;
  font-size: 14px;
  margin: 0;
}
</style>
