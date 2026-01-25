<template>
  <main class="leaderboard-page" role="main" aria-label="排行榜">
    <div class="leaderboard-container">
      <h1 class="page-title">排行榜</h1>

      <el-table
        :data="leaderboardData"
        style="width: 100%"
        :border="true"
        :stripe="false"
        aria-label="游戏排行榜"
      >
        <el-table-column prop="rank" label="排名" width="80" align="center" />
        <el-table-column prop="player_name" label="玩家" min-width="120" />
        <el-table-column prop="score" label="分数" width="120" align="center" sortable />
        <el-table-column prop="level" label="等级" width="100" align="center" />
        <el-table-column prop="lines" label="行数" width="100" align="center" />
        <el-table-column prop="play_time" label="时长(秒)" width="120" align="center" />
        <el-table-column prop="created_at" label="时间" min-width="160" />
      </el-table>

      <div class="back-section">
        <el-button @click="goBack" aria-label="返回游戏页面">返回游戏</el-button>
        <el-button @click="refreshData" :loading="loading" aria-label="刷新排行榜数据">
          刷新
        </el-button>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { leaderboardApi } from '@/services/api';
import { leaderboardWS } from '@/services/websocket';
import type { LeaderBoardEntry } from '@/types/game';
import { ElMessage } from 'element-plus';
import axios from 'axios';

const router = useRouter();
const leaderboardData = ref<LeaderBoardEntry[]>([]);
const loading = ref(false);

// 用于存储取消订阅的函数
let unsubscribeLeaderboardUpdate: (() => void) | null = null;

const loadLeaderboard = async () => {
  loading.value = true;
  try {
    console.log('[Leaderboard] 开始加载排行榜...');
    console.log('[Leaderboard] API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
    const data = await leaderboardApi.getTopScores(10);
    console.log('[Leaderboard] 数据加载成功:', data);
    leaderboardData.value = data.map((item: LeaderBoardEntry, index: number) => ({
      ...item,
      rank: index + 1,
    }));
    ElMessage.success('排行榜加载成功');
  } catch (error) {
    console.error('[Leaderboard] 加载排行榜失败:', error);
    console.error('[Leaderboard] 错误详情:', {
      message: (error as Error).message,
      code: (error as any).code,
      response: (error as any).response?.data,
      config: (error as any).config
    });

    // 显示更友好的错误提示
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        ElMessage.warning('无法连接到服务器，请确保后端服务已启动');
      } else if (error.response) {
        ElMessage.error(`服务器错误: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      } else {
        ElMessage.error(`加载排行榜失败: ${error.message}`);
      }
    } else {
      ElMessage.error('加载排行榜失败，请稍后重试');
    }
  } finally {
    loading.value = false;
  }
};

const refreshData = () => {
  loadLeaderboard();
};

const goBack = () => {
  router.push('/');
};

onMounted(() => {
  console.log('[LeaderboardPage] Component mounted, loading data...');
  loadLeaderboard();

  // 连接WebSocket (可选，失败不影响页面功能)
  try {
    console.log('[LeaderboardPage] Connecting to WebSocket...');
    leaderboardWS.connect();

    // 订阅排行榜更新，并保存取消订阅函数
    unsubscribeLeaderboardUpdate = leaderboardWS.on('leaderboard_update', async () => {
      console.log('[LeaderboardPage] Received leaderboard update, refreshing...');
      // 实时刷新排行榜
      await loadLeaderboard();
    });
    console.log('[LeaderboardPage] WebSocket subscribed successfully');
  } catch (error) {
    console.warn('[LeaderboardPage] WebSocket连接失败，将使用手动刷新:', error);
  }
});

onUnmounted(() => {
  console.log('[LeaderboardPage] Component unmounting, cleaning up...');

  // 取消订阅
  if (unsubscribeLeaderboardUpdate) {
    unsubscribeLeaderboardUpdate();
    unsubscribeLeaderboardUpdate = null;
  }

  // 断开WebSocket
  leaderboardWS.disconnect();
  console.log('[LeaderboardPage] Cleanup complete');
});
</script>

<style scoped>
.leaderboard-page {
  width: 100%;
  min-height: calc(100vh - 116px);
  display: flex;
  justify-content: center;
  position: relative;
}

.leaderboard-container {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  background: var(--tech-panel);
  backdrop-filter: blur(16px);
  border-radius: 6px;
  border: 1px solid var(--tech-border);
  padding: 24px;
}

.page-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 18px;
  font-weight: 600;
  color: var(--tech-accent);
  margin-bottom: 24px;
  text-align: center;
  letter-spacing: 0.05em;
}

.back-section {
  margin-top: 24px;
  display: flex;
  gap: 12px;
  justify-content: center;
}

/* Element Plus Table 样式 - 科技风格 */
:deep(.el-table) {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: var(--tech-text);
  background: transparent !important;
  border: 1px solid var(--tech-border);
}

:deep(.el-table__inner-wrapper) {
  border-radius: 4px;
  overflow: hidden;
}

:deep(.el-table th.el-table__cell) {
  font-family: 'JetBrains Mono', monospace;
  background: rgba(56, 139, 200, 0.08) !important;
  color: var(--tech-text-muted);
  font-weight: 600;
  font-size: 11px;
  padding: 12px 0;
  border-bottom: 1px solid var(--tech-border) !important;
  border-right: 1px solid var(--tech-border) !important;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

:deep(.el-table th.el-table__cell:last-child) {
  border-right: none !important;
}

:deep(.el-table tr) {
  background: transparent !important;
  transition: all 0.2s ease;
}

:deep(.el-table tr:hover > td) {
  background: rgba(56, 139, 200, 0.05) !important;
}

:deep(.el-table td.el-table__cell) {
  padding: 12px 0;
  border-bottom: 1px solid var(--tech-border) !important;
  border-right: 1px solid var(--tech-border) !important;
  color: var(--tech-text);
  background: transparent !important;
  font-weight: 500;
}

:deep(.el-table td.el-table__cell:last-child) {
  border-right: none !important;
}

:deep(.el-table__body tr:last-child td.el-table__cell) {
  border-bottom: none !important;
}

:deep(.el-table__empty-block) {
  background: rgba(56, 139, 200, 0.02) !important;
}

:deep(.el-table__empty-text) {
  font-family: 'JetBrains Mono', monospace;
  color: var(--tech-text-muted);
}

/* 排名数字样式 - 前三名特殊样式 */
:deep(.el-table__body .el-table__row td:first-child) {
  font-family: 'JetBrains Mono', monospace;
  color: var(--tech-accent);
  font-weight: 600;
}

:deep(.el-table__body .el-table__row:nth-child(1) td:first-child) {
  color: var(--tech-accent-2);
  font-weight: 700;
}

/* 分数列样式 */
:deep(.el-table__body .el-table__row td:nth-child(3)) {
  font-family: 'JetBrains Mono', monospace;
  color: var(--tech-accent);
  font-weight: 600;
}

/* Element Plus Button 样式 - 科技风格 */
:deep(.el-button) {
  font-family: 'JetBrains Mono', monospace;
  height: 36px;
  padding: 0 20px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 4px;
  border: 1px solid var(--tech-border);
  background: transparent;
  color: var(--tech-text);
  transition: all 0.2s ease;
  cursor: pointer;
}

:deep(.el-button:hover) {
  background: var(--tech-accent);
  border-color: var(--tech-accent);
  color: var(--tech-bg);
}

:deep(.el-button:focus-visible) {
  outline: 2px solid var(--tech-accent);
  outline-offset: 2px;
}

:deep(.el-button.is-loading) {
  opacity: 0.7;
}
</style>
