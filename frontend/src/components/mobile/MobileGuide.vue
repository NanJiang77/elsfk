<template>
  <div class="mobile-guide">
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
      <!-- 标题 -->
      <div class="header">
        <div class="logo-icon">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="2" width="20" height="20" rx="2" ry="2"></rect>
            <path d="M12 6v12"></path>
            <path d="M8 12h8"></path>
          </svg>
        </div>
        <h1 class="title">如何游玩</h1>
        <p class="subtitle">掌握方块移动，挑战最高分</p>
      </div>

      <!-- 游戏规则 -->
      <div class="card">
        <h2 class="card-title">🎯 游戏目标</h2>
        <p class="card-text">• 控制下落的方块，填满整行即可消除</p>
        <p class="card-text">• 同时消除多行可获得更高分数</p>
        <p class="card-text">• 消除越多分数越高，等级提升速度越快</p>
      </div>

      <!-- 操作方式 -->
      <div class="card">
        <h2 class="card-title">🎮 操作方式</h2>

        <div class="control-item">
          <div class="control-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </div>
          <span class="control-desc">左右移动方块位置</span>
        </div>

        <div class="control-item">
          <div class="control-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <polyline points="19 12 12 5 5 12"></polyline>
            </svg>
          </div>
          <span class="control-desc">旋转方块调整方向</span>
        </div>

        <div class="control-item">
          <div class="control-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
            </svg>
          </div>
          <span class="control-desc">加速下落</span>
        </div>

        <div class="control-item special">
          <div class="control-icon special-icon">
            ⚡
          </div>
          <span class="control-desc">空格键瞬间落地</span>
        </div>
      </div>

      <!-- 计分规则 -->
      <div class="card">
        <h2 class="card-title">📊 计分规则</h2>
        <div class="score-row">
          <span>消除 1 行</span>
          <span class="score-value">100 分</span>
        </div>
        <div class="score-row">
          <span>消除 2 行</span>
          <span class="score-value">300 分</span>
        </div>
        <div class="score-row">
          <span>消除 3 行</span>
          <span class="score-value">500 分</span>
        </div>
        <div class="score-row">
          <span>消除 4 行</span>
          <span class="score-value gold">800 分</span>
        </div>
      </div>

      <!-- 开始按钮 -->
      <button class="start-button" @click="startGame">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
        <span>开始游戏</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const startGame = () => {
  sessionStorage.setItem('hasSeenGuide', 'true');
  router.push('/m/game');
};
</script>

<style scoped>
.mobile-guide {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #0F0F1A 0%, #1A1A2E 50%, #16213E 100%);
}

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

.content {
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.header {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  padding-top: 20px;
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
  font-size: 32px;
  font-weight: 800;
  color: white;
  margin: 0;
  text-align: center;
  letter-spacing: -1px;
}

.subtitle {
  font-family: 'Outfit', sans-serif;
  font-size: 15px;
  color: #B0B0C0;
  margin: 0;
  text-align: center;
}

.card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 217, 255, 0.3);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card-title {
  font-family: 'Outfit', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #00D9FF;
  margin: 0;
}

.card-text {
  font-family: 'Outfit', sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: white;
  margin: 0;
}

.control-item {
  display: flex;
  gap: 12px;
  align-items: center;
}

.control-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: rgba(0, 217, 255, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
}

.control-icon svg {
  stroke: #00D9FF;
}

.control-item.special .control-icon {
  background: rgba(255, 215, 0, 0.2);
}

.special-icon {
  font-size: 20px;
  font-weight: 700;
  color: #FFD700;
}

.control-desc {
  font-family: 'Outfit', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: white;
}

.score-row {
  display: flex;
  justify-content: space-between;
  font-family: 'Outfit', sans-serif;
  font-size: 14px;
  color: white;
}

.score-value {
  font-weight: 600;
  color: #00D9FF;
}

.score-value.gold {
  color: #FFD700;
}

.start-button {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  width: 100%;
  height: 56px;
  border: none;
  border-radius: 16px;
  background: linear-gradient(90deg, #00D9FF 0%, #0099FF 100%);
  color: white;
  font-family: 'Outfit', sans-serif;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0, 217, 255, 0.6);
}
</style>
