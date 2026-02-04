<template>
  <div class="mobile-login">
    <!-- 状态栏 -->
    <div class="status-bar">
      <span class="time">9:41</span>
      <div class="levels">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
          <path d="M1.42 9a16 16 0 0 1 11.14 0"></path>
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
          <line x1="20" y1="5" x2="20" y2="19"></line>
        </svg>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
          <path d="M12 20a9 9 0 1 0 0-18 9 9 0 0 0 0 18"></path>
          <path d="M12 2v20"></path>
          <path d="m2 12 20 0"></path>
        </svg>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="2" y="7" width="20" height="10" rx="2" ry="2"></rect>
          <line x1="22" y1="11" x2="22" y2="11"></line>
        </svg>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content">
      <!-- Logo 区域 -->
      <div class="logo-section">
        <div class="logo-icon">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="2" width="20" height="20" rx="2" ry="2"></rect>
            <path d="M12 6v12"></path>
            <path d="M8 12h8"></path>
          </svg>
        </div>
        <h1 class="title">俄罗斯方块</h1>
        <p class="subtitle">开始你的游戏之旅</p>
      </div>

      <!-- 登录卡片 -->
      <div class="login-card">
        <h2 class="welcome">欢迎回来</h2>
        <p class="description">请输入你的用户名开始游戏</p>

        <!-- 输入框 -->
        <div class="input-container">
          <label class="label">用户名</label>
          <div class="input-field">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <input
              v-model="username"
              type="text"
              placeholder="请输入用户名 (2-20个字符)"
              maxlength="20"
              @keyup.enter="handleLogin"
            />
          </div>
        </div>

        <!-- 开始按钮 -->
        <button class="start-button" @click="handleLogin">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          <span>开始游戏</span>
        </button>
      </div>

      <!-- 游戏说明 -->
      <div class="hint-section">
        <div class="hint-header">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <span class="hint-title">游戏说明</span>
        </div>
        <p class="hint-text">
          使用方向键移动和旋转方块，空格键快速下落。消除更多行获得更高分数！
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref('');

const handleLogin = () => {
  const trimmed = username.value.trim();

  if (trimmed.length < 2 || trimmed.length > 20) {
    alert('用户名长度必须在2-20个字符之间');
    return;
  }

  // 保存用户名
  localStorage.setItem('username', trimmed);

  // 跳转到引导页
  router.push('/m/guide');
};

// 设置用户名（用于测试）
const setUsername = (value: string) => {
  username.value = value;
};

// 暴露给测试使用
defineExpose({
  username,
  handleLogin,
  setUsername,
});
</script>

<style scoped>
.mobile-login {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #0F0F1A 0%, #1A1A2E 50%, #16213E 100%);
  position: relative;
}

/* 状态栏 */
.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 21px 24px 19px;
  color: white;
}

.time {
  font-family: 'Inter', sans-serif;
  font-size: 17px;
  font-weight: 600;
}

.levels {
  display: flex;
  gap: 6px;
}

.levels svg {
  stroke: white;
}

/* 内容区 */
.content {
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* Logo 区域 */
.logo-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  padding-top: 60px;
}

.logo-icon {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: linear-gradient(135deg, #00D9FF 0%, #0099FF 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 30px rgba(0, 217, 255, 0.5);
}

.logo-icon svg {
  stroke: white;
}

.title {
  font-family: 'Outfit', sans-serif;
  font-size: 34px;
  font-weight: 800;
  color: white;
  letter-spacing: -1px;
  margin: 0;
  text-align: center;
}

.subtitle {
  font-family: 'Outfit', sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: #B0B0C0;
  margin: 0;
  text-align: center;
}

/* 登录卡片 */
.login-card {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(0, 217, 255, 0.3);
  border-radius: 16px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.welcome {
  font-family: 'Outfit', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: white;
  margin: 0;
}

.description {
  font-family: 'Outfit', sans-serif;
  font-size: 14px;
  color: #B0B0C0;
  margin: 0;
}

/* 输入框 */
.input-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.label {
  font-family: 'Outfit', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: white;
}

.input-field {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1.5px solid rgba(209, 208, 205, 1);
  border-radius: 12px;
  padding: 0 16px;
  height: 48px;
}

.input-field svg {
  stroke: #9C9B99;
  flex-shrink: 0;
}

.input-field input {
  flex: 1;
  border: none;
  background: transparent;
  color: white;
  font-family: 'Outfit', sans-serif;
  font-size: 15px;
  outline: none;
}

.input-field input::placeholder {
  color: #9C9B99;
}

.input-field input:focus {
  outline: none;
}

/* 开始按钮 */
.start-button {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  width: 100%;
  height: 56px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(90deg, #00D9FF 0%, #0099FF 100%);
  color: white;
  font-family: 'Outfit', sans-serif;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0, 217, 255, 0.6);
  transition: transform 0.2s, box-shadow 0.2s;
}

.start-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(0, 217, 255, 0.7);
}

.start-button:active {
  transform: translateY(0);
}

/* 游戏说明 */
.hint-section {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 217, 255, 0.2);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.hint-header {
  display: flex;
  gap: 8px;
  align-items: center;
}

.hint-header svg {
  stroke: #00D9FF;
}

.hint-title {
  font-family: 'Outfit', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: white;
}

.hint-text {
  font-family: 'Outfit', sans-serif;
  font-size: 12px;
  line-height: 1.5;
  color: #6D6C6A;
  margin: 0;
}
</style>
