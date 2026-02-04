<template>
  <div class="mobile-leaderboard">
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
      <!-- 标题栏 -->
      <div class="header">
        <button class="back-btn" @click="goBack">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <div class="title-section">
          <h1 class="title">排行榜</h1>
          <p class="subtitle">全球玩家积分排名</p>
        </div>
      </div>

      <!-- 排行榜列表 -->
      <div class="rank-list">
        <!-- 第1名 -->
        <div class="rank-item rank-1">
          <div class="rank-badge gold">1</div>
          <div class="player-info">
            <span class="player-name">王者之星</span>
            <span class="player-level">Lv20</span>
          </div>
          <span class="score">25,680</span>
        </div>

        <!-- 第2名 -->
        <div class="rank-item rank-2">
          <div class="rank-badge silver">2</div>
          <div class="player-info">
            <span class="player-name">方块大师</span>
            <span class="player-level">Lv18</span>
          </div>
          <span class="score">21,340</span>
        </div>

        <!-- 第3名 -->
        <div class="rank-item rank-3">
          <div class="rank-badge bronze">3</div>
          <div class="player-info">
            <span class="player-name">消行高手</span>
            <span class="player-level">Lv16</span>
          </div>
          <span class="score">18,920</span>
        </div>

        <!-- 第4名 -->
        <div class="rank-item">
          <div class="rank-badge">4</div>
          <div class="player-info">
            <span class="player-name">速度达人</span>
            <span class="player-level">Lv15</span>
          </div>
          <span class="score">15,670</span>
        </div>

        <!-- 第5名 -->
        <div class="rank-item">
          <div class="rank-badge">5</div>
          <div class="player-info">
            <span class="player-name">游戏玩家</span>
            <span class="player-level">Lv14</span>
          </div>
          <span class="score">12,450</span>
        </div>

        <!-- 当前玩家 -->
        <div class="rank-item current-player">
          <div class="rank-badge highlight">6</div>
          <div class="player-info">
            <span class="player-name highlight">玩家 (你)</span>
            <span class="player-level">Lv5</span>
          </div>
          <span class="score highlight">2,450</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  router.back();
};
</script>

<style scoped>
.mobile-leaderboard {
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
  gap: 20px;
}

.header {
  display: flex;
  gap: 12px;
  align-items: center;
}

.back-btn {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(0, 217, 255, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.back-btn svg {
  stroke: #00D9FF;
}

.title-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.title {
  font-family: 'Outfit', sans-serif;
  font-size: 28px;
  font-weight: 800;
  color: white;
  margin: 0;
}

.subtitle {
  font-family: 'Outfit', sans-serif;
  font-size: 14px;
  color: #B0B0C0;
  margin: 0;
}

.rank-list {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 217, 255, 0.3);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rank-item {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 12px 0;
}

.rank-item.rank-1 {
  background: linear-gradient(90deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 215, 0, 0.1) 100%);
  border-radius: 12px;
}

.rank-item.current-player {
  border: 2px solid rgba(0, 217, 255, 0.6);
  border-radius: 12px;
  padding: 12px;
}

.rank-badge {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Outfit', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: white;
  background: rgba(255, 255, 255, 0.08);
}

.rank-badge.gold {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  color: black;
}

.rank-badge.silver {
  background: linear-gradient(135deg, #C0C0C0 0%, #A8A8A8 100%);
  color: black;
}

.rank-badge.bronze {
  background: linear-gradient(135deg, #CD7F32 0%, #B87333 100%);
  color: white;
}

.rank-badge.highlight {
  background: rgba(0, 217, 255, 0.3);
  color: #00D9FF;
}

.player-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.player-name {
  font-family: 'Outfit', sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: white;
}

.player-name.highlight {
  color: #00D9FF;
}

.player-level {
  font-family: 'Outfit', sans-serif;
  font-size: 12px;
  color: #B0B0C0;
}

.score {
  font-family: 'Outfit', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #FFD700;
  letter-spacing: -0.5;
}

.score.highlight {
  color: #00D9FF;
}
</style>
